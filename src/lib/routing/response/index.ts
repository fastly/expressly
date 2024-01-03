import cookie from "cookie";
import mitt, { Emitter } from "mitt";
import { appendFn, setFn } from "../common";
import { statusText } from "./status-codes";
import { SurrogateKeys } from "./surrogate-keys";
import { EHeaders } from "./headers";
import { CookieOptions, EConfig } from "..";

export type EResponseEvents = {
  finish: Response;
}

export class EResponse {
  headers: EHeaders = new EHeaders();
  status: number = 0;
  body: BodyInit = null;
  hasEnded: boolean = false;
  surrogateKeys: SurrogateKeys = new SurrogateKeys(this.headers);
  emitter: Emitter<EResponseEvents> = mitt<EResponseEvents>();

  constructor(private config: EConfig) {}

  set = setFn(this);
  append = appendFn(this);

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

    this.cookie(key, "", {
      ...options,
      expires: new Date("Thu, 01 Jan 1970 00:00:00 GMT"),
    });
  }

  on(event: "finish", callback: (finalResponse?: Response) => void): void {
    this.emitter.on(event, callback);
  }
  
  // Response lifecycle methods.
  send(response: BodyInit | Response) {
    if (this.hasEnded) return;

    if (response instanceof Response) {
      this.body = response.body;
      // Append, rather than overwrite headers.
      response.headers.forEach((value, key) => this.headers.append(key, value));
      // Do not overwrite user-defined status.
      this.status = this.status || response.status;
    } else {
      this.body = response;
    }

    // EXPERIMENTAL: Content type inference, à la Express.js.
    if (
      this.config.autoContentType &&
      !this.headers.has("Content-Type") &&
      Boolean(this.body)
    ) {
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

    this.headers.set(
      "Content-Type",
      `text/html${charset ? `; charset=${charset}` : ""}`,
    );
    this.send(data);
  }
}

export interface ERes extends EResponse {}
