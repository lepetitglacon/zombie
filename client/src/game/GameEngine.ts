import * as BABYLON from '@babylonjs/core'
import World from './world/World'
import CommandManager from "@/game/manager/commands/CommandManager";
import ZombieManager from "@/game/manager/zombie/ZombieManager";
import Gui from "@/game/gui/Gui";
import MapEditor from "@/game/editor/MapEditor";
import CameraManager from "@/game/manager/camera/CameraManager";
import type {Ref} from "vue";
import {Vector3} from "@babylonjs/core";

export default class GameEngine extends EventTarget {
    public canvas: HTMLCanvasElement;
    public world: World;
    public chatEngineRef: any;
    public commandManager: CommandManager;
    public cameraManager: CameraManager;
    public zombieManager: ZombieManager;
    public gui: Gui;
    public mapEditor: MapEditor;
    private playerPosition: Ref<HTMLDivElement>;

    constructor(options: {
        canvas: HTMLCanvasElement,
        chatEngineRef: any
        playerPosition: HTMLDivElement
    }) {
        super()
        // refs
        this.canvas = options.canvas
        this.chatEngineRef = options.chatEngineRef
        this.playerPosition = options.playerPosition

        // Managers
        this.commandManager = new CommandManager({engine: this})
        // this.zombieManager = new ZombieManager({engine: this})

        // Game
        this.world = new World({engine: this})
        // this.gui = new Gui({engine: this})
        // this.mapEditor = new MapEditor({engine: this})

        // this.cameraManager = new CameraManager({engine: this})


        this.canvas.addEventListener('click', () => {
            this.canvas.requestPointerLock({unadjustedMovement: true})
        })

    }

    async init() {
        await this.world.init()
        // // await this.mapEditor.init()
        // await this.zombieManager.init() //todo mettre navmesh ici
        //
        //
        // this.world.scene.onBeforeRenderObservable.add(() => {
        //     this.playerPosition.value = this.cameraManager.camera.getDirection(Vector3.Forward())
        // });


    }
}