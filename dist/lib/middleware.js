export default class Middleware {
    constructor(callback) {
        this.callback = callback;
    }
    async run(req, res) {
        // Supply an empty callback which would normally be next() in express
        await this.callback(req, res, () => { });
    }
}
