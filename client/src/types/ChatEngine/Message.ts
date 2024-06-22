export default class Message {
    public timestamp: Date
    public user: string
    public message: string

    constructor(message: string) {
        this.timestamp = new Date()
        this.user = 'offline user'
        this.message = message
    }
}