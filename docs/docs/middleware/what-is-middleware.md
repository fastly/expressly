---
sidebar_position: 1
---

# What is middleware?

Middleware allows you to run code on a request before any routes are run. This is useful for things like authentication, header manipulation, and anything else that needs to happen before your routes are handled. 

## router.use()

Middleware is attached by calling the `router.use()` method.

The example below shows how to use middleware to add a header to all requests:

```javascript
router.use((req, res) => {
  res.setHeader("x-powered-by", "expressly");
});
```

If you only want middleware to run on specific routes, you can pass a path to the middleware:

```javascript
router.use("/api/*", (req, res) => {
  console.log("Got a request to the API!");
});
```

> 💡 **expressly** supports [URLPattern syntax](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API#pattern_syntax) for route matching. This means that your middleware mount paths can contain wildcards and even regular expressions.