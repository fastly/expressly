---
sidebar_position: 3
title: Handling errors
---

# Error middleware

**expressly** catches and processes errors that occur both synchronously and asynchronously. 

```javascript
router.get("/", (req, res) => {
  throw new Error("BROKEN"); // expressly will catch this.
})
```

## The default error handler

**expressly** comes with a built-in error handler that takes care of any errors that might be encountered in the app. This default error-handling middleware function is added at the end of the router stack, after all other middleware and request handlers.

## Error-handling middleware

You can define custom error-handling middleware functions in the same way as other middleware functions, except with **three** arguments instead of two, specifically with the signature `(err, req, res)`.

The example below shows how to use error middleware to serve a custom error page:

```javascript
router.use((err, req, res) => {
  console.error(err);
  res.withStatus(500).send(`Uh-oh! Something went wrong: ${e.message}`);
});
```

If you only want error middleware to run on specific routes, you can pass a path to the middleware:

```javascript
router.use("/api/(.*)", (err, req, res) => {
  console.log("Errored on handling a request to the API!");
});
```

> **expressly** uses [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) to [pattern-match routes](../routing.md#route-matching).
