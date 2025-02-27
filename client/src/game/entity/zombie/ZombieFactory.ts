import GameEngine from "@/game/GameEngine";
import BasicZombie from "@/game/entity/zombie/BasicZombie";

export default class ZombieFactory {
    constructor() {}

    createZombie(conf = {}) {

        let zombie
        switch (conf?.type) {
            default:
                zombie = new BasicZombie(GameEngine.world.scene)
                break
        }

        if (conf.position) {
            zombie.position.copyFrom(conf.position)
            zombie.hitbox.position.copyFrom(conf.position)
        }

        return zombie
    }

}