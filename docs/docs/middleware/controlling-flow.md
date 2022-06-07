---
sidebar_position: 2
---

# Controlling flow

**expressly** allows you to control the flow of a request with middleware.

For example, you could edit the Request object:

```javascript
router.use((req, res) => {
  if (req.url.pathname == "/") {
    req.url.pathname = "/home";
  }
});
```

This will **not** redirect the user; instead, it will affect the route selection logic downstream. In this case, a subsequent `router.get("/")` will not match the request, but `router.get("/home")` will.

## Stopping a request

If you need to end the response process early (for example, in order to block unauthenticated requests), you can call [`res.end`](../handling-data/response.md#resend) (or [`res.send`](../handling-data/response.md#ressend)) from middleware. 

```javascript
router.use("/account/", (req, res) => {
  if(!("userId" in req.cookies)){
    res.end("You must be logged in to view this page");
  }
});
```

You can also end the response process by _redirecting_ to a different route:

```javascript
router.use("/account/", (req, res) => {
  if(!("userId" in req.cookies)){
    res.redirect("/login");
  }
});
```
