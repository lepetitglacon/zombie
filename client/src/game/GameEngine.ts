import * as BABYLON from '@babylonjs/core'
import World from './world/World'
import CommandManager from "@/game/manager/commands/CommandManager";
import ZombieManager from "@/game/manager/zombie/ZombieManager";
import Gui from "@/game/gui/Gui";
import MapEditor from "@/game/editor/MapEditor";
import CameraManager from "@/game/manager/camera/CameraManager";
import GunManager from "@/game/manager/gun/GunManager";
import {type Ref, ref} from "vue";
import EventManager from "@/game/manager/event/EventManager";
import SoundManager from "@/game/manager/sound/SoundManager";
import ModelManager from "@/game/manager/model/ModelManager";

 class GameEngine {

    public points: number;
    public canvas: HTMLCanvasElement;
    public world: World;
    public chatEngineRef: any;
    public modelManager: ModelManager;
    public soundManager: SoundManager;
    public eventManager: EventManager;
    public commandManager: CommandManager;
    public cameraManager: CameraManager;
    public zombieManager: ZombieManager;
    public gunManager: GunManager;
    public gui: Gui;
    public mapEditor: MapEditor;
    private playerPosition: Ref<HTMLDivElement>;

    constructor() {
        this.points = 0
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.init()
    }

    async init() {
        this.world = new World()

        this.eventManager = new EventManager()
        this.modelManager = new ModelManager()
        this.soundManager = new SoundManager()
        this.cameraManager = new CameraManager()
        this.commandManager = new CommandManager()
        this.zombieManager = new ZombieManager()
        this.gunManager = new GunManager()

        this.gui = new Gui()
        // this.mapEditor = new MapEditor()

        // await this.mapEditor.init()
        await this.modelManager.init()
        await this.world.loadMap()
        await this.world.init()
        await this.zombieManager.init()
        // await this.eventManager.init()
        // await this.soundManager.init()
        // await this.cameraManager.init()
        // await this.commandManager.init()
        await this.zombieManager.init()
        // await this.gunManager.init()
    }
}

let gameEngine = new GameEngine()
export default gameEngine
