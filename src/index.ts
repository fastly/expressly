/// <reference types="@fastly/js-compute" />

import { Router } from "./lib/routing/router";
import ERequest from "./lib/routing/request";
import EResponse from "./lib/routing/response";
import { MiddlewareCallback, Middleware } from "./lib/routing/middleware";

export {
  Router,
  ERequest,
  EResponse,
  MiddlewareCallback,
  Middleware,
};
