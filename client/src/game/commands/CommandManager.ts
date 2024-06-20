import type GameEngine from "@/game/GameEngine";

export default class CommandManager {
    public engine: GameEngine;
    public commands: Map<string, Function>

    constructor({engine}) {
        this.engine = engine
        this.commands = new Map<string, Function>()

        this.bind()
    }

    bind() {
        window.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                console.log('type command...')
                // TODO créer un input
                // TODO handle la commande
            }
        })
    }

    parseCommand() {

    }

    registerCommand(name: string, f: Function) {
        this.commands.set(name, f)
    }
}