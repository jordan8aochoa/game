import SpriteKit

enum CollectibleType {
    case coin, gem, star

    var color: SKColor {
        switch self {
        case .coin: return SKColor(red: 1.0, green: 0.85, blue: 0.1, alpha: 1)
        case .gem:  return SKColor(red: 0.3, green: 0.9,  blue: 1.0, alpha: 1)
        case .star: return SKColor(red: 1.0, green: 0.5,  blue: 0.9, alpha: 1)
        }
    }

    var points: Int {
        switch self {
        case .coin: return 10
        case .gem:  return 50
        case .star: return 100
        }
    }
}

class CollectibleNode: SKNode {

    let type: CollectibleType
    var isCollected = false

    init(type: CollectibleType = .coin) {
        self.type = type
        super.init()
        buildVisual()
        setupPhysics()
        startBob()
    }

    required init?(coder: NSCoder) { fatalError() }

    private func buildVisual() {
        let shape: SKShapeNode
        switch type {
        case .coin:
            shape = SKShapeNode(circleOfRadius: 9)
            shape.fillColor   = type.color
            shape.strokeColor = type.color.darker(by: 0.25)
            shape.lineWidth   = 2
            // Inner ring
            let inner = SKShapeNode(circleOfRadius: 5)
            inner.fillColor   = .clear
            inner.strokeColor = type.color.darker(by: 0.15)
            inner.lineWidth   = 1.5
            shape.addChild(inner)

        case .gem:
            var pts: [CGPoint] = [
                CGPoint(x: 0,    y: 12),
                CGPoint(x: 8,    y: 4),
                CGPoint(x: 6,    y: -8),
                CGPoint(x: -6,   y: -8),
                CGPoint(x: -8,   y: 4),
                CGPoint(x: 0,    y: 12),
            ]
            shape = SKShapeNode(points: &pts, count: 6)
            shape.fillColor   = type.color
            shape.strokeColor = type.color.darker(by: 0.3)
            shape.lineWidth   = 1.5

        case .star:
            shape = SKShapeNode(path: starPath(points: 5, radius: 10, innerRadius: 5))
            shape.fillColor   = type.color
            shape.strokeColor = type.color.darker(by: 0.2)
            shape.lineWidth   = 1.5
        }

        shape.zPosition = 1
        addChild(shape)

        // Glow
        let glow = SKShapeNode(circleOfRadius: 14)
        glow.fillColor   = type.color.withAlphaComponent(0.18)
        glow.strokeColor = .clear
        glow.zPosition   = 0
        addChild(glow)
    }

    private func setupPhysics() {
        physicsBody = SKPhysicsBody(circleOfRadius: 12)
        physicsBody?.isDynamic            = false
        physicsBody?.categoryBitMask      = PhysicsCategory.collectible
        physicsBody?.collisionBitMask     = PhysicsCategory.none
        physicsBody?.contactTestBitMask   = PhysicsCategory.player
    }

    private func startBob() {
        let bob = SKAction.sequence([
            SKAction.moveBy(x: 0, y: 5, duration: 0.6),
            SKAction.moveBy(x: 0, y: -5, duration: 0.6)
        ])
        run(SKAction.repeatForever(bob))

        let spin = SKAction.rotate(byAngle: .pi * 2, duration: 2.5)
        run(SKAction.repeatForever(spin))
    }

    func collect() {
        guard !isCollected else { return }
        isCollected = true
        physicsBody  = nil
        let pop = SKAction.sequence([
            SKAction.group([
                SKAction.scale(to: 1.5, duration: 0.12),
                SKAction.fadeOut(withDuration: 0.20)
            ]),
            SKAction.removeFromParent()
        ])
        removeAllActions()
        run(pop)
    }

    // MARK: - Star path helper
    private func starPath(points: Int, radius: CGFloat, innerRadius: CGFloat) -> CGPath {
        let path = CGMutablePath()
        let step = CGFloat.pi * 2 / CGFloat(points)
        for i in 0..<points {
            let outerAngle = CGFloat(i) * step - .pi / 2
            let innerAngle = outerAngle + step / 2
            let op = CGPoint(x: cos(outerAngle) * radius,       y: sin(outerAngle) * radius)
            let ip = CGPoint(x: cos(innerAngle) * innerRadius,  y: sin(innerAngle) * innerRadius)
            i == 0 ? path.move(to: op) : path.addLine(to: op)
            path.addLine(to: ip)
        }
        path.closeSubpath()
        return path
    }
}
