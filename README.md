# FlightPath
Express style router for Fastly Compute@Edge

### Check the examples directory for examples

This project is designed to offer an express style router for Fastly's C@E platform


## Usage

[Check out the docs](https://flight-path.edgecompute.app/)

Create a router object with `const router = new Router();`, this is the main object of FlightPath which all routes and middleware will be added to.

Once all routes and middleware are added, you need to call `router.listen();` to bind the router to the `fetch` event which is called on each request.

A basic app would look like this:

```javascript
const router = new Router();

router.get("/", async (req, res) => {
  return res.send("Hello World!");
});

router.listen();
```

### Methods

The router object has functions for each HTTP method such as `router.get` and `router.post` which can be called with a path and a callback:

```javascript
router.get("/", async (req, res) => {
  return res.send("Hello World!");
});
```

There is also a `router.route` function which works the same as the specific method functions but allows you to pass the method as a string:
```javascript
router.route("GET", "/", (req, res) => {
  return res.send("Home");
});
```

If you wanted to bind to all methods you can use `router.route` and pass an `*` as the method to bind to all methods:
```javascript
router.route("*", "/", (req, res) => {
  return res.send("All methods!");
});
```

### Paths and Parameters

The path passed into a route can be either a `pathname` as specified in the [URL specification](https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname) or a path with parameter matching such as this:

```javascript
// Capture the word after /greeting/ as a variable called name
// Reply to the path "/greeting/world" with "Hello world!"
router.get("/greeting/:name", async (req, res) => {
  return res.send(`Hello ${req.params.name}!`);
});
```

Paths may also contain `*` to include anything such as this:
```javascript
// Return this message for any path starting with `/assets/`
router.get("/assets/*", async (req, res) => {
  return res.send("This is where the assets would be!");
});

```
