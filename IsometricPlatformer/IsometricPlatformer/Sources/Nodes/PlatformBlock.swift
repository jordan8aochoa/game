import SpriteKit

enum BlockType {
    case grass, stone, dirt, ice, lava

    var topColor: SKColor {
        switch self {
        case .grass: return SKColor(red: 0.36, green: 0.73, blue: 0.27, alpha: 1)
        case .stone: return SKColor(red: 0.60, green: 0.60, blue: 0.65, alpha: 1)
        case .dirt:  return SKColor(red: 0.65, green: 0.43, blue: 0.27, alpha: 1)
        case .ice:   return SKColor(red: 0.70, green: 0.90, blue: 1.00, alpha: 1)
        case .lava:  return SKColor(red: 1.00, green: 0.45, blue: 0.10, alpha: 1)
        }
    }
    var leftColor: SKColor  { topColor.darker(by: 0.18) }
    var rightColor: SKColor { topColor.darker(by: 0.30) }
}

// MARK: - PlatformBlock
class PlatformBlock: SKNode {

    let col: Int
    let row: Int
    let heightLevel: Int          // stacking height (0 = ground)
    let blockType: BlockType

    /// Physics body is attached here; positioned at the world-space top-face centre.
    var physicsAnchorNode: SKNode!

    /// Logical top-face screen position (used for landing checks)
    var screenTopCenter: CGPoint {
        IsometricUtils.isoToScreen(col: CGFloat(col), row: CGFloat(row),
                                   height: CGFloat(heightLevel))
    }

    init(col: Int, row: Int, heightLevel: Int = 0, type: BlockType = .grass) {
        self.col = col
        self.row = row
        self.heightLevel = heightLevel
        self.blockType   = type
        super.init()
        setup()
    }

    required init?(coder: NSCoder) { fatalError() }

    private func setup() {
        let visual = SKNode.makeIsoBlock(
            topColor:   blockType.topColor,
            leftColor:  blockType.leftColor,
            rightColor: blockType.rightColor
        )
        addChild(visual)

        // Invisible physics body sitting on top face for landing detection
        physicsAnchorNode = SKNode()
        let bodyWidth  = IsoTile.width * 0.90
        let bodyHeight = IsoTile.height * 0.45
        physicsAnchorNode.physicsBody = SKPhysicsBody(rectangleOf: CGSize(width: bodyWidth, height: bodyHeight))
        physicsAnchorNode.physicsBody?.isDynamic  = false
        physicsAnchorNode.physicsBody?.friction   = 0.5
        physicsAnchorNode.physicsBody?.restitution = 0
        physicsAnchorNode.physicsBody?.categoryBitMask    = PhysicsCategory.platform
        physicsAnchorNode.physicsBody?.collisionBitMask   = PhysicsCategory.player
        physicsAnchorNode.physicsBody?.contactTestBitMask = PhysicsCategory.player
        addChild(physicsAnchorNode)

        position   = screenTopCenter
        zPosition  = IsometricUtils.zPosition(col: CGFloat(col), row: CGFloat(row),
                                              height: CGFloat(heightLevel))
    }
}

// MARK: - Physics categories
struct PhysicsCategory {
    static let none:        UInt32 = 0
    static let player:      UInt32 = 0b0001
    static let platform:    UInt32 = 0b0010
    static let collectible: UInt32 = 0b0100
    static let boundary:    UInt32 = 0b1000
}
