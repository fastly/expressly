import ERequest from "./request";
import EResponse from "./response";

export type ErrorMiddlewareCallback = (
  err: Error,
  req: ERequest,
  res: EResponse
) => Promise<any>;

export class ErrorMiddleware {
  constructor(
    private matchFn: Function,
    private callback: ErrorMiddlewareCallback
  ) {}

  public check(event: ERequest): 0 | 404 | 405 {
    return this.matchFn(event);
  }

  public async run(err: Error, req: ERequest, res: EResponse): Promise<any> {
    await this.callback(err, req, res);
  }
}
