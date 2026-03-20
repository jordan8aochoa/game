import SpriteKit

class HUDNode: SKNode {

    private var scoreLabel: SKLabelNode!
    private var livesContainer: SKNode!
    private var levelLabel: SKLabelNode!
    private let heartSpacing: CGFloat = 32

    override init() {
        super.init()
        buildHUD()
    }

    required init?(coder: NSCoder) { fatalError() }

    private func buildHUD() {
        // Background panel
        let panel = SKShapeNode(rectOf: CGSize(width: 360, height: 48), cornerRadius: 10)
        panel.fillColor   = SKColor(white: 0, alpha: 0.45)
        panel.strokeColor = SKColor(white: 1, alpha: 0.15)
        panel.lineWidth   = 1
        panel.position    = CGPoint(x: 0, y: 0)
        addChild(panel)

        // Score label
        scoreLabel = SKLabelNode(fontNamed: "AvenirNext-Bold")
        scoreLabel.fontSize    = 20
        scoreLabel.fontColor   = SKColor(red: 1.0, green: 0.92, blue: 0.3, alpha: 1)
        scoreLabel.position    = CGPoint(x: -80, y: -7)
        scoreLabel.horizontalAlignmentMode = .left
        addChild(scoreLabel)

        // Level label
        levelLabel = SKLabelNode(fontNamed: "AvenirNext-Medium")
        levelLabel.fontSize  = 16
        levelLabel.fontColor = SKColor(white: 0.9, alpha: 0.85)
        levelLabel.position  = CGPoint(x: 80, y: -7)
        levelLabel.horizontalAlignmentMode = .right
        addChild(levelLabel)

        // Lives container
        livesContainer = SKNode()
        livesContainer.position = CGPoint(x: 100, y: 0)
        addChild(livesContainer)
    }

    func update(score: Int, lives: Int, level: Int) {
        scoreLabel.text = "⬡ \(score)"
        levelLabel.text = "Lv \(level)"
        updateHearts(lives: lives)
    }

    private func updateHearts(_ lives: Int) {
        livesContainer.removeAllChildren()
        for i in 0..<3 {
            let heart = makeHeart(filled: i < lives)
            heart.position = CGPoint(x: CGFloat(i) * heartSpacing, y: 0)
            livesContainer.addChild(heart)
        }
    }

    private func makeHeart(filled: Bool) -> SKNode {
        let n = SKNode()
        let shape = SKShapeNode(path: heartPath())
        shape.fillColor   = filled ? SKColor(red: 0.95, green: 0.25, blue: 0.35, alpha: 1) : SKColor(white: 0.4, alpha: 0.5)
        shape.strokeColor = filled ? shape.fillColor.darker(by: 0.2) : .clear
        shape.lineWidth   = 1
        shape.setScale(0.9)
        n.addChild(shape)
        return n
    }

    private func heartPath() -> CGPath {
        let path = CGMutablePath()
        path.move(to: CGPoint(x: 0, y: -8))
        path.addCurve(to: CGPoint(x: 0, y: 8),
                      control1: CGPoint(x: -14, y: -4),
                      control2: CGPoint(x: -14, y: 10))
        path.addCurve(to: CGPoint(x: 0, y: -8),
                      control1: CGPoint(x: 14, y: 10),
                      control2: CGPoint(x: 14, y: -4))
        path.closeSubpath()
        return path
    }

    // MARK: - Score pop animation
    func animateScoreGain(_ amount: Int, at screenPos: CGPoint) {
        let lbl = SKLabelNode(fontNamed: "AvenirNext-Bold")
        lbl.text      = "+\(amount)"
        lbl.fontSize  = 22
        lbl.fontColor = SKColor(red: 1, green: 0.95, blue: 0.1, alpha: 1)
        lbl.position  = screenPos
        lbl.zPosition = 100
        parent?.addChild(lbl)

        let move  = SKAction.moveBy(x: 0, y: 50, duration: 0.7)
        let fade  = SKAction.sequence([
            SKAction.wait(forDuration: 0.3),
            SKAction.fadeOut(withDuration: 0.4)
        ])
        let done  = SKAction.removeFromParent()
        lbl.run(SKAction.sequence([SKAction.group([move, fade]), done]))
    }
}
