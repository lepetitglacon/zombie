import GameEngine from "@/game/GameEngine";
import {type Ref, ref, type UnwrapRef} from "vue";
import type AbstractZombie from "@/game/entity/zombie/AbstractZombie";
import ZombieFactory from "@/game/entity/zombie/ZombieFactory";
import * as BABYLON from '@babylonjs/core'
import { randomNumber } from '../../utils/random.js'

export default class ZombieManager {

    currentWave: Ref<UnwrapRef<number>>


    public spawners: Ref<Array<BABYLON.Vector3>>
    private spawnRate: number
    private lastSpawn: number

    public zombies: Ref<Map<string, AbstractZombie>>
    public maxZombies: number
    private zombieFactory: ZombieFactory
    public crowd: BABYLON.ICrowd;

    constructor() {
        this.zombieFactory = new ZombieFactory()

        this.currentWave = ref(0)
        this.spawners = ref([])
        this.spawnRate = 500
        this.lastSpawn = new Date().getTime()

        this.maxZombies = 8
        this.zombies = ref(new Map<string, AbstractZombie>())

        GameEngine.commandManager.registerCommand('spawn:zombie', (args: any) => {
            if (GameEngine.world.pointerTarget) {
                args.position = GameEngine.world.pointerTarget.clone()
            }
            const zombie = this.spawn(args)
            console.log('zombie created', zombie)
            return 'zombie created'
        })

        this.bind()
    }

    bind() {
        GameEngine.eventManager.onWorldMeshAdd.add((e) => {
            if (e.type === 'Spawner') {
                const pos = e.mesh.position
                // pos.y = 0
                const sphere = BABYLON.MeshBuilder.CreateSphere('spawner', {
                    diameter: 0.5,
                }, GameEngine.world.scene)
                sphere.position.copyFrom(pos)
                this.spawners.value.push(pos)
                console.log('registered spawner')
            }
        })
        GameEngine.world.scene.onBeforeRenderObservable.add((e) => {
            const now = new Date().getTime()
            if (this.shouldSpawnZombie(now)) {
                this.spawn({}, now)
            }
        })
        GameEngine.eventManager.onGunShot.add((e) => {
            for (const pickInfo of e.pickInfos) {
                if (pickInfo.pickedMesh.isZombie) {
                    console.log('zombie hit', pickInfo.pickedMesh.zombie)
                    const zombie = pickInfo.pickedMesh.zombie
                    zombie.hp -= e.baseGunDamage

                    if (zombie.hp <= 0) {
                        this.crowd.removeAgent(zombie.agentId)
                        this.zombies.value.delete(zombie.agentId)
                        zombie.kill()
                    }
                }
            }
        })
    }

    init() {
        this.crowd = GameEngine.world.navigationPlugin.createCrowd(this.maxZombies, .5, GameEngine.world.scene);
    }

    shouldSpawnZombie(now: number) {
        return this.lastSpawn + this.spawnRate < now
            && this.crowd.getAgents().length < this.maxZombies
            && this.zombies.value.size < 8
            && this.spawners.value.length > 0
    }

    spawn(args: any, now: number = new Date().getTime()): AbstractZombie {
        const position = args?.position ?? this.spawners.value[randomNumber(0, this.spawners.value.length - 1)].clone() ?? new BABYLON.Vector3()
        position.y -= .5
        const zombie = this.zombieFactory.createZombie({
            type: 'basic',
            // position
        })

        this.zombies.value.set(now.toString(), zombie)

        zombie.agentId = this.crowd.addAgent(position, zombie.agentParameters, zombie.transform)
        this.crowd.agentGoto(zombie.agentId, GameEngine.world.navigationPlugin.getClosestPoint(new BABYLON.Vector3(0, 0, 0)));

        zombie.pathPoints = GameEngine.world.navigationPlugin.computePath(zombie.transform.position, GameEngine.world.navigationPlugin.getClosestPoint(GameEngine.world.navigationPlugin.getClosestPoint(new BABYLON.Vector3(0, 0, 0))));
        if (zombie.pathLine) { zombie.pathLine.dispose() }
        zombie.pathLine = BABYLON.MeshBuilder.CreateDashedLines("ribbon", {points: zombie.pathPoints, updatable: true}, GameEngine.world.scene);

        GameEngine.world.scene.onBeforeRenderObservable.add(() => {
            // zombie.pathPoints = GameEngine.world.navigationPlugin.computePath(zombie.transform.position, GameEngine.world.navigationPlugin.getClosestPoint(GameEngine.world.navigationPlugin.getClosestPoint(new BABYLON.Vector3(0, 0, 0))));
            // if (zombie.pathLine) { zombie.pathLine.dispose() }
            // zombie.pathLine = BABYLON.MeshBuilder.CreateDashedLines("ribbon", {points: zombie.pathPoints, updatable: true}, GameEngine.world.scene);
        });

        console.log('spawned zombie', zombie.agentId, 'at position', position)
        this.lastSpawn = now
        return zombie
    }
}