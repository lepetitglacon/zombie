import * as BABYLON from "@babylonjs/core";
import GameEngine from "@/game/GameEngine";
import * as CANNON from "cannon-es";
import type GameEngine from "@/game/GameEngine";
import {type Mesh, PhysicsImpostor} from "@babylonjs/core";

export class Player {

    constructor() {
        this.camera = GameEngine.cameraManager.camera
        this.gun = GameEngine.gunManager.gun

        const options: BABYLON.ICreateCapsuleOption = {
            height: 1.8,
            radius: .5,
            position: new BABYLON.Vector3(0, 0, 0),
        }
        this.mesh = BABYLON.MeshBuilder.CreateCapsule('player', options, GameEngine.world.scene)
        this.mesh.position.y = 5
        this.body = new BABYLON.PhysicsImpostor(
            this.mesh,
            BABYLON.PhysicsImpostor.CylinderImpostor,
            {
                mass: 80,
                nativeOptions: {
                    type: CANNON.BODY_TYPES.KINEMATIC
                }
            },
            GameEngine.world.scene
        )
    }

}