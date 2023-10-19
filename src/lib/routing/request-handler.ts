import { EReq } from "./request";
import { ERes } from "./response";

export interface RequestHandlerCallback<
  Req extends EReq = EReq,
  Res extends ERes = ERes,
>{
  (req: Req, res: Res): Promise<any>;
}

export class RequestHandler<
Req extends EReq = EReq,
Res extends ERes = ERes,
> {
  constructor(
    private matchFn: Function,
    private callback: RequestHandlerCallback<Req, Res>
  ) {}

  public check(event: Req): 0 | 404 | string[] {
    return this.matchFn(event);
  }

  public async run(req: Req, res: Res): Promise<any> {
    await this.callback(req, res);
  }
}
