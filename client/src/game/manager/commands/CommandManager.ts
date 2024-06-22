import type GameEngine from "@/game/GameEngine";
import Message from "@/types/ChatEngine/Message";

export default class CommandManager {
    public engine: GameEngine;
    public commands: Map<string, Function>
    public commandHistory: Array<string>
    private chat: any;

    constructor({engine}) {
        this.engine = engine
        this.commands = new Map<string, Function>()
        this.commandHistory = []
        this.chat = this.engine.chatEngineRef

        this.registerCommand('test', () => {
            return 'GRAHAHOUAHAH (test command working)'
        })

        this.bind()
    }

    bind() {
        window.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                if (this.chat.value.inputValue.length > 0) {

                    const message = this.chat.value.inputValue
                    if (this.messageIsCommand(message)) {
                        const command = this.parseCommand(message)
                        this.commandHistory.push(command)
                        if (this.commands.has(command)) {
                            this.chat.value.messages.push(new Message(this.commands.get(command)()))
                        } else {
                            this.chat.value.messages.push(new Message(`command "${command}" not found`))
                        }
                    } else {
                        this.chat.value.messages.push(new Message(message))
                    }
                    this.chat.value.inputValue = ''

                }
            }
        })
    }

    registerCommand(name: string, f: Function) {
        this.commands.set(name, f)
    }

    messageIsCommand(message: string) {
        return message.startsWith('/')
    }

    parseCommand(message: string) {
        return message.substring(1)
    }
}