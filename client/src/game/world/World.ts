import mapGltf from '../../assets/gltf/flora_square.glb?url'

import * as BABYLON from '@babylonjs/core'
import * as CANNON from 'cannon-es'
import { Inspector } from '@babylonjs/inspector'
import { RecastJSPlugin } from "@babylonjs/core/Navigation/Plugins/recastJSPlugin";
import Recast from "recast-detour";
import '@babylonjs/loaders';
import type GameEngine from "@/game/GameEngine";
import {Mesh, Vector3} from "@babylonjs/core";
import {Player} from "@/game/entity/Player";


export default class World {
    private engine: GameEngine;
    public scene: BABYLON.Scene;
    public babylonEngine: BABYLON.Engine;
    public camera: BABYLON.FlyCamera|BABYLON.UniversalCamera;
    public navigationPlugin: RecastJSPlugin;
    public physicsPlugin: BABYLON.CannonJSPlugin
    public pointerTarget = BABYLON.Vector3
    public obstacles: Map<BABYLON.IObstacle, Mesh>;
    public player: Player;

    constructor({engine}) {
        this.engine = engine
        this.babylonEngine = new BABYLON.Engine(this.engine.canvas, true)
        this.babylonEngine.maxFPS = 60
        this.scene = new BABYLON.Scene(this.babylonEngine)
        this.scene.collisionsEnabled = true
        this.scene.gravity.set(0, -10/this.babylonEngine.maxFPS, 0)

        this.loadMap()

        const flyCamera = new BABYLON.FlyCamera(
            "fly-camera",
            new BABYLON.Vector3(0, 10, -10),
            this.scene
        )
        flyCamera.keysForward = [90]
        flyCamera.keysBackward = [83]
        flyCamera.keysUp = [32]
        flyCamera.keysDown = [16]
        flyCamera.keysLeft = [81]
        flyCamera.keysRight = [68]
        flyCamera.rollCorrect = 2
        // // flyCamera.speed = 0.2; // Move speed
        // flyCamera.angularSensibility = 2000; // Mouse sensitivity

        const camera = new BABYLON.UniversalCamera(
            "universal-camera",
            new BABYLON.Vector3(0, 10, -10),
            this.scene
        )
        this.scene.activeCamera = camera
        camera.attachControl(this.engine.canvas, true); // Attach again
        // camera.keysForward = [90]
        // camera.keysBackward = [83]
        camera.keysUp = [90]
        camera.keysDown = [83]
        camera.keysLeft = [81]
        camera.keysRight = [68]
        camera.speed = 2; // Move speed
        camera.inertia = 0.2;
        camera.angularSensibility = 1500; // Mouse sensitivity
        camera.needMoveForGravity = true
        camera.checkCollisions = true;
        camera.applyGravity = true;
        camera.ellipsoid = new BABYLON.Vector3(1.1, 1.8, 1.1);
        camera.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0); // Lift collision point

        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnKeyDownTrigger,
                (evt) => {
                    if (evt.sourceEvent.key === 'c') {
                        this.scene.activeCamera.detachControl()
                        this.scene.activeCamera = this.scene.activeCamera === camera ? flyCamera : camera
                        this.scene.activeCamera.attachControl(this.engine.canvas, true); // Attach again
                    }

                    // console.log("Key pressed:", evt.sourceEvent.key);
                    // const dir = this.engine.cameraManager.camera.getDirection(Vector3.Forward())
                    // console.log(dir)
                    // this.engine.cameraManager.camera.position.addInPlace(dir.scaleInPlace(5))
                }
            )
        );

        // Inspector.Show(this.scene, {})

        // window.CANNON = CANNON;
        // const gravityVector = new BABYLON.Vector3(0,-9.81, 0);
        // this.physicsPlugin = new BABYLON.CannonJSPlugin();
        // this.scene.enablePhysics(gravityVector, this.physicsPlugin)
        //
        this.obstacles = new Map()
        //
        // this.pointerTarget = new BABYLON.Vector3()
        //
        const light = new BABYLON.HemisphericLight(
            "light",
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
        light.intensity = 0.7;
        //
        // this.bind()

        this.babylonEngine.runRenderLoop(() => {
            // this.engine.dispatchEvent(new CustomEvent('beforeRender', {}))

            const otherCam = this.scene.activeCamera === camera ? flyCamera : camera
            otherCam.position.copyFrom(this.scene.activeCamera.position)
            otherCam.rotation.copyFrom(this.scene.activeCamera.rotation)

            this.scene.render();
        });
    }

    async init() {
        // this.player = new Player({engine: this.engine})

    }

    async loadMap() {
        const recast = await Recast();
        this.navigationPlugin = new RecastJSPlugin(recast);
        console.log(this.navigationPlugin)

        const filename = mapGltf.substring(mapGltf.lastIndexOf('/') + 1)
        const path = mapGltf.substring(0, mapGltf.lastIndexOf('/') + 1)
        const scene = await BABYLON.SceneLoader.AppendAsync(path, filename);

        // NAVMESH
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

        this.navmeshdebug = this.navigationPlugin.createDebugNavMesh(this.scene);
        this.matdebug = new BABYLON.StandardMaterial("matdebug", this.scene);
        this.matdebug.diffuseColor = new BABYLON.Color3(0.1, 0.2, 1);
        this.matdebug.alpha = 0.1;
        this.navmeshdebug.material = this.matdebug;

        for (const mesh of scene.meshes) {
            mesh.checkCollisions = true
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
                    floor.checkCollisions = true
                    floor.position.y = 0

                    mesh.dispose()
                    // floor.position.copyFrom(mesh.position)
                    // console.log(mesh.position, floor.position)
                    break
                }
                case 'Spawner': {
                    const sphere = BABYLON.MeshBuilder.CreateSphere('spawner', {
                        diameter: 0.5,
                    })
                    sphere.position.copyFrom(mesh.position)
                    // this.engine.zombieManager.dispatchEvent(new CustomEvent('registerSpawner', {detail: {position: mesh.position.clone()}}))
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
                    door.checkCollisions = true
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
                default: {
                    // mesh.scaling.y +=1
                    break
                }
            }
        }
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