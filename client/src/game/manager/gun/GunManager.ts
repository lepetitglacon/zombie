import GameEngine from "@/game/GameEngine";
import * as BABYLON from "@babylonjs/core";
import {Color4, Mesh, PointerInfo, Ray, Vector3} from "@babylonjs/core";

export default class GunManager {
    private guns: Gun[];
    private gun: Gun;

    constructor() {
        this.guns = []

        this.registerGun()
        this.selectGun()
    }

    registerGun() {
        this.guns.push(new Gun({
            name: 'pistol'
        }))
    }

    selectGun() {
        this.gun = this.guns[0]
        GameEngine.world.scene.addMesh(this.gun.model)
        console.log(`${this.gun} selected`)
    }

}

class Gun {
    private name: string;
    model: BABYLON.Mesh;
    private shotBullets: Ray[];
    private maxRecoilAngle: number;

    constructor({name}) {
        this.name = name
        this.shotBullets = []
        this.maxRecoilAngle = 0.3

        const mat = new BABYLON.StandardMaterial("test", GameEngine.world.scene);
        mat.alpha = 1;
        mat.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
        mat.detailMap.isEnabled = true;
        mat.detailMap.roughnessLevel = 0.80;

        this.model = BABYLON.MeshBuilder.CreateBox(this.name, {
            size: .2,
        })
        this.model.parent = GameEngine.cameraManager.camera
        this.model.position = new Vector3(.2, -.3, -1.1)
        this.model.material = mat

        GameEngine.eventManager.onCameraChange.add((e) => {
            this.model.parent = e.camera
        })

        GameEngine.world.scene.onPointerObservable.add((e: PointerInfo) => {
            if (e.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                this.fire()
            }
        })

        GameEngine.world.scene.onBeforeRenderObservable.add(() => {
            if (this.model.rotation.x > 0) {
                this.model.rotation.x -= 0.005;
            }
        })

    }

    fire() {
        console.log('shoot')
        const dir = GameEngine.cameraManager.camera.getDirection(Vector3.Forward())
        const pos = GameEngine.cameraManager.camera.position
        const ray = new Ray(pos, dir, 50)
        const rayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(GameEngine.world.scene);
        this.shotBullets.push(ray)

        const box = BABYLON.MeshBuilder.CreateBox(this.name, {
            size: 5
        }, GameEngine.world.scene)
        box.position.copyFrom(pos.add(dir.scale(50)))

        if (this.model.rotation.x < this.maxRecoilAngle)
        this.model.rotation.x += 0.1;
    }

}