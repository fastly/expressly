import { ECommonObject } from "../common";
import { CookieMap } from "./cookie-map";
import { EConfig } from "..";

export class ERequest extends ECommonObject {
  readonly clientInfo: ClientInfo;
  readonly method: string;
  headers: Headers;
  urlObj: URL;
  query: URLSearchParams;
  params: { [key: string]: string } = {};
  cookies: CookieMap;

  constructor(private config: EConfig, private event: FetchEvent) {
    super();
    this.clientInfo = event.client;
    this.method = event.request.method;
    this.urlObj = new URL(event.request.url);
    this.query = this.urlObj.searchParams;
    this.headers = event.request.headers;

    // Parse cookies.
    if (this.config.parseCookie) {
      this.cookies = new CookieMap(this.headers);
    }
  }

  // Express-like URL helpers.
  get url(): string {
    return this.urlObj.toString();
  }

  get path(): string {
    return this.urlObj.pathname;
  }

  get ip(): string {
    return this.clientInfo.address;
  }

  get protocol(): string {
    return this.urlObj.protocol;
  }

  get secure(): boolean {
    return this.urlObj.protocol === "https";
  }

  get subdomains(): Array<string> {
    return this.urlObj.hostname.split(".").slice(0, -2);
  }

  get hostname(): string {
    return this.urlObj.hostname;
  }

  async json() {
    return await this.event.request.json();
  }

  async text() {
    return await this.event.request.text();
  }

  async arrayBuffer() {
    return await this.event.request.arrayBuffer();
  }
}
