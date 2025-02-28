import decalTexture from '@/assets/img/decalTexture.png'
import fireSound from "@/assets/sound/weapons/M1911/fire.mp3?url"

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
            name: 'pistol',
            fireSound: new BABYLON.Sound(
                'test',
                fireSound,
                GameEngine.world.scene,
                null,
                {
                    loop: false,
                    autoplay: false,
                }
            )
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
    fireSound: BABYLON.Sound|null;
    model: BABYLON.Mesh;
    private shotBullets: Ray[];
    private maxRecoilAngle: number;

    constructor({name, fireSound}) {
        this.name = name
        this.fireSound = fireSound
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
        const pos = GameEngine.cameraManager.camera.position.clone()
        const ray = new Ray(pos, dir.negate(), 50)
        const rayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(GameEngine.world.scene);
        this.shotBullets.push(ray)

        const result = ray.intersectsMeshes(GameEngine.world.scene.meshes)
        for (const pickingInfo of result) {

            const decal = BABYLON.MeshBuilder.CreateDecal(
                "decal",
                pickingInfo.pickedMesh,
                {
                    position: pickingInfo.pickedPoint,
                    normal: pickingInfo.getNormal(true),
                    size: new Vector3(.1, .1, .1),
                }
            );

            var decalMaterial = new BABYLON.StandardMaterial("decalMat", GameEngine.world.scene);
            decalMaterial.diffuseTexture = new BABYLON.Texture(decalTexture, GameEngine.world.scene);
            decalMaterial.diffuseTexture.hasAlpha = true;
            decalMaterial.zOffset = -2;
            decal.material = decalMaterial
        }

        this.fireSound?.stop()
        this.fireSound?.play()

        if (this.model.rotation.x < this.maxRecoilAngle)
        this.model.rotation.x += 0.1;

        GameEngine.eventManager.onGunShot.notifyObservers({
            pickInfos: result,
            direction: dir,
        })
    }

}