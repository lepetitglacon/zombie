import * as BABYLON from '@babylonjs/core'
import * as GUI from '@babylonjs/gui'
import type GameEngine from "@/game/GameEngine";

export default class Gui {
    private engine: GameEngine;

    constructor({engine}) {
        this.engine = engine

        // GUI
        const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.engine.world.scene);

        const button1 = GUI.Button.CreateSimpleButton("but1", "Click Me");
        button1.width = "150px"
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 5;
        button1.background = "green";
        button1.onPointerEnterObservable.add(() => {
            button1.background = 'blue'
        });
        button1.onPointerOutObservable.add(() => {
            button1.background = 'green'
        });
        button1.onPointerUpObservable.add(function() {
            alert("you did it!");
        });
        advancedTexture.addControl(button1);
    }


}