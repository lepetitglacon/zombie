import * as BABYLON from "@babylonjs/core";

export class Camera extends BABYLON.FlyCamera {

    constructor(name: string, position: BABYLON.Vector3, scene?: BABYLON.Scene, setActiveOnSceneIfNoneActive?: boolean) {
        super(name, position, scene, setActiveOnSceneIfNoneActive);
    }

}