import GameEngine from "@/game/GameEngine";
import * as BABYLON from "@babylonjs/core";

export default class CameraManager {
    private cameras: Map<String, BABYLON.FlyCamera|BABYLON.UniversalCamera>;
    public camera: BABYLON.FlyCamera|BABYLON.UniversalCamera;

    constructor() {
        this.cameras = new Map()

        GameEngine.eventManager.onSceneInit.add(() => {
            this.cameras.set(
                'fly',
                new BABYLON.FlyCamera(
                    "fly-camera",
                    new BABYLON.Vector3(0, 5, -10),
                    GameEngine.world.scene
                )
            )
            const flyCamera = this.cameras.get('fly')
            flyCamera.keysForward = [90]
            flyCamera.keysBackward = [83]
            flyCamera.keysUp = [32]
            flyCamera.keysDown = [16]
            flyCamera.keysLeft = [81]
            flyCamera.keysRight = [68]
            flyCamera.rollCorrect = 2

            this.cameras.set(
                'universal',
                new BABYLON.UniversalCamera(
                    "universal-camera",
                    new BABYLON.Vector3(0, 5, -10),
                    GameEngine.world.scene
                )
            )
            const camera = this.cameras.get('universal')
            camera.attachControl(GameEngine.canvas, true); // Attach again
            // camera.keysForward = [90]
            // camera.keysBackward = [83]
            camera.keysUp = [90]
            camera.keysDown = [83]
            camera.keysLeft = [81]
            camera.keysRight = [68]
            camera.rollCorrect = 2
            camera.speed = 2; // Move speed
            camera.inertia = 0.2;
            camera.angularSensibility = 1500; // Mouse sensitivity
            camera.needMoveForGravity = true
            camera.checkCollisions = true;
            camera.applyGravity = true;
            camera.ellipsoid = new BABYLON.Vector3(1.1, 1.8, 1.1);
            camera.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0); // Lift collision point

            this.setCamera('universal')

            GameEngine.world.scene.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnKeyDownTrigger,
                    (evt) => {
                        if (evt.sourceEvent.key === 'c') {
                            GameEngine.world.scene.activeCamera.detachControl()
                            GameEngine.world.scene.activeCamera = GameEngine.world.scene.activeCamera === camera ? flyCamera : camera
                            GameEngine.world.scene.activeCamera.attachControl(GameEngine.canvas, true); // Attach again
                            this.camera = GameEngine.world.scene.activeCamera
                            GameEngine.eventManager.onCameraChange.notifyObservers({
                                camera: GameEngine.world.scene.activeCamera
                            })
                        }
                    }
                )
            );

            GameEngine.world.scene.onBeforeRenderObservable.add((e) => {
                const otherCam = GameEngine.world.scene.activeCamera === camera ? flyCamera : camera
                otherCam.position.copyFrom(GameEngine.world.scene.activeCamera.position)
                otherCam.rotation.copyFrom(GameEngine.world.scene.activeCamera.rotation)
            })
        })

        GameEngine.canvas.addEventListener('click', () => {
            GameEngine.canvas.requestPointerLock({unadjustedMovement: true})
        })
    }

    setCamera(cameraName: String) {
        if (this.cameras.has(cameraName)) {
            this.camera = this.cameras.get(cameraName)
            this.camera.attachControl(GameEngine.canvas, true);
            GameEngine.world.scene.activeCamera = this.camera
        }
    }
}