import "urlpattern-polyfill";

import { Route, RequestHandlerCallback } from "./route";
import { Middleware, MiddlewareCallback } from "./middleware";
import ERequest from "./request";
import EResponse from "./response";
import { EConfig } from ".";

const urlPatternCache: Map<string, URLPattern> = new Map();

export class Router {
  routes: Route[] = [];
  middleware: Middleware[] = [];
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

      await this.runMiddleware(req, res);
      await this.runRoute(req, res);

      return serializeResponse(res);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  // Middleware runner.
  private async runMiddleware(req: ERequest, res: EResponse): Promise<any> {
    for (let m of this.middleware) {
      if (res.hasEnded) {
        break;
      }
      if (m.check(req) === 0) {
        await m.run(req, res);
      }
    }
  }

  // Route runner.
  private async runRoute(req: ERequest, res: EResponse): Promise<any> {
    let status;
    for (let r of this.routes) {
      if (res.hasEnded) {
        break;
      }
      status = r.check(req);
      if (status === 0) {
        await r.run(req, res);
      }
    }
    if (status) {
      // We're here if method not allowed / path not found.
      res.status = this.config.auto405 ? status : 404;
    }
  }

  // Middleware attach point.
  public use(
    path: string | MiddlewareCallback,
    callback?: MiddlewareCallback
  ): void {
    if (path instanceof Function) {
      this.middleware.push(
        new Middleware(() => 0, path as MiddlewareCallback)
      );
    } else {
      this.middleware.push(
        new Middleware(routeMatcher(["*"], path as string), callback)
      );
    }
  }

  // Router API.
  public route(
    methods: string[],
    pattern: string,
    callback: RequestHandlerCallback
  ): void {
    this.routes.push(new Route(routeMatcher(methods, pattern), callback));
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
}

function serializeResponse(res: EResponse): Response {
  // Default to 200 / 204 if no status was set by middleware / route handler.
  if (res.status === 0) {
    res.status = Boolean(this.body) ? 200 : 204;
  }

  return new Response(res.body, {
    headers: res.headers,
    status: res.status,
  });
}

/**
 * Creates a function used to check if the request method and path match a router configuration.
 * @param methods An array of HTTP method(s) or "*" to match all methods.
 * @param pattern A URLPattern string (see: https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
 * @returns 405 if the method is not allowed, 404 if the path doesn't match, 0 otherwise.
 */
function routeMatcher(
  methods: string[],
  pattern: string
): Function {
  return (req: ERequest): 405 | 404 | 0 => {
    // Match on request method first.
    if (!methods.some(m => m === "*" || m.toUpperCase() === req.method.toUpperCase())) {
      // Method not allowed.
      return 405;
    }
    // Cache URL patterns.
    if (!urlPatternCache.has(pattern)) {
      urlPatternCache.set(pattern, new URLPattern(pattern));
    }
    // Match on pathname.
    let { pathname: { groups, input } } = urlPatternCache.get(pattern).exec() || { pathname: {} };
    if (input) {
      if (this.config.extractRequestParameters) {
        req.params = Object.keys(groups).reduce((acc, key) => {
          // Only match named parameters (groups for wildcards have integer indexes).
          if (`${parseInt(key)}` !== key) {
            acc[key] = groups[key];
          }
          return acc;
        }, {});
      }
      return 0;
    }
    // Route not found.
    return 404;
  };
}
