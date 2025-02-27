import GameEngine from "@/game/GameEngine";
import {type Ref, ref, type UnwrapRef} from "vue";
import type AbstractZombie from "@/game/entity/zombie/AbstractZombie";
import ZombieFactory from "@/game/entity/zombie/ZombieFactory";
import * as BABYLON from '@babylonjs/core'
import { randomNumber } from '../../utils/random.js'

export default class ZombieManager {

    private currentWave: Ref<UnwrapRef<number>>;


    public spawners: Array<BABYLON.Vector3>;
    private spawnRate: number;
    private lastSpawn: number;

    public zombies: Map<string, AbstractZombie>;
    public maxZombies: number;
    private zombieFactory: ZombieFactory;
    public crowd: BABYLON.ICrowd;

    constructor() {
        this.zombieFactory = new ZombieFactory()

        this.currentWave = ref(0)
        this.spawners = []
        this.spawnRate = 500
        this.lastSpawn = new Date().getTime()

        this.maxZombies = 8
        this.zombies = new Map<string, AbstractZombie>()

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
        GameEngine.world.onWorldMeshAdd.add((e) => {
            if (e.type === 'Spawner') {
                const pos = e.mesh.position
                // pos.y = 0
                const sphere = BABYLON.MeshBuilder.CreateSphere('spawner', {
                    diameter: 0.5,
                })
                sphere.position.copyFrom(pos)
                this.spawners.push(pos)
            }
        })
        // this.addEventListener('spawn:zombie', (args: any) => {
        //     this.spawn(args)
        // })
        GameEngine.world.scene.onBeforeRenderObservable.add((e) => {
            const now = new Date().getTime()
            if (this.shouldSpawnZombie(now)) {
                this.spawn({}, now)
            }
        })
    }

    init() {
        this.crowd = GameEngine.world.navigationPlugin.createCrowd(this.maxZombies, .5, GameEngine.world.scene);
    }

    shouldSpawnZombie(now: number) {
        return this.lastSpawn + this.spawnRate < now
            && this.crowd.getAgents().length < this.maxZombies
            && this.zombies.size < 8
    }

    spawn(args: any, now: number = new Date().getTime()): AbstractZombie {
        const position = args?.position ?? this.spawners[randomNumber(0, this.spawners.length-1)].clone() ?? new BABYLON.Vector3()
        position.y -= .5
        const zombie = this.zombieFactory.createZombie({
            type: 'basic',
            // position
        })

        this.zombies.set(now.toString(), zombie)

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