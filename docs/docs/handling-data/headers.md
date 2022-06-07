---
sidebar_position: 1
---

# Headers

**expressly** simplifies header manipulation on `Request` and `Response` objects.

> 🚨 **Unlike Express**, both `req.headers` and `res.headers` implement the standard [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) interface of the Fetch API. 

## Get header values

Use `.headers.get(name)` to retrieve the values of a HTTP header.

> 💡 **Header names are case-insensitive**!

```javascript
router.get("/", (req, res) => {
  res.json({
    userAgent: req.headers.get("user-agent"),
    host: req.headers.get("host"),
  });
});
```

The `.headers.entries` method returns an iterator for all header key/value pairs.

```javascript
// List all header names and values.
for (const [name, value] of req.headers.entries()) {
  console.log(`${name}: ${value}`);
}
```

If you need only the keys or values, use [`.headers.keys`](https://developer.mozilla.org/en-US/docs/Web/API/Headers/keys) or [`.headers.values`](https://developer.mozilla.org/en-US/docs/Web/API/Headers/values), respectively.

## Check if set

If you need to check whether a header is set, use `.headers.has(name)`:

```javascript
router.use((req, res) => {
  if (!req.headers.has("x-api-key")) {
    res.sendStatus(403);
  }
});
```

## Set headers

Set request or response headers by calling `headers.set(key, value)`.

```javascript
router.get("/", (req, res) => {
  res.headers.set("content-type", "text/html");
  res.send("<html><body><h1>This is HTML!</h1></body></html>");
});
```

## Append headers

Append to request or response headers by calling `.headers.append(key, value)`.

```javascript
router.get("/", (req, res) => {
  res.headers.append("set-cookie", "auth=token");
  res.headers.append("set-cookie", "user=me");
  res.send("Hello world!");
});
```

## Remove headers

Remove request or response headers by calling `.headers.delete(key)`.

```javascript
router.get("/", (req, res) => {
  req.headers.delete("x-api-key");
  // ...
});
```

## Aliases

### req/res.set

Aliased helpers to set HTTP header values. To set multiple fields at once, pass an object as the only parameter.

```javascript
res.set("content-type", "text/plain");

req.set({
  "x-api-key": "my-api-key",
  "x-debug": "1",
  "host": "example.com"
});
```

### req/res.append

Aliased helpers to append HTTP header values. To set multiple fields at once, pass an object as the only parameter. To append iteratively to a single header, pass an array of strings as its value.

```javascript
res.append("link", ["<http://localhost/>", "<http://localhost:3000/>"]);

req.append({
  "warning": "199 Miscellaneous warning",
  "x-forwarded-for": "example.com"
});
```
