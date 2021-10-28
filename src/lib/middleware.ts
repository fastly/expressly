import FPRequest from "./request";
import FPResponse from "./response";

export default class Middleware {
    constructor(private callback: Function){}

    public async run(req: FPRequest, res: FPResponse): Promise<any> {
        // Supply an empty callback which would normally be next() in express
        await this.callback(req, res, ()=>{});
    }
}