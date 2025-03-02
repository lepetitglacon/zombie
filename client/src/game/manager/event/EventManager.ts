import {Observable, PickingInfo, type Vector3} from "@babylonjs/core";

export default class EventManager {
    public onWorldMeshAdd: Observable;
    public onCameraChange: Observable;
    public onMapLoaded: Observable;
    public onSceneInit: Observable;
    public onGunShot: Observable<{
        pickInfos: PickingInfo[],
        direction: Vector3,
        baseGunDamage: number,
    }>;
    public onAds: Observable<{
        percentage: number
    }>;
    public onZombieSpawnCall: Observable<{}>;
    public onZombieKillCall: Observable<{}>;
    public onWaveStart: Observable<{}>;
    public onWaveEnd: Observable<{}>;

    public onBuyDoorDemand: Observable<{}>;
    public onDoorBought: Observable<{}>;

    constructor() {

        // init
        this.onSceneInit = new Observable()
        this.onWorldMeshAdd = new Observable()
        this.onMapLoaded = new Observable()
        this.onSceneInit = new Observable()

        // debug
        this.onCameraChange = new Observable()

        // world


        // gun
        this.onGunShot = new Observable()
        this.onAds = new Observable()

        // zombie / wave
        this.onZombieSpawnCall = new Observable()
        this.onZombieKillCall = new Observable()
        this.onWaveStart = new Observable()
        this.onWaveEnd = new Observable()
    }

}