---
sidebar_position: 1
---

# Headers

**expressly** simplifies header manipulation on `Request` and `Response` objects.

## Get headers

The `headers` property stores a map of request (or response) headers. 

> Note: **All header names are lowercase**

```javascript
router.get("/", (req, res) => {
    console.log(req.headers)
    res.json({
        userAgent: req.headers["user-agent"],
        host: req.headers["host"]
    })
})
```

## Set headers

Headers can be set by calling `.setHeader(key, value)`.

```javascript
router.get("/", (req, res) => {
    res.setHeader("content-type", "text/html");
    res.send("<html><body><h1>This is HTML!</h1></body></html>")
})
```

## Append headers

Append to headers by calling `.appendHeader(key, value)`.

```javascript
router.get("/", (req, res) => {
    res.appendHeader("vary", "my-custom-header")
    res.send("Hello world!")
})
```

## Remove headers

Remove headers by calling `.removeHeader(key)`.

```javascript
router.get("/", (req, res) => {
    res.removeHeader("x-api-key")
    res.send("Hello world!")
})
```
