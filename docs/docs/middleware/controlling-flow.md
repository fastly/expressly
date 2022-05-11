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

This will **not** redirect the user; instead, it will affect the route selection logic. In this case, a subsequent `router.get("/")` will not match the request, but `router.get("/home")` will.

## Stopping a request

If you need to stop requests (for example, in order to block unauthenticated requests), you can call `res.end()` – which, unlike [`req.send()`](../sending-responses/response-functions.md#ressend), will end the response process.

```javascript
router.use("/account/", (req, res) => {
  if(!("userId" in req.cookies)){
    res.end("You must be logged in to view this page");
  }
});
```

You can also stop requests by redirecting to a different route:

```javascript
router.use("/account/", (req, res) => {
  if(!("userId" in req.cookies)){
    res.redirect("/login");
  }
});
```
