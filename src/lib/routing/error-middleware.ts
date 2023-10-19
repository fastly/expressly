import { EReq } from "./request";
import { ERes } from "./response";
import { EErr } from "./errors";

export type ErrorMiddlewareCallback<
  Err extends EErr = EErr,
  Req extends EReq = EReq,
  Res extends ERes = ERes,
> = (err: Err, req: Req, res: Res) => Promise<any> | void;

export class ErrorMiddleware<
  Err extends EErr = EErr,
  Req extends EReq = EReq,
  Res extends ERes = ERes,
>  {
  constructor(
    private matchFn: Function,
    private callback: ErrorMiddlewareCallback<Err, Req, Res>,
  ) { }

  public check(event: Req): 0 | 404 | string[] {
    return this.matchFn(event);
  }

  public async run(err: Err, req: Req, res: Res): Promise<any> {
    await this.callback(err, req, res);
  }
}
