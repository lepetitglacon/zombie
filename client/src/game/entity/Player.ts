import * as BABYLON from "@babylonjs/core";
import type GameEngine from "@/game/GameEngine";

export class Player {
    private engine: GameEngine;

    constructor({engine}) {

        this.camera = ''
        this.engine = engine


        const options: BABYLON.ICreateCapsuleOption = {
            height: 1.8,
            radius: .5,
            position: new BABYLON.Vector3(0, 0, 0),
        }
        this.mesh = BABYLON.MeshBuilder.CreateCapsule('player', options, this.engine.world.scene)
        this.mesh.position.y = 5
        this.body = new BABYLON.PhysicsImpostor(
            this.mesh,
            BABYLON.PhysicsImpostor.CylinderImpostor,
            {
                mass: 80
            },
            this.engine.world.scene
        )
    }

}