import type GameEngine from "@/game/GameEngine";
import * as BABYLON from "@babylonjs/core";

export default class MapEditor {
    private engine: GameEngine;
    private grid: any[];

    constructor({engine}) {
        this.engine = engine

        this.grid = []

        this.engine.commandManager.registerCommand('make:wall', (args) => {
            this.createWall(args)
        })
    }

    init() {
        BABYLON.MeshBuilder.CreateGround('base ground', {}, this.engine.world.scene)

        this.createGrid()

        this.engine.world.babylonEngine.runRenderLoop(() => {

            // this.engine.world.scene.render();
        });
    }

    createGrid() {

    }

    createWall(args) {

    }

}