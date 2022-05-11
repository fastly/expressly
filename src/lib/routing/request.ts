import cookie from "cookie";

export default class FPRequest {
  readonly clientInfo: {} = {};
  private _headers: Headers;
  readonly method: string;
  url: URL;
  params: { [key: string]: string } = {};
  query: { [key: string]: string };
  private _cookies: {} = {};
  cookies: any = {};

  constructor(private config: any, private event: FetchEvent) {
    this.clientInfo = event.client;
    this._headers = event.request.headers;
    this.method = event.request.method;
    this.url = new URL(event.request.url);
    this.query = Object.fromEntries(this.url.searchParams.entries());

    if(config.parseCookies && this._headers.has("cookie")){
      this._cookies = cookie.parse(this._headers.get("cookie"));
    }

    // If a cookie is set on the Request object, we need to re-serialize the `cookie` header
    // in case the request is forwarded to an origin
    this.cookies = new Proxy(this._cookies, {
      get: (target, key) => {
        return target[key];
      },
      set: (target, key, value) => {
        target[key] = value;
        this.reSerializeCookies();
        return true;
      }
    });
  }

  private reSerializeCookies() {
    console.log("reSerializeCookies")
    this._headers.set("cookie", Object.entries(this._cookies).map(([key, value]) => `${key}=${value}`).join("; "));
  }

  get headers() {
    return Object.fromEntries(this._headers.entries())
  }

  setHeader(key: string, value: string): void {
    this._headers.set(key, value);
  }

  appendHeader(key: string, value: string): void {
    this._headers.append(key, value);
  }

  removeHeader(key: string): void {
    this._headers.delete(key);
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
