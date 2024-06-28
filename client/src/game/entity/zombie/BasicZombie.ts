import AbstractZombie from "@/game/entity/zombie/AbstractZombie";
import * as BABYLON from "@babylonjs/core";

export default class BasicZombie extends AbstractZombie {

    constructor(scene: BABYLON.Scene) {
        super(scene);
    }

}