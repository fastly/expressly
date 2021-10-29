import Route from "./route";
import FPRequest from "./request";
import FPResponse from "./response";
import Middleware from "./middleware";
export class Router {
    constructor() {
        this.routes = [];
        this.middlewares = [];
    }
    listen() {
        addEventListener("fetch", (event) => event.respondWith(this.handler(event)));
    }
    async handler(event) {
        try {
            const req = new FPRequest(event);
            const res = new FPResponse();
            await this.runMiddlewares(req, res);
            await this.runRoutes(req, res);
            return serializeResponse(res);
        }
        catch (e) {
            console.log(e);
        }
    }
    async runMiddlewares(req, res) {
        this.middlewares.map(async (m) => {
            await m.run(req, res);
        });
    }
    async runRoutes(req, res) {
        const matchedRoute = this.routes.find((route) => route.check(req));
        if (matchedRoute) {
            await matchedRoute.run(req, res);
        }
    }
    use(callback) {
        this.middlewares.push(new Middleware(callback));
    }
    route(method, pattern, callback) {
        this.routes.push(new Route(basicRouteMatcher(method, pattern), callback));
    }
    get(pattern, callback) {
        this.route("GET", pattern, callback);
    }
    post(pattern, callback) {
        this.route("POST", pattern, callback);
    }
    put(pattern, callback) {
        this.route("PUT", pattern, callback);
    }
    delete(pattern, callback) {
        this.route("DELETE", pattern, callback);
    }
    head(pattern, callback) {
        this.route("HEAD", pattern, callback);
    }
    options(pattern, callback) {
        this.route("OPTIONS", pattern, callback);
    }
    patch(pattern, callback) {
        this.route("PATCH", pattern, callback);
    }
}
function serializeResponse(res) {
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
export function basicRouteMatcher(method, pattern) {
    const isRegexMatch = pattern.indexOf("*") !== -1 || pattern.indexOf(":") !== -1;
    function simpleMatch(req) {
        if (req.method.toUpperCase() != method.toUpperCase() && method != "*")
            return false;
        return pattern == "*" || req.url.pathname == pattern;
    }
    let checkFunction = isRegexMatch ? makeRegexMatch(pattern) : simpleMatch;
    return (req) => {
        return checkFunction(req);
    };
}
/**
 * Take the path of a route which can include paramters such as ":id" and turn those into regex matches
 * @param pattern Express style path pattern, e.g "/user/:userid/profile"
 * @returns
 */
function makeRegexMatch(pattern) {
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
    return (req) => {
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
