import type GameEngine from "@/game/GameEngine";

export default class Ground {
    private engine: GameEngine;

    constructor({engine}) {
        this.engine = engine
    }

}