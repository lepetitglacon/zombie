import GameEngine from "@/game/GameEngine";
import * as BABYLON from "@babylonjs/core";

export default class CameraManager {
    private cameras: Map<String, BABYLON.FlyCamera|BABYLON.UniversalCamera>;
    public camera: BABYLON.FlyCamera|BABYLON.UniversalCamera;

    constructor() {
        this.cameras = new Map()
        this.cameras.set(
            'fly',
            new BABYLON.FlyCamera(
                "fly-camera",
                new BABYLON.Vector3(0, 5, -10),
                GameEngine.world.scene
            )
        )
        this.cameras.set(
            'universal',
            new BABYLON.UniversalCamera(
                "universal-camera",
                new BABYLON.Vector3(0, 5, -10),
                GameEngine.world.scene
            )
        )

        this.setCamera('fly')
        this.setCamera('universal')

        GameEngine.canvas.addEventListener('click', () => {
            GameEngine.canvas.requestPointerLock({unadjustedMovement: true})
        })
    }

    setCamera(cameraName: String) {
        if (this.cameras.has(cameraName)) {
            this.camera = this.cameras.get(cameraName)
            this.camera.attachControl(GameEngine.canvas, true);

            // this.camera.checkCollisions = true;
            // this.camera.applyGravity = true;

            this.camera.keysForward = [90]
            this.camera.keysBackward = [83]
            this.camera.keysUp = [32]
            this.camera.keysDown = [16]
            this.camera.keysLeft = [81]
            this.camera.keysRight = [68]

            this.camera.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);

            // this.camera.inertia = .5
            // this.camera.rollCorrect = 2
        }
    }
}