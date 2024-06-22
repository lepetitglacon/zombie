import type GameEngine from "@/game/GameEngine";
import {type Ref, ref, type UnwrapRef} from "vue";
import type AbstractZombie from "@/game/entity/zombie/AbstractZombie";
import ZombieFactory from "@/game/entity/zombie/ZombieFactory";
import * as BABYLON from '@babylonjs/core'

export default class ZombieManager {
    private engine: GameEngine;
    private currentWave: Ref<UnwrapRef<number>>;
    private zombies: Map<string, AbstractZombie>;
    private zombieFactory: ZombieFactory;

    constructor({engine}) {
        this.engine = engine

        this.zombieFactory = new ZombieFactory({engine: engine})

        this.currentWave = ref(0)
        this.zombies = new Map<string, AbstractZombie>()

        this.engine.commandManager.registerCommand('spawn zombie', () => {
            this.zombieFactory.createZombie({
                position: new BABYLON.Vector3()
            })
            return 'zombie created'
        })

    }



}