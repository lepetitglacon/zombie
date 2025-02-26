import mapGltf from '../../assets/gltf/flora_square.glb?url'

import * as BABYLON from '@babylonjs/core'
import * as CANNON from 'cannon-es'
import { Inspector } from '@babylonjs/inspector'
import { RecastJSPlugin } from "@babylonjs/core/Navigation/Plugins/recastJSPlugin";
import Recast from "recast-detour";
import '@babylonjs/loaders';
import type GameEngine from "@/game/GameEngine";
import {Mesh} from "@babylonjs/core";
import {Player} from "@/game/entity/Player";


export default class World {
    private engine: GameEngine;
    public scene: any;
    public babylonEngine: BABYLON.Engine;
    private camera: BABYLON.FlyCamera|BABYLON.UniversalCamera;
    public navigationPlugin: RecastJSPlugin;
    public physicsPlugin: BABYLON.CannonJSPlugin
    public pointerTarget = BABYLON.Vector3
    private obstacles: Map<BABYLON.IObstacle, Mesh>;

    constructor({engine}) {
        this.engine = engine
        this.babylonEngine = new BABYLON.Engine(this.engine.canvas, true)
        this.scene = new BABYLON.Scene(this.babylonEngine)

        // Inspector.Show(this.scene, {})

        window.CANNON = CANNON;
        const gravityVector = new BABYLON.Vector3(0,-9.81, 0);
        this.physicsPlugin = new BABYLON.CannonJSPlugin();
        this.scene.enablePhysics(gravityVector, this.physicsPlugin)

        this.obstacles = new Map()

        this.pointerTarget = new BABYLON.Vector3()



        const light = new BABYLON.HemisphericLight(
            "light",
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
        light.intensity = 0.7;

        this.bind()
    }

    async init() {
        this.player = new Player({engine: this.engine})
        this.scene.onBeforeRenderObservable.add(() => {
            this.engine.cameraManager.camera.position.copyFrom(this.player.mesh.position);
            // TODO bouger l'object player avec les event
        });

        const filename = mapGltf.substring(mapGltf.lastIndexOf('/') + 1)
        const path = mapGltf.substring(0, mapGltf.lastIndexOf('/') + 1)
        const scene = await BABYLON.SceneLoader.AppendAsync(path, filename);

        const gltfRoot = scene.getMeshById('__root__')
        if (gltfRoot) {
            gltfRoot.scaling.x = -1
        }

        const recast = await Recast();
        this.navigationPlugin = new RecastJSPlugin(recast);
        const navMeshObjects = ['Floor', 'Stair', 'Building']
        this.navigationPlugin.createNavMesh(scene.meshes.filter(el => navMeshObjects.includes(el.metadata?.gltf?.extras?.type)), {
            cs: 0.2,
            ch: 0.2,
            walkableSlopeAngle: 35,
            walkableHeight: 1.5,
            walkableClimb: 1,
            walkableRadius: 1.5,
            maxEdgeLen: 12,
            maxSimplificationError: 1,
            minRegionArea: 8,
            mergeRegionArea: 50,
            maxVertsPerPoly: 6,
            detailSampleDist: 6,
            detailSampleMaxError: 1,
            tileSize: 64
        })
        // console.log(this.navigationPlugin.getNavmeshData())
        this.navigationPlugin.setDefaultQueryExtent(new BABYLON.Vector3(1, 1, 1))

        for (const mesh of scene.meshes) {
            switch (mesh?.metadata?.gltf?.extras?.type) {
                case 'Floor': {
                    const floor = BABYLON.MeshBuilder.CreateGround(
                        "ground",
                        {
                            width: 100,
                            height: 100,
                        },
                        this.scene
                    );
                    const floorImpostor = new BABYLON.PhysicsImpostor(
                        floor,
                        BABYLON.PhysicsImpostor.PlaneImpostor,
                        {
                            mass: 0,

                        },
                        this.scene
                    );
                    break
                }case 'Spawner': {
                    const sphere = BABYLON.MeshBuilder.CreateSphere('spawner', {
                        diameter: 0.5,
                    })
                    sphere.position.copyFrom(mesh.position)
                    this.engine.zombieManager.dispatchEvent(new CustomEvent('registerSpawner', {detail: {position: mesh.position.clone()}}))
                    break
                }
                case 'Door': {
                    const scale = 2
                    const position = mesh.position.clone()
                    const door = BABYLON.MeshBuilder.CreateBox('door', {
                        width: mesh.scaling.x * scale,
                        height: mesh.scaling.y * scale,
                        depth: mesh.scaling.z * scale,
                    })
                    const rotation = mesh.rotationQuaternion?.toEulerAngles()?.y ?? 0
                    door.rotation.y = rotation
                    door.position.copyFrom(position)

                    this.obstacles.set(
                        this.navigationPlugin.addBoxObstacle(
                            position,
                            new BABYLON.Vector3(
                                mesh.scaling.x * scale,
                                mesh.scaling.y * scale,
                                mesh.scaling.z * scale
                            ),
                            rotation
                        ),
                        door
                    )
                    break
                }
            }
        }

        this.navmeshdebug = this.navigationPlugin.createDebugNavMesh(this.scene);
        this.matdebug = new BABYLON.StandardMaterial("matdebug", this.scene);
        this.matdebug.diffuseColor = new BABYLON.Color3(0.1, 0.2, 1);
        this.matdebug.alpha = 0.1;
        this.navmeshdebug.material = this.matdebug;

        this.babylonEngine.runRenderLoop(() => {
            this.engine.dispatchEvent(new CustomEvent('beforeRender', {}))
            this.scene.render();
        });


    }



    bind() {
        const debugPointer = document.getElementsByClassName('debug-pointer')[0]
        const debugPointerMesh = BABYLON.MeshBuilder.CreateBox('box', {
            size: .2
        })

        window.addEventListener("resize", () => {
            this.babylonEngine.resize();
        });

        this.engine.addEventListener('beforeRender', e => {
            // var pickinfo = this.scene.pick(
            //     window.innerWidth/2,
            //     window.innerHeight/2,
            //     mesh => {
            //         return mesh !== debugPointerMesh
            //     }
            // );
            // if (pickinfo.hit) {
            //     this.pointerTarget.copyFrom(pickinfo.pickedPoint)
            //     debugPointer.innerText = this.pointerTarget
            //     debugPointerMesh.position.copyFrom(this.pointerTarget)
            // }

            // // Raycast downward to detect the navmesh height
            // let ray = new BABYLON.Ray(this.camera.position, BABYLON.Vector3.Down(), 100);
            // let hit = this.scene.pickWithRay(ray, (mesh) => {
            //     // if (mesh.metadata?.gltf?.extras?.type === 'Floor') {
            //     //     return mesh
            //     // }
            //     if (mesh === this.navmeshdebug) {
            //         return mesh
            //     }
            // });
            //
            // if (hit.hit) {
            //     let groundY = hit.pickedPoint.y;
            //     debugPointer.innerText = this.camera.position
            //     if (this.camera.position.y < groundY + 1.8) {
            //         this.camera.position.y = groundY + 1.8; // Keep camera slightly above ground
            //     }
            // }
        })

        window.addEventListener('keydown', e => {
            if (e.key === 'o') {
                console.log(this.obstacles)

                for (const [obstacle, mesh] of this.obstacles.entries()) {
                    console.log(obstacle)
                    this.engine.world.navigationPlugin.removeObstacle(obstacle)
                    mesh.dispose()
                }
                for (const agent of this.engine.zombieManager.crowd.getAgents()) {
                    console.log(agent)
                    this.engine.zombieManager.crowd.agentGoto(agent, BABYLON.Vector3.Zero())
                }
            }
        })

        this.scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    if(pointerInfo.pickInfo.hit) {
                    }
                    break;
            }
        })
    }
}