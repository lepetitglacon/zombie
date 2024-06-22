import BasicZombie from "@/game/entity/zombie/BasicZombie";

export default class ZombieFactory {
    private engine: any;

    constructor({engine}) {
        this.engine = engine
    }

    createZombie(conf = {}) {
        const zombie = new BasicZombie()

        if (conf.position) {
            zombie.position.copyFrom(conf.position)
        }

        return zombie
    }

}