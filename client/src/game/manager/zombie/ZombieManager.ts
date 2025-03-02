import GameEngine from "@/game/GameEngine";
import {type Ref, ref, type UnwrapRef} from "vue";
import type AbstractZombie from "@/game/entity/zombie/AbstractZombie";
import ZombieFactory from "@/game/entity/zombie/ZombieFactory";
import * as BABYLON from '@babylonjs/core'
import { randomNumber } from '../../utils/random.js'
import WaveHandler from "@/game/manager/zombie/WaveHandler";
import {Vector3} from "@babylonjs/core";

export default class ZombieManager {

    waveHandler: WaveHandler


    public spawners: Ref<Array<BABYLON.Vector3>>
    private spawnRate: number
    private lastSpawn: number

    public zombies: Map<number, AbstractZombie>
    public crowd: BABYLON.ICrowd;
    public maxZombiesAlive: number
    private zombieFactory: ZombieFactory

    constructor() {
        this.zombieFactory = new ZombieFactory()

        this.spawners = ref([])
        this.zombies = new Map<number, AbstractZombie>()

        this.waveHandler = new WaveHandler()
        this.spawnRate = 1500
        this.lastSpawn = new Date().getTime()
        this.maxZombiesAlive = 24

        GameEngine.commandManager.registerCommand('spawn:zombie', (args: any) => {
            if (GameEngine.world.pointerTarget) {
                args.position = GameEngine.world.pointerTarget.clone()
            }
            this.spawn(args)
            return 'zombie created'
        })

        this.bind()
    }

    bind() {
        GameEngine.world.scene.onBeforeRenderObservable.add((e) => {
            this.waveHandler.update()

            for (const agentId of this.crowd.getAgents()) {
                let velocity = this.crowd.getAgentVelocity(agentId);
                if (velocity.length() > 0.2) {
                    const desiredRotation = Math.atan2(velocity.x, velocity.z);
                    // interpolate the rotation on Y to get a smoother orientation change
                    if (this.zombies.has(agentId)) {
                        const zombie = this.zombies.get(agentId)
                        // zombie.hitbox.rotation.y = zombie.hitbox.rotation.y + (desiredRotation - zombie.hitbox.rotation.y) * 0.05;
                        if (zombie.gltf) {
                            for (const node of zombie.gltf.rootNodes) {
                                for (const mesh of node.getChildMeshes()) {
                                    mesh.rotation.z =  mesh.rotation.z + (desiredRotation - mesh.rotation.z) * 0.05
                                }
                            }
                        }
                    }
                }

            }
        })
        GameEngine.eventManager.onWorldMeshAdd.add((e) => {
            if (e.type === 'Spawner') {
                const pos = e.mesh.position
                // pos.y = 0
                const sphere = BABYLON.MeshBuilder.CreateSphere('spawner', {
                    diameter: 0.5,
                }, GameEngine.world.scene)
                sphere.position.copyFrom(pos)
                this.spawners.value.push(pos)
                console.log('registered spawner', pos)
            }
        })
        GameEngine.eventManager.onGunShot.add((e) => {
            for (const pickInfo of e.pickInfos) {
                if (pickInfo.pickedMesh.isZombie) {
                    const zombie = pickInfo.pickedMesh.zombie
                    zombie.hp -= e.baseGunDamage
                    GameEngine.points += 10

                    if (zombie.hp <= 0) {
                        GameEngine.eventManager.onZombieKillCall.notifyObservers({})
                        this.zombies.delete(zombie.agentId)
                        this.crowd.removeAgent(zombie.agentId)
                        zombie.kill()
                    }

                }
            }
        })
        GameEngine.eventManager.onZombieSpawnCall.add(e => {
            this.spawn()
        })
    }

    init() {
        this.crowd = GameEngine.world.navigationPlugin.createCrowd(this.maxZombiesAlive, .5, GameEngine.world.scene);
    }

    spawn(args: any = {}, now: number = new Date().getTime()): AbstractZombie {
        const position = args?.position ?? this.spawners.value[randomNumber(0, this.spawners.value.length - 1)].clone() ?? new BABYLON.Vector3()
        position.y -= .5
        const zombie = ZombieFactory.createZombie({
            type: 'basic',
            // position
        })
        zombie.agentId = this.crowd.addAgent(position, zombie.agentParameters, zombie.transform)
        this.zombies.set(zombie.agentId, zombie)

        zombie.pathPoints = GameEngine.world.navigationPlugin.computePath(
            zombie.transform.position,
            GameEngine.world.navigationPlugin.getClosestPoint(
                GameEngine.cameraManager.camera.position
            )
        );
        if (zombie.pathLine) { zombie.pathLine.dispose() }
        zombie.pathLine = BABYLON.MeshBuilder.CreateDashedLines("ribbon", {points: zombie.pathPoints, updatable: true}, GameEngine.world.scene);

        let cameraPosOnNavMesh: Vector3
        GameEngine.world.scene.onBeforeRenderObservable.add(() => {
            const pos = GameEngine.cameraManager.camera.position.clone()
            pos.y -= 1.8
            cameraPosOnNavMesh = GameEngine.world.navigationPlugin.getClosestPoint(pos)
            if (cameraPosOnNavMesh.equalsWithEpsilon(Vector3.Zero(), 0.1)) {
                //console.log('joueur pas trouvé sur la navmesh')
                return
            }
            this.crowd.agentGoto(zombie.agentId, cameraPosOnNavMesh);
            zombie.pathPoints = GameEngine.world.navigationPlugin.computePath(
                zombie.transform.position,
                cameraPosOnNavMesh
            );
            if (zombie.pathLine) { zombie.pathLine.dispose() }
            zombie.pathLine = BABYLON.MeshBuilder.CreateDashedLines("ribbon", {points: zombie.pathPoints, updatable: true}, GameEngine.world.scene);
        });

        console.log('spawned zombie', zombie.agentId, 'at position', position)
        this.lastSpawn = now
        return zombie
    }
}