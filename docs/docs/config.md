---
sidebar_position: 7
---

# Configuration

**expressly**'s router can be initialized with an optional configuration object:

```javascript
const router = new Router({
  parseCookie: true,
  auto405: true,
  extractRequestParameters: true,
  autoContentType: true,
});
```

## Options

### parseCookie

> Default 🟢 `true`

When set to `true`, enables parsing of the `Cookie` request header and exposes [`req.cookies`](handling-data/cookies.md#request-cookies).

### auto405

> Default 🟢 `true`

When set to `true`, **expressly** will respond with HTTP `405 Method Not Allowed` if it cannot match the client request method.

In the example below, a `POST` request to the `/users` path will result in a HTTP 405 response.
```javascript
const router = new Router({ auto405: true });
router.get("/users", (req, res) => { ... });
router.listen();
```

Setting `auto405: false` above will cause **expressly** to respond with HTTP 404.

### extractRequestParameters

> Default 🟢 `true`

When set to `true`, exposes `req.params`, an object containing properties mapped to any [named route "parameters"](./routing/advanced-routing.md#path-parameters).

### autoContentType

> Default 🔴 `false` 🔥 experimental

When set to `true`, [`res.send`](handling-data/response.md#ressend) will try to [infer the `Content-Type` header](https://expressjs.com/en/4x/api.html#res.send) from the data it is passed, if the header is not set.
