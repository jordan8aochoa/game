import SpriteKit

// MARK: - Game states
enum GameState {
    case playing, paused, gameOver, levelComplete
}

class GameScene: SKScene, SKPhysicsContactDelegate {

    // MARK: - Layers
    private var worldNode:    SKNode!     // scrolls with camera
    private var hudLayer:     SKNode!     // fixed UI
    private var controlsNode: ControlsNode!
    private var hudNode:      HUDNode!

    // MARK: - Game objects
    private var player: PlayerNode!
    private var platforms: [PlatformBlock] = []
    private var collectibles: [CollectibleNode] = []

    // MARK: - State
    private var gameState: GameState = .playing
    private var currentLevel: Int    = 1
    private var lastUpdateTime: TimeInterval = 0
    private var deathTimer: TimeInterval = 0
    private let deathDelay: TimeInterval = 1.2

    // Camera follow
    private var cameraNode: SKCameraNode!
    private var targetCameraX: CGFloat = 0
    private let cameraSmooth: CGFloat  = 0.08

    // Fall-off Y threshold
    private var fallOffY: CGFloat = -400

    // MARK: - Setup
    override func didMove(to view: SKView) {
        backgroundColor = SKColor(red: 0.45, green: 0.72, blue: 0.95, alpha: 1)
        physicsWorld.gravity       = .zero          // manual gravity in PlayerNode
        physicsWorld.contactDelegate = self

        setupBackground()
        setupCamera()
        setupWorld()
        setupHUD()
        setupControls()
        loadLevel(currentLevel)
    }

    private func setupBackground() {
        // Gradient sky: two overlapping rectangles
        let skyTop = SKSpriteNode(color: SKColor(red: 0.30, green: 0.55, blue: 0.90, alpha: 1),
                                  size: CGSize(width: size.width * 4, height: size.height))
        skyTop.position  = CGPoint(x: 0, y: size.height * 0.25)
        skyTop.zPosition = -100
        addChild(skyTop)

        // Distant cloud shapes
        for i in 0..<12 {
            let cloud = makeCloud()
            cloud.position = CGPoint(x: CGFloat.random(in: -600...600) + CGFloat(i) * 120,
                                     y: CGFloat.random(in: 80...200))
            cloud.zPosition = -50
            cloud.alpha     = CGFloat.random(in: 0.55...0.80)
            addChild(cloud)
        }
    }

    private func makeCloud() -> SKNode {
        let n = SKNode()
        let sizes: [CGFloat] = [30, 45, 38, 25]
        let offsets: [CGFloat] = [-30, 0, 28, -15]
        for (s, ox) in zip(sizes, offsets) {
            let c = SKShapeNode(circleOfRadius: s)
            c.fillColor   = SKColor(white: 1, alpha: 1)
            c.strokeColor = .clear
            c.position    = CGPoint(x: ox, y: 0)
            n.addChild(c)
        }
        return n
    }

    private func setupCamera() {
        cameraNode = SKCameraNode()
        camera     = cameraNode
        addChild(cameraNode)
    }

    private func setupWorld() {
        worldNode = SKNode()
        worldNode.zPosition = 0
        addChild(worldNode)
    }

    private func setupHUD() {
        hudLayer = SKNode()
        hudLayer.zPosition = 200
        cameraNode.addChild(hudLayer)

        hudNode = HUDNode()
        hudNode.position = CGPoint(x: 0, y: size.height / 2 - 50)
        hudLayer.addChild(hudNode)
    }

    private func setupControls() {
        controlsNode = ControlsNode()
        controlsNode.zPosition = 300
        controlsNode.layout(in: size)
        cameraNode.addChild(controlsNode)
    }

    // MARK: - Level loading
    private func loadLevel(_ level: Int) {
        // Clear previous
        worldNode.removeAllChildren()
        platforms.removeAll()
        collectibles.removeAll()

        let data = level == 1 ? LevelGenerator.level1() : LevelGenerator.level2()

        // Build platforms
        for pd in data.platforms {
            let block = PlatformBlock(col: pd.col, row: pd.row,
                                      heightLevel: pd.height, type: pd.type)
            worldNode.addChild(block)
            platforms.append(block)

            // Collectible on top of platform
            if let ct = pd.collectible {
                let coll = CollectibleNode(type: ct)
                // Position collectible above platform top face
                let pos = IsometricUtils.isoToScreen(col: CGFloat(pd.col),
                                                      row: CGFloat(pd.row),
                                                      height: CGFloat(pd.height))
                coll.position  = CGPoint(x: pos.x, y: pos.y + 20)
                coll.zPosition = block.zPosition + 5
                worldNode.addChild(coll)
                collectibles.append(coll)
            }
        }

        // Sort platforms by z for correct draw order
        // (already set per block, SpriteKit handles this)

        // Spawn player
        let spawnPos = IsometricUtils.isoToScreen(col: CGFloat(data.spawnCol),
                                                   row: CGFloat(data.spawnRow),
                                                   height: CGFloat(data.spawnHeight))
        if player == nil {
            player = PlayerNode()
            worldNode.addChild(player)
        }
        player.respawn(at: CGPoint(x: spawnPos.x, y: spawnPos.y + 30))

        targetCameraX = player.position.x
        cameraNode.position = CGPoint(x: targetCameraX, y: 0)

        gameState = .playing
        updateHUD()
    }

    // MARK: - Update
    override func update(_ currentTime: TimeInterval) {
        let dt = min(currentTime - lastUpdateTime, 1.0 / 30.0)
        lastUpdateTime = currentTime

        guard gameState == .playing else {
            if gameState == .gameOver {
                deathTimer += dt
                if deathTimer >= deathDelay { showGameOverScreen() }
            }
            return
        }

        let jumpFired = controlsNode.consumeJump()

        // Jump request
        if jumpFired { player.jump() }

        // Update player
        player.update(deltaTime: dt,
                      movingLeft:  controlsNode.movingLeft,
                      movingRight: controlsNode.movingRight)

        // Platform collision
        handlePlatformCollisions()

        // Collectible collection
        handleCollectibleCollection()

        // Fall detection
        if player.position.y < fallOffY {
            playerDied()
        }

        // Scroll camera
        targetCameraX += (player.position.x - targetCameraX) * cameraSmooth * 60 * CGFloat(dt)
        cameraNode.position = CGPoint(x: targetCameraX, y: 20)

        // Update parallax clouds (very subtle)
        updateHUD()
    }

    // MARK: - Manual platform collision
    private func handlePlatformCollisions() {
        let playerBottom = player.position.y - 22   // half player height
        let playerTop    = player.position.y + 22
        let playerLeft   = player.position.x - 9
        let playerRight  = player.position.x + 9

        var landed    = false
        var bestY: CGFloat = -CGFloat.infinity

        for block in platforms {
            let topY    = block.position.y               // block screen top-centre y
            let leftX   = block.position.x - IsoTile.width  / 2 * 0.90
            let rightX  = block.position.x + IsoTile.width  / 2 * 0.90

            // Horizontal overlap
            guard playerRight > leftX && playerLeft < rightX else { continue }

            // Landing: player falling onto top face
            if player.velocityY <= 0 &&
               playerBottom <= topY + 4 &&
               playerBottom >= topY - 16 {
                if topY > bestY {
                    bestY   = topY
                    landed  = true
                }
            }
        }

        if landed {
            player.land(onY: bestY + 22)
        } else if player.isOnGround {
            // Check if still over any platform
            var stillGrounded = false
            for block in platforms {
                let topY  = block.position.y
                let lx    = block.position.x - IsoTile.width / 2 * 0.90
                let rx    = block.position.x + IsoTile.width / 2 * 0.90
                if playerRight > lx && playerLeft < rx &&
                   abs((player.position.y - 22) - topY) < 8 {
                    stillGrounded = true
                    break
                }
            }
            if !stillGrounded { player.isOnGround = false }
        }
    }

    // MARK: - Collectible collection
    private func handleCollectibleCollection() {
        let pr = CGFloat(20)
        for coll in collectibles where !coll.isCollected {
            let dx = coll.position.x - player.position.x
            let dy = coll.position.y - player.position.y
            if dx*dx + dy*dy < pr*pr*2.5 {
                coll.collect()
                player.score += coll.type.points
                let screenPos = coll.position        // world pos (close enough)
                hudNode.animateScoreGain(coll.type.points, at: convert(screenPos, from: worldNode))
            }
        }
    }

    // MARK: - Death / respawn
    private func playerDied() {
        player.die()
        gameState  = .gameOver
        deathTimer = 0
    }

    private func showGameOverScreen() {
        if player.lives > 0 {
            // Respawn
            player.lives -= 0       // already decremented in die()
            loadLevel(currentLevel)
        } else {
            showFinalGameOver()
        }
    }

    private func showFinalGameOver() {
        let overlay = SKShapeNode(rectOf: size)
        overlay.fillColor   = SKColor(white: 0, alpha: 0.65)
        overlay.strokeColor = .clear
        overlay.zPosition   = 500
        cameraNode.addChild(overlay)

        let title = SKLabelNode(fontNamed: "AvenirNext-Heavy")
        title.text      = "GAME OVER"
        title.fontSize  = 48
        title.fontColor = SKColor(red: 1, green: 0.3, blue: 0.3, alpha: 1)
        title.position  = CGPoint(x: 0, y: 40)
        title.zPosition = 501
        cameraNode.addChild(title)

        let scoreLbl = SKLabelNode(fontNamed: "AvenirNext-Bold")
        scoreLbl.text      = "Score: \(player.score)"
        scoreLbl.fontSize  = 28
        scoreLbl.fontColor = .white
        scoreLbl.position  = CGPoint(x: 0, y: -10)
        scoreLbl.zPosition = 501
        cameraNode.addChild(scoreLbl)

        let tap = SKLabelNode(fontNamed: "AvenirNext-Medium")
        tap.text      = "Tap to restart"
        tap.fontSize  = 22
        tap.fontColor = SKColor(white: 0.9, alpha: 0.75)
        tap.position  = CGPoint(x: 0, y: -60)
        tap.zPosition = 501
        tap.run(SKAction.repeatForever(SKAction.sequence([
            SKAction.fadeAlpha(to: 0.3, duration: 0.7),
            SKAction.fadeAlpha(to: 1.0, duration: 0.7)
        ])))
        cameraNode.addChild(tap)

        gameState = .paused
    }

    // MARK: - Touch input for game-over restart
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        super.touchesBegan(touches, with: event)
        if gameState == .paused {
            // Restart
            cameraNode.removeAllChildren()
            setupHUD()
            setupControls()
            player.lives = 3
            player.score = 0
            currentLevel = 1
            loadLevel(currentLevel)
        }
    }

    // MARK: - HUD
    private func updateHUD() {
        hudNode.update(score: player.score, lives: player.lives, level: currentLevel)
    }

    // MARK: - Physics contact (fallback — we use manual collision above)
    func didBegin(_ contact: SKPhysicsContact) { }
}
