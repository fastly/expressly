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
> 💡 If the _experimental_ [`autoContentType`](../config.md#parseCookie) configuration option is enabled, `res.send` will try to [infer the `Content-Type` header](https://expressjs.com/en/4x/api.html#res.send) from the data it is passed, if the header is not set.

## res.end()

Use to quickly end the response without any data. If you need to respond with data, instead use methods such as [`res.send()`](#ressend) or [`res.json()`](#resjson).

```javascript
router.get('/', (req, res) => {
  res.end();
});
```

## res.sendStatus()

Sets the response HTTP status code to statusCode and sends the registered status message as the text response body.

```javascript
router.get('/', (req, res) => {
  res.sendStatus(403); // "Forbidden"
});
```

## res.redirect()

When you want to redirect the user to another page, you can use the `res.redirect()` method. It will set a redirect status code and set the `Location` header to the URL you want to redirect to.

```javascript
router.get('/', function(req, res) {
  res.redirect('/about');
});
```
> 💡 This method accepts a second, optional argument – the redirect status code (defaults to `302`).

```javascript
router.get("/redirect", async (req, res) => {
  res.redirect("https://fastly.com", 307);
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


## Cookies

[Read how to](../handling-data/cookies.md#response-cookies) set and expire response cookies.

## Cache segmentation

### res.vary()

Appends a field to the `Vary` response header.

```javascript
res.vary("x-feature-flags");
```

### res.surrogateKeys

**expressly** exposes `res.surrogateKeys`, a [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) object that allows you to manipulate the [`Surrogate-Key` header](https://docs.fastly.com/en/guides/working-with-surrogate-keys#understanding-the-surrogate-key-header).


```javascript
res.surrogateKeys.add("seasonal");
res.surrogateKeys.add("vegan");
res.surrogateKeys.delete("low-carb");

// List all surrogate keys
for (const key of res.surrogateKeys) {
  console.log(key);
}
```

