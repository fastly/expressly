import { appendFn, setFn } from "../common";
import { CookieMap } from "./cookie-map";
import { EConfig } from "..";

export function wrapERequest (req: Request, event: FetchEvent, config: EConfig) {
  const request: EReq = req as any;
  Object.setPrototypeOf(request, ERequest.prototype);

  request.set = setFn(request);
  request.append = appendFn(request);

  request.params = {};
  (request as any).waitUntil = event.waitUntil.bind(event);
  (request as any).clientInfo = event.client;
  request.urlObj = new URL(request.url);
  request.query = request.urlObj.searchParams;

  Object.defineProperty(request, "url", {
    get() {
      return request.urlObj.toString();
    },
  });

  // Parse cookies.
  if (config.parseCookie) {
    request.cookies = new CookieMap(request.headers);
  }
  return request;
}

export class ERequest extends Request {
  readonly clientInfo: ClientInfo;
  readonly waitUntil: (promise: Promise<any>) => void;
  urlObj: URL;
  query: URLSearchParams;
  params: { [key: string]: string } = {};
  cookies: CookieMap;

  constructor(
    private config: EConfig,
    private readonly event: FetchEvent,
  ) {
    super(event.request);
    wrapERequest(this, event, config);
  }

  set: ReturnType<typeof setFn>;
  append: ReturnType<typeof appendFn>;

  // Express-like URL helpers.
  public get path(): string {
    return this.urlObj.pathname;
  }

  public get ip(): string {
    return this.clientInfo.address;
  }

  public get geo(): any {
    return this.clientInfo.geo;
  }

  public get protocol(): string {
    return this.urlObj.protocol;
  }

  public get secure(): boolean {
    return this.urlObj.protocol === "https";
  }

  get subdomains(): Array<string> {
    return this.urlObj.hostname.split(".").slice(0, -2);
  }

  get hostname(): string {
    return this.urlObj.hostname;
  }
}

export interface EReq extends ERequest {}
