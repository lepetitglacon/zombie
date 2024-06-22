import * as BABYLON from '@babylonjs/core'

export default class AbstractEntity {
    position: BABYLON.Vector3;

    constructor() {
        this.position = new BABYLON.Vector3();
    }


}