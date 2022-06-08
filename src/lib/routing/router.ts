import { match } from "path-to-regexp";

import { EConfig } from ".";
import { RequestHandler, RequestHandlerCallback } from "./request-handler";
import { ErrorMiddleware, ErrorMiddlewareCallback } from "./error-middleware";
import ERequest from "./request";
import EResponse from "./response";

const pathMatcherCache: Map<string, Function> = new Map();

export class Router {
  requestHandlers: Array<RequestHandler> = [];
  errorHandlers: Array<ErrorMiddleware> = [];
  config: EConfig = {
    parseCookie: true,
    auto405: true,
    extractRequestParameters: true,
    autoContentType: false
  };

  constructor(config?: EConfig) {
    this.config = {
      ...this.config,
      ...config
    }
  }

  public listen(): void {
    addEventListener("fetch", (event) =>
      event.respondWith(this.handler(event))
    );
  }

  private async handler(event: FetchEvent): Promise<Response> {
    try {
      const req = new ERequest(this.config, event);
      const res = new EResponse(this.config);

      try {
        await this.runRequestHandlers(req, res);
      } catch (err) {
        await this.runErrorHandlers(err, req, res);
      }

      return Router.serializeResponse(res);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  // Middleware attach point.
  public use(
    path: string | RequestHandlerCallback | ErrorMiddlewareCallback,
    callback?: RequestHandlerCallback | ErrorMiddlewareCallback
  ): void {
    const cb = path instanceof Function ? path : callback;
    const matcher = path instanceof Function ? () => 0 : this.routeMatcher(["*"], path as string);
    if (cb.length === 3) {
      this.errorHandlers.push(
        new ErrorMiddleware(matcher, cb as ErrorMiddlewareCallback)
      );
    } else {
      this.requestHandlers.push(
        new RequestHandler(matcher, cb as RequestHandlerCallback)
      )
    }
  }

  // Router API.
  public route(
    methods: string[],
    pattern: string,
    callback: RequestHandlerCallback
  ): void {
    this.requestHandlers.push(new RequestHandler(this.routeMatcher(methods, pattern), callback));
  }

  public all(pattern: string, callback: RequestHandlerCallback): void {
    this.route(["*"], pattern, callback);
  }

  public get(pattern: string, callback: RequestHandlerCallback): void {
    this.route(["GET"], pattern, callback);
  }

  public post(pattern: string, callback: RequestHandlerCallback): void {
    this.route(["POST"], pattern, callback);
  }

  public put(pattern: string, callback: RequestHandlerCallback): void {
    this.route(["PUT"], pattern, callback);
  }

  public delete(pattern: string, callback: RequestHandlerCallback): void {
    this.route(["DELETE"], pattern, callback);
  }

  public head(pattern: string, callback: RequestHandlerCallback): void {
    this.route(["HEAD"], pattern, callback);
  }

  public options(pattern: string, callback: RequestHandlerCallback): void {
    this.route(["OPTIONS"], pattern, callback);
  }

  public patch(pattern: string, callback: RequestHandlerCallback): void {
    this.route(["PATCH"], pattern, callback);
  }

  // Request handler runner.
  private async runRequestHandlers(req: ERequest, res: EResponse): Promise<any> {
    let status;
    for (let a of this.requestHandlers) {
      if (res.hasEnded) {
        break;
      }
      status = a.check(req);
      if (status === 0) {
        await a.run(req, res);
      }
    }
    if (status) {
      // We're here if method not allowed / path not found.
      res.status = this.config.auto405 ? status : 404;
    }
  }

  // Error handler runner.
  private async runErrorHandlers(err: Error, req: ERequest, res: EResponse): Promise<any> {
    for (let eH of this.errorHandlers) {
      if (res.hasEnded) {
        break;
      }
      if (eH.check(req) === 0) {
        await eH.run(err, req, res);
      }
    }
  }

  /**
   * Creates a function used to check if the request method and path match a router configuration.
   * @param methods An array of HTTP method(s) or "*" to match all methods.
   * @param pattern A path string compatible with path-to-regexp (see: https://www.npmjs.com/package/path-to-regexp)
   * @param extractRequestParameters Whether to extract parameters from a request
   * @returns 405 if the method is not allowed, 404 if the path doesn't match, 0 otherwise.
   */
  private routeMatcher(
    methods: string[],
    pattern: string
  ): Function {
    return (req: ERequest): 405 | 404 | 0 => {
      const methodAllowed = methods.some(m => m === "*" || m.toUpperCase() === req.method.toUpperCase());

      if (pattern === "*" || pattern === "(.*)") {
        return methodAllowed ? 0 : 405;
      } else {
        // Cache pattern matcher.
        if (!pathMatcherCache.has(pattern)) {
          pathMatcherCache.set(pattern, match(pattern, { decode: decodeURIComponent }));
        }
        // Match on pathname.
        let { path, params } = pathMatcherCache.get(pattern)(req.url.pathname) || {};
        if (path) {
          if (this.config.extractRequestParameters) {
            req.params = params;
          }
          return methodAllowed ? 0 : 405;
        }
      }
      // Route not found.
      return 404;
    };
  }

  private static serializeResponse(res: EResponse): Response {
    // Default to 200 / 204 if no status was set by middleware / route handler.
    if (res.status === 0) {
      res.status = Boolean(res.body) ? 200 : 204;
    }

    return new Response(res.body, {
      headers: res.headers,
      status: res.status,
    });
  }
}
