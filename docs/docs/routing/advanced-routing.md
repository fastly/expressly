---
sidebar_position: 2
---

# Advanced routing

## HTTP methods

With **expressly**, you can handle multiple HTTP methods per route:

```javascript
router.route(["POST", "PATCH"], "/posts", (req, res) => {
  // Handle request...
});
```

If you want to handle _all_ HTTP methods on one route you can use `router.all`:

```javascript
router.all("/dead-end", (req, res) => {
  res.end("Nothing to see here!");
});
```

## Wildcards

**expressly** supports [URLPattern syntax](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API#pattern_syntax) for route matching. You can use wildcards in order to match multiple URLs with one route.

```javascript
router.get("/assets/*", (req, res) => {
  let path = req.url.pathname;
  res.send(`You are at this asset path: ${path}`);
});
```

The above will match any `GET` request to `/assets/[ANYTHING]` such as `/assets/logo.png` or `/assets/file.csv`.

## Path parameters

You can specify parameters on your routes. The values of these parameters are available inside your handler, in the `req.params` object.

```javascript
router.get("/profile/:userId", (req, res) => {
  let userId = req.params.userId;
  res.send(`This is the profile for user ${userId}`);
});
```

You can use regular expressions to define the matching rules for parameters. 

```javascript
router.get("/books/:id(\\d+)", (req, res) => {
  let bookId = req.params.id;
  res.send(`Book ID: ${bookId}`);
});
```
