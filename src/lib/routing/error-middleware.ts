import { EReq } from "./request";
import { ERes } from "./response";

export type ErrorMiddlewareCallback = (err: Error, req: EReq, res: ERes) => Promise<any>;

export class ErrorMiddleware {
  constructor(
    private matchFn: Function,
    private callback: ErrorMiddlewareCallback
  ) {}

  public check(event: EReq): 0 | 404 | string[] {
    return this.matchFn(event);
  }

  public async run(err: Error, req: EReq, res: ERes): Promise<any> {
    await this.callback(err, req, res);
  }
}
