import * as BABYLON from '@babylonjs/core'
import World from './world/World'
import CommandManager from "@/game/commands/CommandManager";

export default class GameEngine {
    public canvas: HTMLCanvasElement;
    public world: World;
    public chatEngineRef: any;
    public commandManager: CommandManager;

    constructor(options: {
        canvas: HTMLCanvasElement,
        chatEngineRef: any
    }) {
        // refs
        this.canvas = options.canvas
        this.chatEngineRef = options.chatEngineRef

        // Managers
        this.commandManager = new CommandManager({engine: this})

        // Game
        this.world = new World({engine: this})

        this.canvas.addEventListener('click', () => {
            this.canvas.requestPointerLock({unadjustedMovement: true})
        })

    }

    async init() {
        await this.world.init()
    }
}