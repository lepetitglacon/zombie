import * as BABYLON from '@babylonjs/core'
import * as GUI from '@babylonjs/gui'
import GameEngine from "@/game/GameEngine";

export default class Gui {
    private advancedTexture: GUI.AdvancedDynamicTexture;

    constructor() {
        // GUI
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, GameEngine.world.scene);

        this.createButton({
            name: 'test',
            text: 'test',
            trigger: (e) => {
                console.log(e)
            }
        })
    }

    createButton(options = {}) {
        const button1 = GUI.Button.CreateSimpleButton(options.name, options.text);
        Object.assign(button1, options);
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
        button1.onPointerUpObservable.add((e) => {
            options.trigger(e)
        });
        this.advancedTexture.addControl(button1);
    }


}