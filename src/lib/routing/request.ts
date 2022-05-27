import cookie from "cookie";
import { EConfig } from ".";

export default class ERequest {
  readonly clientInfo: ClientInfo;
  readonly method: string;
  _headers: Headers;
  url: URL;
  params: { [key: string]: string } = {};
  cookies: Map<string, string> = new Map();

  constructor(private config: EConfig, private event: FetchEvent) {
    this.clientInfo = event.client;
    this._headers = event.request.headers;
    this.method = event.request.method;
    this.url = new URL(event.request.url);

    // Parse cookies.
    if (config.parseCookies && this._headers.has("cookie")) {
      for (const [key, value] of Object.entries(cookie.parse(this._headers.get("cookie") || ""))) {
        if (typeof value === "string") {
          this.cookies.set(key, value);
        }
      }
    }
  }

  // Express-like URL helpers.
  get path(): string {
    return this.url.pathname;
  }

  get query(): URLSearchParams {
    return this.url.searchParams;
  }

  get ip(): string {
    return this.clientInfo.address;
  }

  get protocol(): string {
    return this.url.protocol;
  }

  get secure(): boolean {
    return this.url.protocol === "https";
  }

  get subdomains(): Array<string> {
    return this.url.hostname.split(".").slice(0, -2);
  }

  get hostname(): string {
    return this.url.hostname;
  }

  get headers() {
    // Serialize cookies.
    if (this.config.parseCookies && this.cookies.size) {
      const cookieArray = [];
      for (const [key, value] of this.cookies.entries()) {
        cookieArray.push(`${key}=${value}`);
      }
      this._headers.set("cookie", cookieArray.join("; "));
    }
    return this._headers;
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
