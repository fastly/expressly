import cookie from "cookie";

export default class FPRequest {
  readonly clientInfo: {} = {};
  _headers: Headers;
  readonly method: string;
  url: URL;
  params: { [key: string]: string } = {};
  query: URLSearchParams;
  cookies: Map<string, string> = new Map();

  constructor(private config: any, private event: FetchEvent) {
    this.clientInfo = event.client;
    this._headers = event.request.headers;
    this.method = event.request.method;
    this.url = new URL(event.request.url);
    this.query = this.url.searchParams;

    if (config.parseCookies && this._headers.has("cookie")) {
      for (const [key, value] of Object.entries(cookie.parse(this._headers.get("cookie") || ""))) {
        if (typeof value === "string") {
          this.cookies.set(key, value);
        }
      }
    }
  }

  get headers() {
    if (this.config.parseCookies && this.cookies.size) {
      // Serialize cookies
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
