import {Observable} from "@babylonjs/core";

export default class EventManager {
    public onWorldMeshAdd: Observable;
    public onCameraChange: Observable;
    public onMapLoaded: Observable;
    public onSceneInit: Observable;

    constructor() {
        this.onMapLoaded = new Observable()
        this.onWorldMeshAdd = new Observable()
        this.onCameraChange = new Observable()
        this.onSceneInit = new Observable()
    }

}