import AbstractEntity from "@/game/entity/AbstractEntity";
import * as BABYLON from "@babylonjs/core";
import * as CANNON from 'cannon-es'

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
            height: 1.8,
            maxAcceleration: 1.5,
            maxSpeed: 2.5,
            collisionQueryRange: 1,
            pathOptimizationRange: 0.0,
            separationWeight: 1.0
        }

        this.hitbox = BABYLON.MeshBuilder.CreateCapsule("box", {
            height: this.agentParameters.height,
            radius: this.agentParameters.radius
        }, scene);

        this.transform = new BABYLON.TransformNode('transform');
        this.hitbox.parent = this.transform;

        this.pathPoints = null
        this.pathLine = null

    }

}