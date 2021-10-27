import FPRequest from "./request";
import FPResponse from "./response";

export default class Middleware {
    constructor(private callback: Function){}

    public async run(req: FPRequest, res: FPResponse): Promise<any> {
        await this.callback(req, res);
    }
}