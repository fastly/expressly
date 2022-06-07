---
sidebar_position: 2
---

# Response

The **res**ponse object is the primary way to send data back to the client. **expressly** provides methods to set the response status, headers, and body.

## res.send()

The easiest way to deliver a response is to use the **res.send()** method. This method takes a single argument, which is the response body.
The response body can be:

* A `string`,

```javascript
router.get('/', (req, res) => {
  res.send('Hello World!');
});
```

* A `ReadableStream`,

```javascript
router.get("/api", async (req, res) => {
  let originRequest = await fetch(
    "https://example.com", { backend: "my-origin" }
  );

  res.send(res.body);
});
```

* Or a `Response`:

```javascript
router.get("/origin", async (req, res) => {
  res.send(await fetch(
    "https://example.com", { backend: "my-origin" }
  ));
});
```

## res.redirect()

When you want to redirect the user to another page, you can use the `res.redirect()` method. It will set the status code to `301` and set the `Location` header to the URL you want to redirect to.

```javascript
router.get('/', function(req, res) {
  res.redirect('/about');
});
```

```javascript
router.get("/redirect", async (req, res) => {
  res.redirect("https://fastly.com");
});
```

## res.json()

To return a serialized JSON response (`Content-Type: application/json`):

```javascript
router.get('/', function(req, res) {
  res.json({
    message: 'Hello world!'
  });
});
```

## res.text()

To return a plain-text response (`Content-Type: text/plain`):

```javascript
router.get("/api", async (req, res) => {
  res.text("Hello world!");
});
```

## res.html()

To return a HTML response (`Content-Type: text/html[; charset=my-charset]`):

```javascript
router.get("/page", async (req, res) => {
  // Takes a second, optional argument specifying a charset:
  res.html("<html><body><h1>This is HTML!</h1></body></html>", "utf-8");
});
```

## res.withStatus()

**expressly** provides a chainable method to set the status code of a response:

```javascript
router.get("/page", async (req, res) => {
  res
    .withStatus(404)
    .html("<html><body><h1>Page not found</h1></body></html>");
});
```


## Response headers

[Read more](../handling-data/headers.md) about manipulating response (and request) headers with **expressly**.

