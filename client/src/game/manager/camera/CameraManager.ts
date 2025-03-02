import GameEngine from "@/game/GameEngine";
import * as BABYLON from "@babylonjs/core";
import {type Ref, ref, type UnwrapRef} from "vue";
import {Lerp} from "@babylonjs/core/Maths/math.scalar.functions";

export default class CameraManager {
    private cameras: Map<String, BABYLON.FlyCamera|BABYLON.UniversalCamera>;
    public camera: BABYLON.FlyCamera|BABYLON.UniversalCamera;
    aiming: Ref<UnwrapRef<boolean>>;
    running: boolean;

    constructor() {
        this.cameras = new Map()
        const baseSensiblity = 1500
        const adsSensiblity = 10000

        const baseSpeed = 2
        const adsSpeed = 1
        this.running = false
        const runningSpeed = 3

        this.aiming = ref(false)
        const aimingFov = .50
        const normalFov = .80
        window.addEventListener("mousedown", (event) => {
            if (event.button === 2) this.aiming.value = true
        });
        window.addEventListener("mouseup", (event) => {
            if (event.button === 2) this.aiming.value = false
        });

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
            camera.minZ = 0.01; // Move speed
            camera.inertia = 0.2;
            camera.angularSensibility = baseSensiblity; // Mouse sensitivity
            camera.needMoveForGravity = true
            camera.checkCollisions = true;
            camera.applyGravity = true;
            camera.ellipsoid = new BABYLON.Vector3(1.1, 1.8, 1.1);
            camera.ellipsoidOffset = new BABYLON.Vector3(0, 2, 0); // Lift collision point

            this.setCamera('universal')

            GameEngine.world.scene.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnKeyDownTrigger,
                    (evt) => {
                        if (evt.sourceEvent.key === 'c') {
                            this.camera.detachControl()
                            GameEngine.world.scene.activeCamera = GameEngine.world.scene.activeCamera === camera ? flyCamera : camera
                            this.camera = GameEngine.world.scene.activeCamera
                            this.camera.attachControl(GameEngine.canvas, true); // Attach again
                            this.camera.rotation.x = 0
                            this.camera.rotation.z = 0
                            GameEngine.eventManager.onCameraChange.notifyObservers({
                                camera: this.camera
                            })
                        }

                        if (evt.sourceEvent.key === 'Shift') {
                            this.running = true
                        }
                    }
                )
            );

            GameEngine.world.scene.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnKeyUpTrigger,
                    (evt) => {
                        if (evt.sourceEvent.key === 'Shift') {
                            this.running = false
                        }
                    }
                )
            );

            GameEngine.eventManager.onAds.add((e) => {
                this.camera.angularSensibility = Lerp(baseSensiblity, Math.min(adsSensiblity, baseSensiblity), e.percentage)
                this.camera.speed = Lerp(baseSpeed, Math.min(adsSpeed, baseSpeed), e.percentage)
            })

            GameEngine.world.scene.onBeforeRenderObservable.add((e) => {
                const otherCam = GameEngine.world.scene.activeCamera === camera ? flyCamera : camera
                otherCam.position.copyFrom(GameEngine.world.scene.activeCamera.position)
                otherCam.rotation.copyFrom(GameEngine.world.scene.activeCamera.rotation)


                if (this.aiming.value) {
                    if (GameEngine.world.scene.activeCamera.fov > aimingFov) {
                        GameEngine.world.scene.activeCamera.fov -= 0.05
                    }
                } else {
                    if (GameEngine.world.scene.activeCamera.fov < normalFov) {
                        GameEngine.world.scene.activeCamera.fov += 0.05
                    }
                }

                if (this.running) {
                    GameEngine.world.scene.activeCamera.speed = runningSpeed
                } else {
                    GameEngine.world.scene.activeCamera.speed = baseSpeed
                }

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
            GameEngine.eventManager.onCameraChange.notifyObservers({
                camera: GameEngine.world.scene.activeCamera
            })
        }
    }
}