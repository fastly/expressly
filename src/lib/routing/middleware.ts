import ERequest from "./request";
import EResponse from "./response";

export type MiddlewareCallback = (
  req: ERequest,
  res: EResponse,
  next?: () => void
) => Promise<any>;

export class Middleware {
  constructor(
    private matchFn: Function,
    private callback: MiddlewareCallback
  ) {}

  public check(event: ERequest): boolean {
    return this.matchFn(event);
  }

  public async run(req: ERequest, res: EResponse): Promise<any> {
    // Supply an empty callback which would normally be next() in express
    await this.callback(req, res, () => {});
  }
}
