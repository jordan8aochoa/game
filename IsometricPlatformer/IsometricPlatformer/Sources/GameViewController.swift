import UIKit
import SpriteKit

class GameViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        guard let skView = view as? SKView else { return }

        // Performance settings
        skView.ignoresSiblingOrder = true
        skView.showsFPS            = false
        skView.showsNodeCount      = false

        let scene = GameScene(size: skView.bounds.size)
        scene.scaleMode = .resizeFill
        skView.presentScene(scene)
    }

    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return UIDevice.current.userInterfaceIdiom == .pad ? .all : .landscape
    }

    override var prefersStatusBarHidden: Bool { return true }

    override var prefersHomeIndicatorAutoHidden: Bool { return true }
}
