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

### Pattern matching using URLPattern

**expressly** supports [URLPattern syntax](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API#pattern_syntax) for pattern-matching routes:

- `router.HTTP_METHOD(URL_PATTERN, handler)`
- `router.all(URL_PATTERN, handler)`
- `router.route(HTTP_METHOD[], URL_PATTERN, handler)`

#### Wildcards

You can use wildcards in order to match multiple URLs with one route.

```javascript
router.get("/assets/*", (req, res) => {
  let path = req.url.pathname;
  res.send(`You are at this asset path: ${path}`);
});
```

The above will match any `GET` request to `/assets/[ANYTHING]` such as `/assets/logo.png` or `/assets/file.csv`.

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
