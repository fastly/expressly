import cookie from "cookie";
import { addCommonMethods } from "../common";
import { statusText } from "./status-codes";
import { SurrogateKeys } from "./surrogate-keys";
import { CookieOptions, EConfig } from "..";

// TODO: extends Response
// See: https://github.com/fastly/js-compute-runtime/issues/113
class EResponseBase {
  headers: Headers = new Headers();
  status: number = 0;
  body: BodyInit = null;
  hasEnded: boolean = false;
  surrogateKeys: SurrogateKeys = new SurrogateKeys(this.headers);

  constructor(private config: EConfig) {
    // super();
  }

  // Header helpers.
  vary(field: string) {
    this.headers.append("Vary", field);
  }

  // Cookie helpers.
  cookie(key: string, value: string, options: CookieOptions = {}): void {
    if (this.hasEnded) return;

    this.headers.append("Set-Cookie", cookie.serialize(key, value, options));
  }

  clearCookie(key: string, options: CookieOptions = {}): void {
    if (this.hasEnded) return;

    this.headers.append("Set-Cookie", cookie.serialize(key, "", { ...options, expires: "Thu, 01 Jan 1970 00:00:00 GMT" }));
  }

  // Response lifecycle methods.
  send(response: BodyInit | Response) {
    if (this.hasEnded) return;

    if (response instanceof Response) {
      this.body = response.body;
      this.headers = response.headers;
      this.status = response.status;
    } else {
      this.body = response;
    }

    // EXPERIMENTAL: Content type inference, à la Express.js.
    if (this.config.autoContentType && !this.headers.has("Content-Type") && Boolean(this.body)) {
      if (typeof this.body === "string") {
        this.headers.set("Content-Type", "text/html");
      } else if (this.body instanceof ArrayBuffer) {
        this.headers.set("Content-Type", "application/octet-stream");
      } else {
        this.headers.set("Content-Type", "application/json");
      }
    }

    this.hasEnded = true;
  }

  // End the response process [without any data], à la Express.js.
  // https://stackoverflow.com/questions/29555290/what-is-the-difference-between-res-end-and-res-send
  end(body?: string) {
    if (this.hasEnded) return;

    this.send(body);
  }

  // Send a HTTP status code response and end the response process.
  sendStatus(status: number) {
    if (this.hasEnded) return;

    this.status = status;
    this.end(statusText[status] || null);
  }

  // Perform a redirect (default: 302 Found).
  redirect(url: string, status: 301 | 302 | 307 | 308 = 302) {
    if (this.hasEnded) return;

    this.headers.set("Location", url);
    this.sendStatus(status);
  }

  // Chainable response status setter.
  withStatus(status: number) {
    this.status = status;
    return this;
  }

  // Response body helpers.
  json(data: any) {
    if (this.hasEnded) return;

    this.headers.set("Content-Type", "application/json");
    this.send(JSON.stringify(data));
  }

  text(data: string) {
    if (this.hasEnded) return;

    this.headers.set("Content-Type", "text/plain");
    this.send(data);
  }

  html(data: string, charset?: string) {
    if (this.hasEnded) return;

    this.headers.set("Content-Type", `text/html${charset ? `; charset=${charset}` : ""}`);
    this.send(data);
  }
}

export const EResponse = addCommonMethods(EResponseBase);
export type EResponse = InstanceType<typeof EResponse>;
