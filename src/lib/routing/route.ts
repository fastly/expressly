import FPRequest from "./request";
import FPResponse from "./response";

export type RequestHandlerCallback = (
  req: FPRequest,
  res: FPResponse
) => Promise<any>;

export class Route {
  constructor(
    private matchFn: Function,
    private callback: RequestHandlerCallback
  ) {}

  public check(event: FPRequest): boolean {
    return this.matchFn(event);
  }

  public async run(req: FPRequest, res: FPResponse): Promise<any> {
    await this.callback(req, res);
  }
}
