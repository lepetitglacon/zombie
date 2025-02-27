import GameEngine from "@/game/GameEngine";
import Message from "@/types/ChatEngine/Message";

export default class CommandManager {
    public commands: Map<string, Function>
    public commandHistory: Array<string>
    private chat: any;

    constructor() {
        this.commands = new Map<string, Function>()
        this.commandHistory = []
        this.chat = GameEngine.chatEngineRef

        this.registerCommand('test', (args: Array<string>) => {
            return 'test command working with args: ' + args.join(' | ')
        })

        this.bind()
    }

    bind() {
        window.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                if (this.chat.value.inputValue.length > 0) {

                    const message = this.chat.value.inputValue
                    if (this.messageIsCommand(message)) {
                        const commandObject = this.parseCommand(message)
                        this.commandHistory.push(commandObject.command)
                        if (this.commands.has(commandObject.command)) {
                            this.chat.value.messages.push(new Message(this.commands.get(commandObject.command)(commandObject.args)))
                        } else {
                            this.chat.value.messages.push(new Message(`command "${commandObject.command}" not found`))
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
        const splittedCommand = message.substring(1).trim().split(' ')
        const command = splittedCommand[0]
        splittedCommand.shift()
        return {
            command: command,
            args: splittedCommand
        }
    }
}