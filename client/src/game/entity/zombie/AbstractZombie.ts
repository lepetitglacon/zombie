import AbstractEntity from "@/game/entity/AbstractEntity";
import * as BABYLON from "@babylonjs/core";
import * as GUI from '@babylonjs/gui'
import * as CANNON from 'cannon-es'
import GameEngine from "@/game/GameEngine";

export default class AbstractZombie extends AbstractEntity {
    public hp: number;
    public hitbox: BABYLON.Mesh;
    public agentId: number;
    public agentParameters: {
        maxAcceleration: number;
        separationWeight: number;
        collisionQueryRange: number;
        maxSpeed: number;
        radius: number;
        pathOptimizationRange: number;
        height: number
    };
    public transform: BABYLON.TransformNode;
    private plane: BABYLON.Mesh;
    private textBlock: GUI.TextBlock;

    constructor(scene: BABYLON.Scene) {
        super(scene)

        this.hp = 100
        this.agentParameters = {
            radius: .5,
            height: 1.8,
            maxAcceleration: 1.5,
            maxSpeed: 2.5,
            collisionQueryRange: 1,
            pathOptimizationRange: 0.0,
            separationWeight: 1.0,
        }

        this.hitbox = BABYLON.MeshBuilder.CreateCapsule("box", {
            height: this.agentParameters.height,
            radius: this.agentParameters.radius
        }, scene);
        this.hitbox.position.y += this.agentParameters.height / 2;
        this.hitbox.isZombie = true
        this.hitbox.zombie = this

        this.transform = new BABYLON.TransformNode('transform');
        this.hitbox.parent = this.transform;

        this.pathPoints = null
        this.pathLine = null

        this.plane = BABYLON.MeshBuilder.CreatePlane("plane", {
            size: 5
        }, GameEngine.world.scene);
        this.plane.parent = this.transform;
        this.plane.position.y = 2;
        this.plane.rotation.y = Math.PI;
        this.plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;

        this.textBlock = new GUI.TextBlock();
        this.textBlock.text = `${this.id} ${this.hp}`;
        this.textBlock.color = "white";
        this.textBlock.fontSize = 64;
        const advancedTexture2 = GUI.AdvancedDynamicTexture.CreateForMesh(
            this.plane,
            1024,
            1024,
            false
        );
        advancedTexture2.addControl(this.textBlock)

        GameEngine.world.scene.onBeforeRenderObservable.add((e) => {
            this.textBlock.text = `${this.agentId} ${this.hp}`;
        })

    }

    kill() {
        this.plane.dispose()
        this.textBlock.dispose()
        this.transform.dispose()
        this.hitbox.dispose()
    }

}