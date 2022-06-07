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
    // Supply an empty callback as an equivalent of next() in Express.js.
    await this.callback(req, res, () => {});
  }
}
