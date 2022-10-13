import { addCommonMethods } from "../common";
import { CookieMap } from "./cookie-map";
import { EConfig } from "..";

class ERequestBase extends Request {
  readonly clientInfo: ClientInfo;
  urlObj: URL;
  query: URLSearchParams;
  params: { [key: string]: string } = {};
  cookies: CookieMap;

  constructor(private config: EConfig, private readonly event: FetchEvent) {
    super(event.request);
    this.clientInfo = this.event.client;
    this.urlObj = new URL(this.url);
    this.query = this.urlObj.searchParams;
    
    Object.defineProperty(this, 'url', {
      get() {
        return this.urlObj.toString();
      }
    });

    // Parse cookies.
    if (this.config.parseCookie) {
      this.cookies = new CookieMap(this.headers);
    }
  }

  // Express-like URL helpers.
  public get path(): string {
    return this.urlObj.pathname;
  }

  public get ip(): string {
    return this.clientInfo.address;
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

export const ERequest = addCommonMethods(ERequestBase);
export type EReq = InstanceType<typeof ERequest>;
