import * as BABYLON from '@babylonjs/core'
import { RecastJSPlugin } from "@babylonjs/core/Navigation/Plugins/recastJSPlugin";
import Recast from "recast-detour";
import '@babylonjs/loaders';

import type GameEngine from "@/game/GameEngine";

import mapGltf from '../../assets/gltf/flora_square.glb?url'

export default class World {
    private engine: GameEngine;
    public scene: any;
    public babylonEngine: BABYLON.Engine;
    private camera: BABYLON.UniversalCamera;
    public navigationPlugin: RecastJSPlugin;

    constructor({engine}) {
        this.engine = engine
        this.babylonEngine = new BABYLON.Engine(this.engine.canvas, true)
        this.scene = new BABYLON.Scene(this.babylonEngine)

        this.camera = new BABYLON.UniversalCamera(
            "camera11",
            new BABYLON.Vector3(0, 5, -10),
            this.scene
        );
        this.camera.inertia = 0
        this.camera.rollCorrect = 2
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.attachControl(this.engine.canvas, true);
        // zqsd https://www.toptal.com/developers/keycode
        this.camera.keysForward = [90]
        this.camera.keysBackward = [83]
        this.camera.keysUp = [32]
        this.camera.keysDown = [16]
        this.camera.keysLeft = [81]
        this.camera.keysRight = [68]

        const light = new BABYLON.HemisphericLight(
            "light",
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
        light.intensity = 0.7;

        this.bind()
    }

    bind() {
        window.addEventListener("resize", () => {
            this.babylonEngine.resize();
        });

        window.addEventListener("mousemove", () => {
            var pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
            if (pickinfo.hit) {
                console.log(pickinfo.pickedPoint);
            }
        });

        this.scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    if(pointerInfo.pickInfo.hit) {
                        console.log(pointerInfo)
                    }
                    break;
            }
        })
    }

    async init() {

        const filename = mapGltf.substring(mapGltf.lastIndexOf('/') + 1)
        const path = mapGltf.substring(0, mapGltf.lastIndexOf('/') + 1)
        const scene = await BABYLON.SceneLoader.AppendAsync(path, filename);

        const recast = await Recast();
        this.navigationPlugin = new RecastJSPlugin(recast);
        const navMeshObjects = ['Floor', 'Stair', 'Door', 'Wall', 'Building']
        this.navigationPlugin.createNavMesh(scene.meshes.filter(el => navMeshObjects.includes(el.metadata?.gltf?.extras?.type)), {
            cs: 0.2,
            ch: 0.1,
            walkableSlopeAngle: 35,
            walkableHeight: 1,
            walkableClimb: .02,
            walkableRadius: 1,
            maxEdgeLen: 12,
            maxSimplificationError: 1.3,
            minRegionArea: 8,
            mergeRegionArea: 20,
            maxVertsPerPoly: 6,
            detailSampleDist: 6,
            detailSampleMaxError: 1,
        })

        const navmeshdebug = this.navigationPlugin.createDebugNavMesh(this.engine.world.scene);
        const matdebug = new BABYLON.StandardMaterial("matdebug", this.engine.world.scene);
        matdebug.diffuseColor = new BABYLON.Color3(0.1, 0.2, 1);
        matdebug.alpha = 0.2;
        navmeshdebug.material = matdebug;

        this.babylonEngine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}