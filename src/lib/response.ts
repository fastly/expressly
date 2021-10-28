import cookie from "cookie";

export default class FPResponse {
  private _headers: Headers;
  private _body: string = "";
  status: number = 0;

  constructor() {
    this._headers = new Headers();
  }

  send(body: string) {
    this._body = body;
  }

  // For better express support
  end(body: string) {
    this.send(body);
  }

  writeHead(statusCode: number, headers: {}) {
    this.status = statusCode;

    Object.keys(headers).map((k) => {
      this._headers.set(k, headers[k]);
    });
  }

  get headers() {
    return Object.fromEntries(this._headers.entries())
  }
  
  setHeader(key: string, value: string): void {
    this._headers.set(key, value);
  }

  cookie(key: string, value: string, options:{} = {}): void {
    this.setHeader("Set-Cookie", cookie.serialize(key, value, options))
  }

  get body() {
    return this._body;
  }

  // Set sensible values if things are not set, such as 200 status code if the user doesnt set a status code.
  setDefaults() {
    if (this.status == 0) {
      if (this.body.length == 0) {
        this.status = 404;
        this._body = "Not Found";
      } else {
        this.status = 200;
      }
    }
  }
}
