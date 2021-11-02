import cookie from "cookie";

export default class FPResponse {
  _headers: Headers = new Headers();
  private _body: string = "";
  status: number = 0;
  _cookies: Map<string, string> = new Map();

  send(body: string) {
    this._body = body;
  }

  // For better express support
  end(body: string) {
    this.send(body);
  }

  json(data: any) {
    this.setHeader("Content-Type", "application/json");
    this.send(JSON.stringify(data))
  }

  writeHead(statusCode: number, headers: {}) {
    this.status = statusCode;

    Object.keys(headers).map((k) => {
      this.setHeader(k, headers[k]);
    });
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

  cookie(key: string, value: string, options:{} = {}): void {
    this._cookies.set(key, cookie.serialize(key, value, options))
  }

  get body() {
    return this._body;
  }

  redirect(url: string) {
    this.writeHead(301, {
      Location: url
    });
    this.send(`Redirecting you to: ${url}`)
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
