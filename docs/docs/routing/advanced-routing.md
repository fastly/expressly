---
sidebar_position: 2
---

# Advanced routing

## Wildcards

**expressly** supports glob-style patterns for route matching. You can use wildcards in order to match multiple URLs with one route.

```javascript
router.get("/assets/*", (req, res) => {
    let path = req.url.pathname;
    res.send(`You are at this asset path: ${path}`)
})
```

The above will match any `GET` request to `/assets/[ANYTHING]` such as `/assets/logo.png` or `/assets/file.csv`.

## Path parameters

You can specify parameters on your routes. The values of these parameters are available inside your handler, in the `req.params` object.

```javascript
router.get("/profile/:userId", (req, res) => {
    let userId = req.params.userId;
    res.send(`This is the profile for user ${userId}`);
})
```

## HTTP method wildcards

If you want to handle all HTTP methods on one route you can use `router.route(HTTP_METHOD, PATH_PATTERN, HANDLER)`:

```javascript
router.route("*", "/api/profile", (req, res) => {
    let method = req.method;
    res.send(`You made a ${method} request`);
})
```
