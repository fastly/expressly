import FPRequest from "./request";
import FPResponse from "./response";

export default class Route {
    constructor(private matchFn: Function, private callback: Function){}

    public check(event: FPRequest): boolean {
        return this.matchFn(event);
    }

    public async run(req: FPRequest, res: FPResponse): Promise<any> {
        await this.callback(req, res);
    }
}