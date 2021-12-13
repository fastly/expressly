import FPRequest from "./request";
import FPResponse from "./response";

export type MiddlewareCallback = (
  req: FPRequest,
  res: FPResponse,
  next?: () => void
) => Promise<any>;

export class Middleware {
  constructor(
    private matchFn: Function,
    private callback: MiddlewareCallback
  ) {}

  public check(event: FPRequest): boolean {
    return this.matchFn(event);
  }

  public async run(req: FPRequest, res: FPResponse): Promise<any> {
    // Supply an empty callback which would normally be next() in express
    await this.callback(req, res, () => {});
  }
}
