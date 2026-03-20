import SpriteKit

// MARK: - Player state
enum PlayerState {
    case idle, runningLeft, runningRight, jumping, falling, dead
}

// MARK: - PlayerNode
class PlayerNode: SKNode {

    // Physics
    var velocityX: CGFloat = 0
    var velocityY: CGFloat = 0
    var isOnGround: Bool   = false
    var isDead: Bool       = false

    // Movement constants
    static let moveSpeed:   CGFloat = 160
    static let jumpImpulse: CGFloat = 380
    static let gravity:     CGFloat = -900
    static let maxFallSpeed: CGFloat = -600

    // State
    private(set) var state: PlayerState = .idle
    var facingRight: Bool = true

    // Visual
    private var bodyNode:  SKShapeNode!
    private var headNode:  SKShapeNode!
    private var eyeLeft:   SKShapeNode!
    private var eyeRight:  SKShapeNode!
    private var legLeft:   SKShapeNode!
    private var legRight:  SKShapeNode!
    private var shadowNode: SKShapeNode!

    // Animation
    private var animTimer: TimeInterval = 0
    private var legPhase:  CGFloat      = 0

    // Lives & score
    var lives: Int  = 3
    var score: Int  = 0

    override init() {
        super.init()
        buildVisual()
        setupPhysics()
    }

    required init?(coder: NSCoder) { fatalError() }

    // MARK: - Visual construction (simple geometric character)
    private func buildVisual() {

        // Shadow (ellipse on ground)
        shadowNode = SKShapeNode(ellipseOf: CGSize(width: 28, height: 10))
        shadowNode.fillColor   = SKColor(white: 0, alpha: 0.25)
        shadowNode.strokeColor = .clear
        shadowNode.position    = CGPoint(x: 0, y: -18)
        shadowNode.zPosition   = -1
        addChild(shadowNode)

        // Body
        bodyNode = SKShapeNode(rectOf: CGSize(width: 20, height: 22), cornerRadius: 4)
        bodyNode.fillColor   = SKColor(red: 0.25, green: 0.55, blue: 1.0, alpha: 1)
        bodyNode.strokeColor = bodyNode.fillColor.darker(by: 0.2)
        bodyNode.lineWidth   = 1.5
        bodyNode.position    = CGPoint(x: 0, y: 0)
        addChild(bodyNode)

        // Head
        headNode = SKShapeNode(circleOfRadius: 11)
        headNode.fillColor   = SKColor(red: 1.0, green: 0.82, blue: 0.65, alpha: 1)
        headNode.strokeColor = headNode.fillColor.darker(by: 0.2)
        headNode.lineWidth   = 1.5
        headNode.position    = CGPoint(x: 0, y: 18)
        addChild(headNode)

        // Eyes
        eyeLeft  = makeEye(x: -4)
        eyeRight = makeEye(x:  4)
        headNode.addChild(eyeLeft)
        headNode.addChild(eyeRight)

        // Legs
        legLeft  = makeLeg(x: -5)
        legRight = makeLeg(x:  5)
        addChild(legLeft)
        addChild(legRight)
    }

    private func makeEye(x: CGFloat) -> SKShapeNode {
        let eye = SKShapeNode(circleOfRadius: 2.5)
        eye.fillColor   = SKColor(red: 0.1, green: 0.1, blue: 0.15, alpha: 1)
        eye.strokeColor = .clear
        eye.position    = CGPoint(x: x, y: 2)
        return eye
    }

    private func makeLeg(x: CGFloat) -> SKShapeNode {
        let leg = SKShapeNode(rectOf: CGSize(width: 7, height: 12), cornerRadius: 2)
        leg.fillColor   = SKColor(red: 0.15, green: 0.35, blue: 0.80, alpha: 1)
        leg.strokeColor = .clear
        leg.position    = CGPoint(x: x, y: -16)
        return leg
    }

    private func setupPhysics() {
        physicsBody = SKPhysicsBody(rectangleOf: CGSize(width: 18, height: 44))
        physicsBody?.mass = 1
        physicsBody?.allowsRotation  = false
        physicsBody?.friction        = 0.3
        physicsBody?.restitution     = 0
        physicsBody?.linearDamping   = 0.1
        physicsBody?.categoryBitMask    = PhysicsCategory.player
        physicsBody?.collisionBitMask   = PhysicsCategory.platform | PhysicsCategory.boundary
        physicsBody?.contactTestBitMask = PhysicsCategory.platform | PhysicsCategory.collectible
        // We'll handle gravity manually for better game feel
        physicsBody?.affectedByGravity = false
    }

    // MARK: - Update loop
    func update(deltaTime dt: TimeInterval, movingLeft: Bool, movingRight: Bool) {
        guard !isDead else { return }

        animTimer += dt

        // Horizontal movement
        if movingLeft {
            velocityX  = -PlayerNode.moveSpeed
            facingRight = false
            if isOnGround { setState(.runningLeft) }
        } else if movingRight {
            velocityX  = PlayerNode.moveSpeed
            facingRight = true
            if isOnGround { setState(.runningRight) }
        } else {
            velocityX *= 0.80          // friction deceleration
            if abs(velocityX) < 2 { velocityX = 0 }
            if isOnGround && state != .idle { setState(.idle) }
        }

        // Gravity
        velocityY += PlayerNode.gravity * CGFloat(dt)
        velocityY  = max(velocityY, PlayerNode.maxFallSpeed)

        if velocityY < -10 && !isOnGround { setState(.falling) }

        // Apply velocity
        position.x += velocityX * CGFloat(dt)
        position.y += velocityY * CGFloat(dt)

        // Flip character
        xScale = facingRight ? 1 : -1

        // Animate legs
        if isOnGround && abs(velocityX) > 10 {
            legPhase += CGFloat(dt) * 12
            legLeft.position.y  = -16 + sin(legPhase)       * 5
            legRight.position.y = -16 + sin(legPhase + .pi) * 5
        } else {
            legLeft.position.y  = -16
            legRight.position.y = -16
        }

        // Shadow scale by height (fade when jumping)
        let shadowAlpha = isOnGround ? 0.25 : max(0.08, 0.25 - (-velocityY / 1000))
        shadowNode.alpha = shadowAlpha
    }

    // MARK: - Jump
    func jump() {
        guard isOnGround && !isDead else { return }
        velocityY  = PlayerNode.jumpImpulse
        isOnGround = false
        setState(.jumping)
    }

    // MARK: - Landing
    func land(onY y: CGFloat) {
        if velocityY <= 0 {
            position.y = y
            velocityY  = 0
            isOnGround = true
        }
    }

    // MARK: - State management
    private func setState(_ newState: PlayerState) {
        guard newState != state else { return }
        state = newState
        switch state {
        case .jumping:
            run(SKAction.sequence([
                SKAction.scaleY(to: 1.25, duration: 0.06),
                SKAction.scaleY(to: 0.85, duration: 0.10)
            ]))
        case .idle:
            run(SKAction.scaleY(to: 1.0, duration: 0.08))
        default:
            break
        }
    }

    // MARK: - Die
    func die() {
        guard !isDead else { return }
        isDead = true
        lives -= 1
        setState(.dead)
        let spin = SKAction.rotate(byAngle: .pi * 4, duration: 0.6)
        let fade = SKAction.fadeOut(withDuration: 0.6)
        let fall = SKAction.moveBy(x: 0, y: -80, duration: 0.6)
        run(SKAction.group([spin, fade, fall]))
    }

    func respawn(at point: CGPoint) {
        position   = point
        velocityX  = 0
        velocityY  = 0
        isOnGround = false
        isDead     = false
        alpha      = 1
        zRotation  = 0
        xScale     = 1
        yScale     = 1
        setState(.idle)
    }
}
