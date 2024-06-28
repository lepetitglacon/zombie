import BasicZombie from "@/game/entity/zombie/BasicZombie";

export default class ZombieFactory {
    private engine: any;

    constructor({engine}) {
        this.engine = engine
    }

    createZombie(conf = {}) {

        let zombie
        switch (conf?.type) {
            default:
                zombie = new BasicZombie(this.engine.world.scene)
                break
        }

        if (conf.position) {
            zombie.position.copyFrom(conf.position)
        }

        return zombie
    }

}