import ERequest from "./request";
import EResponse from "./response";

export type RequestHandlerCallback = (
  req: ERequest,
  res: EResponse
) => Promise<any>;

export class RequestHandler {
  constructor(
    private matchFn: Function,
    private callback: RequestHandlerCallback
  ) {}

  public check(event: ERequest): 0 | 404 | 405 {
    return this.matchFn(event);
  }

  public async run(req: ERequest, res: EResponse): Promise<any> {
    await this.callback(req, res);
  }
}
