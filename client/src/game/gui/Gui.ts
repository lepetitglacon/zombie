import * as BABYLON from '@babylonjs/core'
import * as GUI from '@babylonjs/gui'
import type GameEngine from "@/game/GameEngine";

export default class Gui {
    private engine: GameEngine;
    private advancedTexture: GUI.AdvancedDynamicTexture;

    constructor({engine}) {
        this.engine = engine

        // GUI
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.engine.world.scene);


    }

    createButton(options = {}) {
        const button1 = GUI.Button.CreateSimpleButton(options.name, options.text);
        Object.assign(button1, options);
        // button1.width = "150px"
        // button1.height = "40px";
        // button1.color = "white";
        // button1.cornerRadius = 5;
        button1.background = "green";
        button1.onPointerEnterObservable.add(() => {
            button1.background = 'blue'
        });
        button1.onPointerOutObservable.add(() => {
            button1.background = 'green'
        });
        button1.onPointerUpObservable.add(function() {
            options.trigger()
        });
        this.advancedTexture.addControl(button1);
    }


}