import { Route, RequestHandlerCallback } from "./route";
import FPRequest from "./request";
import FPResponse from "./response";
import Middleware, { MiddlewareCallback } from "./middleware";
export class Router {
  routes: Route[] = [];
  middlewares: Middleware[] = [];

  public listen(): void {
    addEventListener("fetch", (event) =>
      event.respondWith(this.handler(event))
    );
  }

  private async handler(event: FetchEvent): Promise<Response> {
    try {
      const req = new FPRequest(event);
      const res = new FPResponse();

      await this.runMiddlewares(req, res);

      if (!res.hasEnded) {
        await this.runRoutes(req, res);
      }

      return serializeResponse(res);
    } catch (e) {
      console.log(e);
    }
  }

  private async runMiddlewares(req: FPRequest, res: FPResponse): Promise<any> {
    for (let m of this.middlewares) {
      if (m.check(req)) {
        await m.run(req, res);
      }
    }
  }

  private async runRoutes(req: FPRequest, res: FPResponse): Promise<any> {
    const matchedRoute = this.routes.find((route): boolean => route.check(req));

    if (matchedRoute) {
      await matchedRoute.run(req, res);
    }
  }

  public use(
    path: string | MiddlewareCallback,
    callback?: MiddlewareCallback
  ): void {
    if (path instanceof Function) {
      this.middlewares.push(
        new Middleware(() => true, path as MiddlewareCallback)
      );
    } else {
      this.middlewares.push(
        new Middleware(basicRouteMatcher("*", path as string, false), callback)
      );
    }
  }

  public route(
    method: string,
    pattern: string,
    callback: RequestHandlerCallback
  ): void {
    this.routes.push(new Route(basicRouteMatcher(method, pattern), callback));
  }

  public all(pattern: string, callback: RequestHandlerCallback): void {
    this.route("*", pattern, callback);
  }

  public get(pattern: string, callback: RequestHandlerCallback): void {
    this.route("GET", pattern, callback);
  }

  public post(pattern: string, callback: RequestHandlerCallback): void {
    this.route("POST", pattern, callback);
  }

  public put(pattern: string, callback: RequestHandlerCallback): void {
    this.route("PUT", pattern, callback);
  }

  public delete(pattern: string, callback: RequestHandlerCallback): void {
    this.route("DELETE", pattern, callback);
  }

  public head(pattern: string, callback: RequestHandlerCallback): void {
    this.route("HEAD", pattern, callback);
  }

  public options(pattern: string, callback: RequestHandlerCallback): void {
    this.route("OPTIONS", pattern, callback);
  }

  public patch(pattern: string, callback: RequestHandlerCallback): void {
    this.route("PATCH", pattern, callback);
  }
}

function serializeResponse(res: FPResponse): Response {
  res.setDefaults();

  let response = new Response(res.body, {
    headers: res._headers,
    status: res.status,
  });

  // Looping cookie headers manually to work around this bug: https://github.com/fastly/js-compute-runtime/issues/47
  for (let [_, c] of res._cookies) {
    response.headers.append("Set-Cookie", c);
  }

  return response;
}

/**
 * This function creates another function which will be used to check if a request matches the route.
 * e.g. does the method and the pattern match?
 * @param method the HTTP method, GET, POST etc
 * @param pattern Express style path
 * @returns A function which returns a boolean, true = "matched, run this route"
 */
export function basicRouteMatcher(
  method: string,
  pattern: string,
  extractParams: boolean = true
): Function {
  const isRegexMatch =
    (pattern.indexOf("*") !== -1 || pattern.indexOf(":") !== -1) &&
    pattern.length > 1;

  function simpleMatch(req: FPRequest): boolean {
    if (req.method.toUpperCase() != method.toUpperCase() && method != "*")
      return false;

    return pattern == "*" || req.url.pathname == pattern;
  }

  let checkFunction = isRegexMatch
    ? makeRegexMatch(pattern, extractParams)
    : simpleMatch;

  return (req: FPRequest): boolean => {
    return checkFunction(req);
  };
}

/**
 * Take the path of a route which can include parameters such as ":id" and turn those into regex matches
 * @param pattern Express style path pattern, e.g "/user/:userid/profile"
 * @returns
 */
function makeRegexMatch(
  pattern: string,
  extractParams: boolean = true
): Function {
  pattern = pattern
    .replace(/\$/g, "$")
    .replace(/\^/g, "^")
    .replace(/\*/g, "(.*)")
    .replace(/\//g, "\\/")
    .replace(/((?<=\:)[a-zA-Z0-9]+)/g, "(?<$&>[a-zA-Z0-9_-]+)")
    .replace(/\:/g, "");

  // Above regex does this:
  // '/user/:userid/profile' -> '\\/user\\/(?<userid>[a-zA-Z0-9_-]+)\\/profile'

  // Importantly, we are making this at compile time and not runtime
  const matchRegexp = new RegExp(`^${pattern}$`, "i");

  // Not sure how required this is, but use the regex to verify it is actually compiled.
  matchRegexp.test("Make sure RegExp is compiled at build time.");

  return (req: FPRequest): boolean => {
    let matches;

    if ((matches = matchRegexp.exec(req.url.pathname)) !== null) {
      // Take matches and put in req.params
      if (matches.groups) {
        let matchKeys = Object.keys(matches.groups);

        matchKeys.map((k) => {
          req.params[k] = matches.groups[k];
        });
      }

      return true;
    }

    return false;
  };
}
