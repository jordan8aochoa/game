import SpriteKit

// MARK: - On-screen touch controls
class ControlsNode: SKNode {

    // State exposed to GameScene
    var movingLeft  = false
    var movingRight = false
    var jumpPressed = false         // single-frame flag

    private var leftButton:  ControlButton!
    private var rightButton: ControlButton!
    private var jumpButton:  ControlButton!

    // Track which touch owns which button
    private var leftTouch:  UITouch?
    private var rightTouch: UITouch?
    private var jumpTouch:  UITouch?

    override init() {
        super.init()
        isUserInteractionEnabled = true
        buildControls()
    }

    required init?(coder: NSCoder) { fatalError() }

    private func buildControls() {
        // Left d-pad button
        leftButton  = ControlButton(label: "◀", size: CGSize(width: 70, height: 70))
        leftButton.position = CGPoint(x: -44, y: 0)
        addChild(leftButton)

        // Right d-pad button
        rightButton = ControlButton(label: "▶", size: CGSize(width: 70, height: 70))
        rightButton.position = CGPoint(x: 44, y: 0)
        addChild(rightButton)

        // Jump button (right side of screen)
        jumpButton  = ControlButton(label: "▲", size: CGSize(width: 80, height: 80))
        jumpButton.name = "jumpBtn"
        addChild(jumpButton)
    }

    func layout(in size: CGSize) {
        // Left cluster: bottom-left
        let leftClusterX = -size.width / 2 + 100
        let bottomY      = -size.height / 2 + 70
        leftButton.position  = CGPoint(x: leftClusterX - 44, y: bottomY)
        rightButton.position = CGPoint(x: leftClusterX + 44, y: bottomY)

        // Jump: bottom-right
        jumpButton.position  = CGPoint(x: size.width / 2 - 80, y: bottomY)
    }

    // MARK: - Touch handling
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        for t in touches {
            let pos = t.location(in: self)
            if leftButton.contains(pos) {
                leftTouch  = t
                movingLeft = true
                leftButton.highlight(true)
            } else if rightButton.contains(pos) {
                rightTouch  = t
                movingRight = true
                rightButton.highlight(true)
            } else if jumpButton.contains(pos) {
                jumpTouch   = t
                jumpPressed = true
                jumpButton.highlight(true)
            }
        }
    }

    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        for t in touches {
            if t == leftTouch  { leftTouch  = nil; movingLeft  = false; leftButton.highlight(false) }
            if t == rightTouch { rightTouch = nil; movingRight = false; rightButton.highlight(false) }
            if t == jumpTouch  { jumpTouch  = nil; jumpButton.highlight(false) }
        }
    }

    override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent?) {
        touchesEnded(touches, with: event)
    }

    // Call once per frame — clears single-frame flags
    func consumeJump() -> Bool {
        let v = jumpPressed
        jumpPressed = false
        return v
    }
}

// MARK: - ControlButton
class ControlButton: SKNode {

    private let background: SKShapeNode
    private let label: SKLabelNode

    init(label text: String, size: CGSize) {
        background = SKShapeNode(rectOf: size, cornerRadius: size.width * 0.3)
        background.fillColor   = SKColor(white: 1, alpha: 0.18)
        background.strokeColor = SKColor(white: 1, alpha: 0.50)
        background.lineWidth   = 2

        label = SKLabelNode(text: text)
        label.fontName              = "AvenirNext-Bold"
        label.fontSize              = size.width * 0.42
        label.fontColor             = .white
        label.verticalAlignmentMode = .center

        super.init()
        addChild(background)
        addChild(label)
        isUserInteractionEnabled = false   // parent ControlsNode handles touches
    }

    required init?(coder: NSCoder) { fatalError() }

    func highlight(_ on: Bool) {
        background.fillColor = on
            ? SKColor(white: 1, alpha: 0.40)
            : SKColor(white: 1, alpha: 0.18)
        let scale: CGFloat = on ? 0.92 : 1.0
        run(SKAction.scale(to: scale, duration: 0.06))
    }

    override func contains(_ p: CGPoint) -> Bool {
        background.contains(p)
    }
}
