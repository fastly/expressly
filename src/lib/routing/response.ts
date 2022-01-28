import cookie from "cookie";
import Mustache from "mustache";

export default class FPResponse {
  _headers: Headers = new Headers();
  private _body: BodyInit = null;
  status: number = 0;
  _cookies: Map<string, string> = new Map();
  private _hasEnded: boolean = false;

  constructor(private config: any) {}

  send(response: BodyInit | Response) {
    if (this.hasEnded) return;

    if (response instanceof Response) {
      this._body = response.body;
      this.useHeaders(response.headers);
      this.status = response.status;
    } else {
      this._body = response;
    }
  }

  // For better express support
  end(body: BodyInit) {
    if (this.hasEnded) return;

    this.send(body);
    this._hasEnded = true;
  }

  json(data: any) {
    if (this.hasEnded) return;

    this.setHeader("Content-Type", "application/json");
    this.send(JSON.stringify(data));
  }

  writeHead(statusCode: number, headers: {}) {
    if (this.hasEnded) return;

    this.status = statusCode;

    Object.keys(headers).map((k) => {
      this.setHeader(k, headers[k]);
    });
  }

  get headers() {
    return Object.fromEntries(this._headers.entries());
  }

  setHeader(key: string, value: string): void {
    if (this.hasEnded) return;

    this._headers.set(key, value);
  }

  useHeaders(headers: Headers) {
    if (this.hasEnded) return;

    headers.forEach((value, key) => {
      this.setHeader(key, value);
    });
  }

  appendHeader(key: string, value: string): void {
    if (this.hasEnded) return;

    this._headers.append(key, value);
  }

  cookie(key: string, value: string, options: {} = {}): void {
    if (this.hasEnded) return;

    this._cookies.set(key, cookie.serialize(key, value, options));
  }

  get body() {
    return this._body;
  }

  get hasEnded() {
    return this._hasEnded;
  }

  redirect(url: string) {
    if (this.hasEnded) return;

    this.writeHead(301, {
      Location: url,
    });

    this.end(`Redirecting you to: ${url}`);
  }

  render(templateName, view) {
    const template = require(`/src/${this.config.templatesDir}/${templateName}.html`);
    this.send(Mustache.render(template, view));
  }

  // Set sensible values if things are not set, such as 200 status code if the user doesnt set a status code.
  setDefaults() {
    if (this.status == 0) {
      if (this.body == null) {
        this.status = 404;
        this._body = "Not Found";
      } else {
        this.status = 200;
      }
    }
  }
}
