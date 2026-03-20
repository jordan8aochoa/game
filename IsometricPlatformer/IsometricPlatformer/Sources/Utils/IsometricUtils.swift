import SpriteKit

// MARK: - Isometric coordinate system
// World coords: (col, row, height) → Screen coords: (x, y)
// Tile size: tileWidth x tileHeight (2:1 ratio typical for isometric)

struct IsoTile {
    static let width: CGFloat  = 96
    static let height: CGFloat = 48   // width / 2
    static let depth: CGFloat  = 24   // visual block thickness (side face)
}

struct IsometricUtils {

    // Convert isometric grid position to screen position (top-centre of tile face)
    static func isoToScreen(col: CGFloat, row: CGFloat, height: CGFloat = 0) -> CGPoint {
        let x = (col - row) * (IsoTile.width / 2)
        let y = (col + row) * (IsoTile.height / 2) + height * IsoTile.depth
        return CGPoint(x: x, y: y)
    }

    // Convert screen position back to approximate isometric grid
    static func screenToIso(point: CGPoint) -> (col: CGFloat, row: CGFloat) {
        let col = (point.x / (IsoTile.width / 2) + point.y / (IsoTile.height / 2)) / 2
        let row = (point.y / (IsoTile.height / 2) - point.x / (IsoTile.width / 2)) / 2
        return (col, row)
    }

    // Z-ordering: tiles further away (higher row+col) should be drawn first
    static func zPosition(col: CGFloat, row: CGFloat, height: CGFloat = 0) -> CGFloat {
        return -(col + row) * 10 + height * 0.1
    }
}

// MARK: - Platform block drawing helper
extension SKNode {

    /// Draw a single isometric block using three colored polygons (top, left, right face).
    static func makeIsoBlock(topColor: SKColor, leftColor: SKColor, rightColor: SKColor,
                              width: CGFloat = IsoTile.width,
                              height: CGFloat = IsoTile.height,
                              depth: CGFloat = IsoTile.depth) -> SKNode {
        let node = SKNode()

        // Top face (diamond)
        let top = SKShapeNode(points: &[
            CGPoint(x: 0,          y: height / 2),   // top
            CGPoint(x: width / 2,  y: 0),            // right
            CGPoint(x: 0,          y: -height / 2),  // bottom
            CGPoint(x: -width / 2, y: 0),            // left
            CGPoint(x: 0,          y: height / 2),
        ], count: 5)
        top.fillColor   = topColor
        top.strokeColor = topColor.darker(by: 0.15)
        top.lineWidth   = 1
        top.zPosition   = 2
        node.addChild(top)

        // Left face
        let left = SKShapeNode(points: &[
            CGPoint(x: -width / 2, y: 0),
            CGPoint(x: 0,          y: -height / 2),
            CGPoint(x: 0,          y: -height / 2 - depth),
            CGPoint(x: -width / 2, y: -depth),
            CGPoint(x: -width / 2, y: 0),
        ], count: 5)
        left.fillColor   = leftColor
        left.strokeColor = leftColor.darker(by: 0.15)
        left.lineWidth   = 1
        left.zPosition   = 1
        node.addChild(left)

        // Right face
        let right = SKShapeNode(points: &[
            CGPoint(x: 0,         y: -height / 2),
            CGPoint(x: width / 2, y: 0),
            CGPoint(x: width / 2, y: -depth),
            CGPoint(x: 0,         y: -height / 2 - depth),
            CGPoint(x: 0,         y: -height / 2),
        ], count: 5)
        right.fillColor   = rightColor
        right.strokeColor = rightColor.darker(by: 0.15)
        right.lineWidth   = 1
        right.zPosition   = 1
        node.addChild(right)

        return node
    }
}

// MARK: - Color helpers
extension SKColor {
    func darker(by factor: CGFloat) -> SKColor {
        var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        getRed(&r, green: &g, blue: &b, alpha: &a)
        return SKColor(red: max(r - factor, 0),
                       green: max(g - factor, 0),
                       blue: max(b - factor, 0),
                       alpha: a)
    }

    func lighter(by factor: CGFloat) -> SKColor {
        var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        getRed(&r, green: &g, blue: &b, alpha: &a)
        return SKColor(red: min(r + factor, 1),
                       green: min(g + factor, 1),
                       blue: min(b + factor, 1),
                       alpha: a)
    }
}
