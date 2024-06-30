import AbstractEntity from "@/game/entity/AbstractEntity";
import * as BABYLON from "@babylonjs/core";

export default class AbstractZombie extends AbstractEntity {
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

    constructor(scene: BABYLON.Scene) {
        super(scene)

        this.agentParameters = {
            radius: .5,
            height: 0.2,
            maxAcceleration: 25.0,
            maxSpeed: 10.0,
            collisionQueryRange: 0.5,
            pathOptimizationRange: 0.0,
            separationWeight: 1.0
        }

        var matAgent = new BABYLON.StandardMaterial('mat2', scene);
        var variation = Math.random();
        matAgent.diffuseColor = new BABYLON.Color3(0.4 + variation * 0.6, 0.3, 1.0 - variation * 0.3);

        this.hitbox = BABYLON.MeshBuilder.CreateBox("box", {
            size: 1
        }, scene);

        this.hitbox.material = matAgent;

        this.transform = new BABYLON.TransformNode('transform');
        this.hitbox.parent = this.transform;

    }

}