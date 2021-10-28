import Route from "./route";
import FPRequest from "./request";
import FPResponse from "./response";
import Middleware from "./middleware";

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

      await this.runRoutes(req, res);

      return serializeResponse(res);
    } catch (e) {
      console.log(e);
    }
  }

  private async runMiddlewares(req: FPRequest, res: FPResponse): Promise<any> {
    this.middlewares.map(async m => {
      await m.run(req, res);
    })
  }

  private async runRoutes(req: FPRequest, res: FPResponse): Promise<any> {
    const matchedRoute = this.routes.find((route): boolean => route.check(req));

    if (matchedRoute) {
      await matchedRoute.run(req, res);
    }
  }

  public use(callback: Function): void {
    this.middlewares.push(new Middleware(callback));
  }

  public route(method: string, pattern: string, callback: Function): void {
    this.routes.push(new Route(basicRouteMatcher(method, pattern), callback));
  }

  public get(pattern: string, callback: Function): void {
    this.route("GET", pattern, callback);
  }

  public post(pattern: string, callback: Function): void {
    this.route("POST", pattern, callback);
  }

  public put(pattern: string, callback: Function): void {
    this.route("PUT", pattern, callback);
  }

  public delete(pattern: string, callback: Function): void {
    this.route("DELETE", pattern, callback);
  }

  public head(pattern: string, callback: Function): void {
    this.route("HEAD", pattern, callback);
  }

  public options(pattern: string, callback: Function): void {
    this.route("OPTIONS", pattern, callback);
  }

  public patch(pattern: string, callback: Function): void {
    this.route("PATCH", pattern, callback);
  }
}

function serializeResponse(res: FPResponse): Response {
  res.setDefaults();

  return new Response(res.body, {
    headers: res.headers,
    status: res.status,
  });
}

export function basicRouteMatcher(method: string, pattern: string): Function {
  const isRegexMatch =
    pattern.indexOf("*") !== -1 || pattern.indexOf(":") !== -1;

  function simpleMatch(req: FPRequest): boolean {
    if (req.method.toUpperCase() != method.toUpperCase() && method != "*")
      return false;

    return pattern == "*" || req.url.pathname == pattern;
  }

  let checkFunction = isRegexMatch ? makeRegexMatch(pattern) : simpleMatch;

  return (req: FPRequest): boolean => {
    return checkFunction(req);
  };
}

function makeRegexMatch(pattern: string): Function {
  pattern = pattern
    .replace(/\$/g, "$")
    .replace(/\^/g, "^")
    .replace(/\*/g, "(.*)")
    .replace(/\//g, "\\/")
    .replace(/((?<=\:)[a-zA-Z0-9]+)/g, "(?<$&>[a-zA-Z0-9_-]+)")
    .replace(/\:/g, "");

  const matchRegexp = new RegExp(`^${pattern}$`, "i");

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
