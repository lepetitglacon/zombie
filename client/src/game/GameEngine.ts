import * as BABYLON from '@babylonjs/core'
import World from './world/World'
import CommandManager from "@/game/manager/commands/CommandManager";
import ZombieManager from "@/game/manager/zombie/ZombieManager";
import Gui from "@/game/gui/Gui";
import MapEditor from "@/game/editor/MapEditor";
import CameraManager from "@/game/manager/camera/CameraManager";
import GunManager from "@/game/manager/gun/GunManager";
import type {Ref} from "vue";
import {Vector3} from "@babylonjs/core";
import EventManager from "@/game/manager/event/EventManager";

 class GameEngine {

    public canvas: HTMLCanvasElement;
    public world: World;
    public chatEngineRef: any;
    public eventManager: EventManager;
    public commandManager: CommandManager;
    public cameraManager: CameraManager;
    public zombieManager: ZombieManager;
    public gunManager: GunManager;
    public gui: Gui;
    public mapEditor: MapEditor;
    private playerPosition: Ref<HTMLDivElement>;

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.init()
    }

    async init() {
        this.world = new World()

        this.eventManager = new EventManager()

        // Managers
        this.cameraManager = new CameraManager()
        this.commandManager = new CommandManager()
        this.zombieManager = new ZombieManager()
        this.gunManager = new GunManager()

        // Game
        this.gui = new Gui()
        // this.mapEditor = new MapEditor({engine: this})


        await this.world.loadMap()
        await this.world.init()
        // await this.mapEditor.init()
        await this.zombieManager.init() //todo mettre navmesh ici
    }
}
const gameEngine = new GameEngine()
export default gameEngine
