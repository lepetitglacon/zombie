import type GameEngine from "@/game/GameEngine";
import {type Ref, ref, type UnwrapRef} from "vue";
import type AbstractZombie from "@/game/entity/zombie/AbstractZombie";
import ZombieFactory from "@/game/entity/zombie/ZombieFactory";
import * as BABYLON from '@babylonjs/core'

export default class ZombieManager extends EventTarget {
    private engine: GameEngine;

    private currentWave: Ref<UnwrapRef<number>>;
    private spawnRate: number;
    private lastSpawn: number;

    private zombies: Map<string, AbstractZombie>;
    private zombieFactory: ZombieFactory;
    public crowd: any;

    constructor({engine}) {
        super();
        this.engine = engine

        this.zombieFactory = new ZombieFactory({engine: engine})

        this.currentWave = ref(0)
        this.spawnRate = 500
        this.lastSpawn = new Date().getTime()

        this.zombies = new Map<string, AbstractZombie>()

        this.engine.commandManager.registerCommand('spawn:zombie', (args: any) => {
            const zombie = this.spawn(args)
            console.log('zombie created', zombie)
            return 'zombie created'
        })

        this.bind()
    }

    bind() {
        this.addEventListener('spawn:zombie', (args: any) => {
            this.spawn(args)
        })
    }

    init() {
        this.crowd = this.engine.world.navigationPlugin.createCrowd(32, .5, this.engine.world.scene);
    }

    update() {

    }

    spawn(args: any) {
        const zombie = this.zombieFactory.createZombie({
            type: 'basic',
            position: new BABYLON.Vector3()
        })
        zombie.agentId = this.crowd.addAgent(zombie.position, zombie.agentParameters, this.engine.world.scene)
        this.crowd.agentGoto(zombie.agentId, this.engine.world.navigationPlugin.getClosestPoint(new BABYLON.Vector3(2, 0, 2)));
        return zombie
    }
}