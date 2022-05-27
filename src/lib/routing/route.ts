import ERequest from "./request";
import EResponse from "./response";

export type RequestHandlerCallback = (
  req: ERequest,
  res: EResponse
) => Promise<any>;

export class Route {
  constructor(
    private matchFn: Function,
    private callback: RequestHandlerCallback
  ) {}

  public check(event: ERequest): boolean {
    return this.matchFn(event);
  }

  public async run(req: ERequest, res: EResponse): Promise<any> {
    await this.callback(req, res);
  }
}
