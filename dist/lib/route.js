export default class Route {
    constructor(matchFn, callback) {
        this.matchFn = matchFn;
        this.callback = callback;
    }
    check(event) {
        return this.matchFn(event);
    }
    async run(req, res) {
        await this.callback(req, res);
    }
}
