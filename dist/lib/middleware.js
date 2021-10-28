export default class Middleware {
    constructor(callback) {
        this.callback = callback;
    }
    async run(req, res) {
        await this.callback(req, res);
    }
}
