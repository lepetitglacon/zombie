import * as BABYLON from '@babylonjs/core'
import * as GUI from '@babylonjs/gui'
import GameEngine from "@/game/GameEngine";

export default class Gui {
    advancedTexture: GUI.AdvancedDynamicTexture;

    constructor() {
        // GUI
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, GameEngine.world.scene);

        // this.createButton({
        //     name: 'test',
        //     text: 'test',
        //     trigger: (e) => {
        //         console.log(e)
        //     }
        // })

        const StackPanel = new GUI.StackPanel();
        StackPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        StackPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
        this.advancedTexture.addControl(StackPanel)

        const textBlock = new GUI.TextBlock();
        textBlock.text = `Zombars: ${GameEngine.zombieManager.zombies.size}`;
        textBlock.color = "white";
        textBlock.fontSize = 16;
        textBlock.width = '150px'
        textBlock.height = '20px'
        StackPanel.addControl(textBlock)

        const textBlock2 = new GUI.TextBlock();
        textBlock2.text = `Wave: ${GameEngine.zombieManager.waveHandler.wave}`;
        textBlock2.color = "white";
        textBlock2.fontSize = 16;
        textBlock2.width = '150px'
        textBlock2.height = '20px'
        StackPanel.addControl(textBlock2)

        const textBlock3 = new GUI.TextBlock();
        textBlock3.text = `Points: ${GameEngine.zombieManager.waveHandler.wave}`;
        textBlock3.color = "white";
        textBlock3.fontSize = 16;
        textBlock3.width = '150px'
        textBlock3.height = '20px'
        StackPanel.addControl(textBlock3)





        GameEngine.world.scene.onBeforeRenderObservable.add((e) => {
            textBlock.text = `Zombars: ${GameEngine.zombieManager.zombies.size}`;
            textBlock2.text = `Wave: ${GameEngine.zombieManager.waveHandler.wave}`;
            textBlock3.text = `Points: ${GameEngine.points}`;
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

    registerInfo() {

    }


}