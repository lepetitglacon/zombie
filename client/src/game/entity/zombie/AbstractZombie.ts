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

        this.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.hitbox,
            BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 10,
                friction: 0.5,
                restitution: 0,
                nativeOptions: {
                    type: CANNON.Body.STATIC
                }
            },
            scene
        );

        // scene.onBeforeRenderObservable.add(() => {
        //     let targetPosition = new BABYLON.Vector3();
        //     let path = this.engine.computePath(this.hitbox.position, targetPosition);
        //
        //     if (path.length > 0) {
        //         let nextStep = path[0];
        //         let moveDirection = nextStep.subtract(this.hitbox.position).normalize().scale(0.05);
        //
        //         this.physicsImpostor.setLinearVelocity(moveDirection);
        //     }
        // });

        // this.hitbox.material = matAgent;

        this.transform = new BABYLON.TransformNode('transform');
        this.hitbox.parent = this.transform;

    }

}