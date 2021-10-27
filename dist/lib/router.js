var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    handler(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const req = new FPRequest(event);
                const res = new FPResponse();
                yield this.runMiddlewares(req, res);
                yield this.runRoutes(req, res);
                return serializeResponse(res);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    runMiddlewares(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            this.middlewares.map((m) => __awaiter(this, void 0, void 0, function* () {
                yield m.run(req, res);
            }));
        });
    }
    runRoutes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Checking routes...");
            const matchedRoute = this.routes.find((route) => route.check(req));
            console.log("Found matching route");
            if (matchedRoute) {
                yield matchedRoute.run(req, res);
            }
            console.log("Ran route.");
        });
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
    return new Response(res.body, {
        headers: res.headers,
        status: res.status,
    });
}
export function basicRouteMatcher(method, pattern) {
    const isRegexMatch = pattern.indexOf("*") !== -1 || pattern.indexOf(":") !== -1;
    function simpleMatch(req) {
        if (req.method.toUpperCase() != method.toUpperCase() && method != "*")
            return false;
        return pattern == "*" || req.url.pathname == pattern;
    }
    console.log(`${pattern}: ${isRegexMatch}`);
    let checkFunction = isRegexMatch ? makeRegexMatch(pattern) : simpleMatch;
    return (req) => {
        return checkFunction(req);
    };
}
function makeRegexMatch(pattern) {
    pattern = pattern
        .replace(/\$/g, "$")
        .replace(/\^/g, "^")
        .replace(/\*/g, "(.*)")
        .replace(/\//g, "\\/")
        .replace(/((?<=\:)[a-zA-Z0-9]+)/g, "(?<$&>[a-zA-Z0-9_-]+)")
        .replace(/\:/g, "");
    const matchRegexp = new RegExp(`^${pattern}$`, "i");
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
