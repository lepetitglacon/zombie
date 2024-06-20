import * as BABYLON from '@babylonjs/core'
import World from './world/World'

export default class GameEngine {
    public canvas: HTMLCanvasElement;
    public engine: BABYLON.Engine;
    public scene: BABYLON.Scene;
    public camera: BABYLON.UniversalCamera;
    public world: World;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas

        window.addEventListener('keypress', (e: KeyboardEvent) => {
            console.log(e.code, e.key, e.keyCode, e.which)
        })

        this.engine = new BABYLON.Engine(this.canvas, true)
        this.scene = new BABYLON.Scene(this.engine)

        this.world = new World({engine: this})

        this.camera = new BABYLON.FlyCamera(
            "camera11",
            new BABYLON.Vector3(0, 5, -10),
            this.scene
        );
        this.camera.inertia = 0
        this.camera.rollCorrect = 2
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.attachControl(this.canvas, true);
        // zqsd https://www.toptal.com/developers/keycode
        this.camera.keysForward = [90]
        this.camera.keysBackward = [83]
        this.camera.keysUp = [32]
        this.camera.keysDown = [16]
        this.camera.keysLeft = [81]
        this.camera.keysRight = [68]
        console.log(this.camera)

        this.canvas.addEventListener('click', () => {
            this.canvas.requestPointerLock({unadjustedMovement: true})
        })

        const light = new BABYLON.HemisphericLight(
            "light",
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
        light.intensity = 0.7;

        const sphere = BABYLON.MeshBuilder.CreateSphere(
            "sphere",
            {diameter: 2, segments: 32},
            this.scene
        );
        sphere.position.y = 1;

        const ground = BABYLON.MeshBuilder.CreateGround(
            "ground",
            {width: 6, height: 6},
            this.scene
        );

        window.addEventListener("resize", () => {
            this.engine.resize();
        });

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    async init() {
        await this.world.init()
    }



}