import { EReq } from "./request";
import { ERes } from "./response";

export type RequestHandlerCallback = (req: EReq, res: ERes) => Promise<any>;

export class RequestHandler {
  constructor(
    private matchFn: Function,
    private callback: RequestHandlerCallback
  ) {}

  public check(event: EReq): 0 | 404 | string[] {
    return this.matchFn(event);
  }

  public async run(req: EReq, res: ERes): Promise<any> {
    await this.callback(req, res);
  }
}
