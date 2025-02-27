import * as BABYLON from '@babylonjs/core'
import World from './world/World'
import CommandManager from "@/game/manager/commands/CommandManager";
import ZombieManager from "@/game/manager/zombie/ZombieManager";
import Gui from "@/game/gui/Gui";
import MapEditor from "@/game/editor/MapEditor";
import CameraManager from "@/game/manager/camera/CameraManager";
import GunManager from "@/game/manager/gun/GunManager";

 class GameEngine {

    public canvas: HTMLCanvasElement;
    public world: World;
    public chatEngineRef: any;
    public commandManager: CommandManager;
    public cameraManager: CameraManager;
    public zombieManager: ZombieManager;
    public gunManager: GunManager;
    public gui: Gui;
    public mapEditor: MapEditor;

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.init()
    }

    async init() {
        // Game
        this.world = new World()
        this.gui = new Gui()
        // this.mapEditor = new MapEditor({engine: this})

        // Managers
        this.cameraManager = new CameraManager()
        this.commandManager = new CommandManager()
        this.zombieManager = new ZombieManager()
        this.gunManager = new GunManager()

        await this.world.init()
        // await this.mapEditor.init()
        await this.zombieManager.init() //todo mettre navmesh ici
    }
}
const gameEngine = new GameEngine()
export default gameEngine
