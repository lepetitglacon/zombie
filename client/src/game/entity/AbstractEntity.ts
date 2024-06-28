import * as BABYLON from '@babylonjs/core'

export default class AbstractEntity extends BABYLON.AbstractMesh {

    constructor(scene: BABYLON.Scene) {
        super('zombie', scene);
        this.position = new BABYLON.Vector3();

        this.showBoundingBox = true
    }


}