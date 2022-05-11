---
sidebar_position: 1
---

# Basic routing

**expressly** provides the `Router` object which stores configuration for your routing. Create a new router like this:

```javascript
import { Router } from "@fastly/expressly";

const router = new Router();
```

## Creating a route

Then add a route by calling `router.HTTP_METHOD(PATH, HANDLER)`. Adding a route for `GET` requests to `/hello-world` looks like this:

```javascript
router.get("/hello-world", (req, res) => {
  res.send("Hello world!");
})
```

In the example above, if a request is made to the `/hello-world` path, your handler will run and return "Hello world!"

### What is a handler?

A handler is the function **expressly** will call to get a response to send back to the client. It is passed two arguments, the **req**uest and the **res**ponse.

```javascript
router.get("/", (req, res) => {
  res.send("<h1>This is the response!</h1>");
})
```

## Listening for requests

After you have configured your routing logic, you **must** call `router.listen()` to bind the router to incoming requests.

## Hello world!

```javascript
import { Router } from "@fastly/expressly";

const router = new Router();

router.get("/", async (req, res) => {
  return res.send("Welcome to expressly!");
});

router.get("/my-page", async (req, res) => {
  return res.send("This is my page!");
});

router.post("/my-page", async (req, res) => {
  return res.send("You made a POST request to my page!");
});

router.listen();
```
