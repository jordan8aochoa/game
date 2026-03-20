import SpriteKit

// MARK: - Level data
struct LevelPlatform {
    let col: Int
    let row: Int
    let height: Int
    let type: BlockType
    var collectible: CollectibleType?
}

struct LevelData {
    let platforms: [LevelPlatform]
    let spawnCol: Int
    let spawnRow: Int
    let spawnHeight: Int
}

// MARK: - LevelGenerator
class LevelGenerator {

    static func level1() -> LevelData {
        var platforms: [LevelPlatform] = []

        // Starting ground cluster (col 0-4, row 0, height 0)
        for c in 0...4 {
            platforms.append(LevelPlatform(col: c, row: 0, height: 0, type: .grass, collectible: nil))
        }
        // Coin on start
        platforms.append(LevelPlatform(col: 2, row: 0, height: 0, type: .grass,
                                       collectible: .coin))

        // First gap, elevated platform
        for c in 6...8 {
            platforms.append(LevelPlatform(col: c, row: 0, height: 1, type: .grass,
                                           collectible: c == 7 ? .coin : nil))
        }

        // Diagonal step-up row shift
        platforms.append(LevelPlatform(col: 9, row: -1, height: 1, type: .stone, collectible: nil))
        platforms.append(LevelPlatform(col: 10, row: -2, height: 2, type: .stone,
                                       collectible: .gem))
        platforms.append(LevelPlatform(col: 11, row: -3, height: 2, type: .stone, collectible: nil))

        // Wide flat stretch
        for c in 12...16 {
            platforms.append(LevelPlatform(col: c, row: -3, height: 2, type: .grass,
                                           collectible: c % 2 == 0 ? .coin : nil))
        }

        // Ice section with star
        for c in 17...20 {
            platforms.append(LevelPlatform(col: c, row: -3, height: 3, type: .ice,
                                           collectible: c == 18 ? .star : nil))
        }

        // Narrow single-tile jumps
        for c in [22, 24, 26, 28] {
            platforms.append(LevelPlatform(col: c, row: -3, height: 3, type: .dirt,
                                           collectible: c == 26 ? .gem : nil))
        }

        // Dirt descent
        for c in 29...33 {
            let h = 3 - (c - 29)
            platforms.append(LevelPlatform(col: c, row: -3, height: max(h, 0), type: .dirt,
                                           collectible: nil))
        }

        // Final grass landing with multiple collectibles
        for c in 34...38 {
            platforms.append(LevelPlatform(col: c, row: -3, height: 0, type: .grass,
                                           collectible: c % 2 == 0 ? .coin : nil))
        }
        platforms.append(LevelPlatform(col: 36, row: -3, height: 0, type: .grass,
                                       collectible: .star))

        return LevelData(platforms: platforms, spawnCol: 1, spawnRow: 0, spawnHeight: 0)
    }

    static func level2() -> LevelData {
        var platforms: [LevelPlatform] = []

        // Lava-themed level with narrower platforms
        for c in 0...2 {
            platforms.append(LevelPlatform(col: c, row: 0, height: 0, type: .stone, collectible: c == 1 ? .coin : nil))
        }

        // Alternating heights
        let pattern: [(Int, Int, BlockType)] = [
            (4, 0, .lava), (5, 0, .stone), (6, 0, .stone),
            (8, 1, .stone), (9, 1, .stone),
            (11, 2, .lava), (12, 2, .stone),
            (14, 3, .stone), (15, 3, .stone), (16, 3, .stone),
            (18, 2, .dirt), (19, 2, .dirt),
            (21, 1, .stone), (22, 1, .stone),
            (24, 0, .grass), (25, 0, .grass), (26, 0, .grass),
            (28, 2, .ice),   (29, 2, .ice),
            (31, 4, .ice),   (32, 4, .ice),
            (34, 3, .stone), (35, 3, .stone),
            (37, 0, .grass), (38, 0, .grass), (39, 0, .grass),
        ]

        for (c, h, t) in pattern {
            platforms.append(LevelPlatform(col: c, row: 0, height: h, type: t, collectible: nil))
        }

        // Scatter collectibles
        let collectibleCols: [Int: CollectibleType] = [
            5: .coin, 9: .gem, 15: .coin, 22: .coin,
            25: .star, 29: .gem, 32: .coin, 38: .star
        ]
        for i in platforms.indices {
            if let ct = collectibleCols[platforms[i].col] {
                platforms[i] = LevelPlatform(col: platforms[i].col, row: platforms[i].row,
                                              height: platforms[i].height, type: platforms[i].type,
                                              collectible: ct)
            }
        }

        return LevelData(platforms: platforms, spawnCol: 1, spawnRow: 0, spawnHeight: 0)
    }
}
