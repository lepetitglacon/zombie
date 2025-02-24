import type GameEngine from "@/game/GameEngine";
import * as BABYLON from "@babylonjs/core";

export default class CameraManager {
    private engine: GameEngine;
    private cameras: Map<String, BABYLON.FlyCamera|BABYLON.UniversalCamera>;
    public camera: BABYLON.FlyCamera|BABYLON.UniversalCamera;

    constructor({engine}) {
        this.engine = engine

        this.cameras = new Map()
        this.cameras.set(
            'fly',
            new BABYLON.FlyCamera(
                "fly-camera",
                new BABYLON.Vector3(0, 5, -10),
                this.engine.world.scene
            )
        )
        this.cameras.set(
            'universal',
            new BABYLON.UniversalCamera(
                "universal-camera",
                new BABYLON.Vector3(0, 5, -10),
                this.engine.world.scene
            )
        )

        this.setCamera('fly')

        // this.camera = new BABYLON.UniversalCamera(
        //     "camera",
        //     new BABYLON.Vector3(0, 10, 0),
        //     this.scene
        // );
        // this.camera.attachControl(this.engine.canvas, true);
        //
        // // Enable gravity and collisions
        // this.camera._needMoveForGravity = false;
        // this.camera.applyGravity = true;
        // this.camera.checkCollisions = true;
        // this.camera.ellipsoid = new BABYLON.Vector3(.5, .5, .5); // Defines the camera's collision shape
        // this.camera.speed = 5;
        // this.camera.minZ = 0.1; // Prevents near-plane clipping
        // this.camera.keysForward = [90]
        // this.camera.keysBackward = [83]
        // this.camera.keysUpward = []
        // this.camera.keysDownward = []
        // this.camera.keysUp = [90]
        // this.camera.keysDown = [83]
        // this.camera.keysLeft = [81]
        // this.camera.keysRight = [68]
        //
        //
        // this.camera = new BABYLON.FlyCamera(
        //     "camera11",
        //     new BABYLON.Vector3(0, 5, -10),
        //     this.scene
        // );

        // this.camera.setTarget(BABYLON.Vector3.Zero());
        //
        // // zqsd https://www.toptal.com/developers/keycode
        // this.camera.attachControl(this.engine.canvas, true);

        // this.camera.speed += 5
    }

    setCamera(cameraName: String) {
        if (this.cameras.has(cameraName)) {
            this.camera = this.cameras.get(cameraName)
            this.camera.attachControl(this.engine.canvas, true);

            this.camera.keysForward = [90]
            this.camera.keysBackward = [83]
            this.camera.keysUp = [32]
            this.camera.keysDown = [16]
            this.camera.keysLeft = [81]
            this.camera.keysRight = [68]

            // this.camera.inertia = .5
            this.camera.rollCorrect = 2
        }
    }
}