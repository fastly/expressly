---
sidebar_position: 3
---

# Routing

**expressly** provides the `Router` object which stores configuration for your routing. Create a new router like this:

```javascript
import { Router } from "@fastly/expressly";

const router = new Router();
```

> 💡 `Router` supports additional [configuration](config.md).

## Creating a route

Then add a route by calling `router.HTTP_METHOD(PATH, handler)`. Adding a route for `GET` requests to `/hello-world` looks like this:

```javascript
router.get("/hello-world", (req, res) => {
  res.send("Hello world!");
});
```

In the example above, if a request is made to the `/hello-world` path, your handler will run and return "Hello world!"

### What is a handler?

A handler is the function **expressly** will call to get a response to send back to the client. It is passed two arguments, the **req**uest and the **res**ponse.

```javascript
router.post("/", (req, res) => {
  res.send("<h1>This is the response!</h1>");
});
```

> 🚨 **Unlike Express**, handlers accept only two arguments, `req` and `res`. **expressly** does away with the `next` function; uncaught errors are passed to [error middleware](./middleware/error-middleware.md). 

## Listening for requests

After you have configured your routing logic, you **must** call `router.listen()` to bind the router to incoming requests.

### Hello world!

```javascript
import { Router } from "@fastly/expressly";

const router = new Router();

router.get("/", async (req, res) => {
  return res.send("Hello world!");
});

router.listen();
```

## Route matching

### HTTP methods

With **expressly**, you can handle multiple HTTP methods per route:

```javascript
router.route(["GET", "POST"], "/my-page", async (req, res) => {
  return res.send(`You made a ${req.method} request to my page!`);
});
```

If you want to handle _all_ HTTP methods on one route you can use `router.all`:

```javascript
router.all("/dead-end", (req, res) => {
  res.end("Nothing to see here!");
});
```

### Route matching

**expressly** uses [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) for pattern-matching routes:

- `router.HTTP_METHOD(PATTERN, handler)`
- `router.all(PATTERN, handler)`
- `router.route(HTTP_METHOD[], PATTERN, handler)`

#### Wildcards

You can use wildcard parameters `(.*)` in order to match multiple URLs with one route.

```javascript
router.get("/assets/(.*)", (req, res) => {
  res.send(`You are visiting: ${req.path}`);
});
```

> 🚨 There is no wildcard asterisk (`*`) in **expressly** - use parameters instead (`(.*)` or `:splat*`).


```javascript
router.get("(.*)", (req, res) => {
  res.send("Hello world!");
});
```

The above will match `GET` requests to any path.

#### Regular expressions

You can use regular expressions in order to match multiple URLs with one route.

```javascript
router.get(/.*fly$/, (req, res) => {
  res.send(`You are visiting: ${req.path}`);
});
```

The route path above will match `butterfly` and `dragonfly`, but not `butterfly-net` or `flyer`.

#### Path parameters

You can specify parameters on your routes. The values of these parameters will be parsed and available inside your handler, in the `req.params` object.

```javascript
router.get("/profile/:userId", (req, res) => {
  let userId = req.params.userId;
  res.send(`This is the profile for user ${userId}`);
});
```

You can use regular expressions to constrain matching rules for parameters.

```javascript
router.get("/books/:id(\\d+)", (req, res) => {
  let bookId = req.params.id;
  res.send(`Book ID: ${bookId}`);
});
```

## Custom 404

For a custom 404 response, you can add a catch-all request handler after all other routes and middleware:

```javascript
router.all(("(.*)", (req, res) => {
  res.status = 404;
  return res.send("Page not found!");
});
```

Alternatively, you can achieve the same using [error middleware](middleware/error-middleware.md):

```javascript
router.use((err, req, res) => {
  if(err.status === 404) {
    res.send("Page not found!");
  }
});
```

> 💡 **expressly** decorates errors with a `status` property as follows:
> * `404` – when no route was matched for the request path 
> * `405` – when a route was found, but the request's HTTP method did not match. 
