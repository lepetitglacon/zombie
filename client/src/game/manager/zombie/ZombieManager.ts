import type GameEngine from "@/game/GameEngine";
import {type Ref, ref, type UnwrapRef} from "vue";
import type AbstractZombie from "@/game/entity/zombie/AbstractZombie";
import ZombieFactory from "@/game/entity/zombie/ZombieFactory";
import * as BABYLON from '@babylonjs/core'
import { randomNumber } from '../../utils/random.js'

export default class ZombieManager extends EventTarget {
    private engine: GameEngine;

    private currentWave: Ref<UnwrapRef<number>>;


    public spawners: Array<BABYLON.Vector3>;
    private spawnRate: number;
    private lastSpawn: number;

    public zombies: Map<string, AbstractZombie>;
    public maxZombies: number;
    private zombieFactory: ZombieFactory;
    public crowd: any;

    constructor({engine}) {
        super();
        this.engine = engine

        this.zombieFactory = new ZombieFactory({engine: engine})

        this.currentWave = ref(0)
        this.spawners = []
        this.spawnRate = 500
        this.lastSpawn = new Date().getTime()

        this.maxZombies = 8
        this.zombies = new Map<string, AbstractZombie>()

        this.engine.commandManager.registerCommand('spawn:zombie', (args: any) => {

            if (this.engine.world.pointerTarget) {
                args.position = this.engine.world.pointerTarget.clone()
            }
            const zombie = this.spawn(args)
            console.log('zombie created', zombie)
            return 'zombie created'
        })

        this.bind()
    }

    bind() {
        this.addEventListener('registerSpawner', (e) => {
            const pos = e.detail.position
            // pos.y = 0
            const sphere = BABYLON.MeshBuilder.CreateSphere('spawner', {
                diameter: 0.5,
            })
            sphere.position.copyFrom(pos)
            this.spawners.push(pos)
        })
        this.addEventListener('spawn:zombie', (args: any) => {
            this.spawn(args)
        })
        this.engine.addEventListener('beforeRender', (e) => {



            const now = new Date().getTime()
            if (this.shouldSpawnZombie(now)) {
                this.spawn({}, now)
            }
        })
    }

    init() {
        this.crowd = this.engine.world.navigationPlugin.createCrowd(this.maxZombies, .5, this.engine.world.scene);
    }

    shouldSpawnZombie(now: number) {
        return this.lastSpawn + this.spawnRate < now
            && this.crowd.getAgents().length < this.maxZombies
    }

    spawn(args: any, now: number = new Date().getTime()): AbstractZombie {
        const zombie = this.zombieFactory.createZombie({
            type: 'basic',
        })
        const position = args?.position ?? this.spawners[randomNumber(0, this.spawners.length-1)].clone() ?? new BABYLON.Vector3()
        position.y -= .5
        zombie.agentId = this.crowd.addAgent(position, zombie.agentParameters, zombie.transform)
        // this.crowd.agentTeleport(zombie.agentId, this.engine.world.navigationPlugin.getClosestPoint(zombie.position))
        this.crowd.agentGoto(zombie.agentId, this.engine.world.navigationPlugin.getClosestPoint(new BABYLON.Vector3(0, 0, 0)));
        console.log('spawned zombie', zombie.agentId, 'at position', position)

        let pathPoints = this.engine.world.navigationPlugin.computePath(position, this.engine.world.navigationPlugin.getClosestPoint(this.engine.world.navigationPlugin.getClosestPoint(new BABYLON.Vector3(0, 0, 0))));
        const pathLine = BABYLON.MeshBuilder.CreateDashedLines("ribbon", {points: pathPoints, updatable: true}, this.engine.world.scene);

        this.lastSpawn = now
        return zombie
    }
}