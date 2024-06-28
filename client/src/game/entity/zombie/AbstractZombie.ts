import AbstractEntity from "@/game/entity/AbstractEntity";
import * as BABYLON from "@babylonjs/core";

export default class AbstractZombie extends AbstractEntity {
    private hitbox: BABYLON.Mesh;
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

    constructor(scene: BABYLON.Scene) {
        super(scene)

        this.hitbox = BABYLON.MeshBuilder.CreateBox("box", {
            size: 1
        }, scene);

        this.agentParameters = {
            radius: .5,
            height: 0.2,
            maxAcceleration: 4.0,
            maxSpeed: 1.0,
            collisionQueryRange: 0.5,
            pathOptimizationRange: 0.0,
            separationWeight: 1.0
        }
    }

}