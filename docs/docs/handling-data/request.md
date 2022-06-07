---
sidebar_position: 1
title: Request
---

# The Request object

## Properties

* **url**: The [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) object corresponding to the request URL
* **query**: Request [query string parameters](search-params.md)
* **params**: An object containing properties mapped to any [named route "parameters"](../routing/advanced-routing.md#path-parameters)
* **cookies**: A Map containing [request cookies](cookies.md#request-cookies), if the [`parseCookie`](../config.md#parseCookie) configuration option is enabled
* **headers**: Request [headers](headers.md)

## Working with the request body

**expressly** can parse the body of a **req**uest in multiple ways.

### As plain text

```javascript
router.post("/submit", async (req, res) => {
    let body = await req.text();

    res.send(`You posted: "${body}"`)
})
```

### As JSON

```javascript
router.post("/submit", async (req, res) => {
    // Parse body as JSON
    let body = await req.json();

    // Check if the body contains the key "item"
    if ("item" in body) {
        res.send(`item: ${body.item}`)
    } else {
        res.send("You must include item in your body!")
    }
})
```

### As an ArrayBuffer

```javascript
router.post("/submit", async (req, res) => {
    // Parse body into an ArrayBuffer
    let body = await req.arrayBuffer();

    console.debug(body);
})
```

## Methods

### path()

Returns the path part of the request URL.

### ip()

Returns the remote IP address of the request.

### protocol()

Returns the request protocol string: either `http` or (for TLS requests) `https`.

### secure()

Returns a boolean value that is `true` if a TLS connection is established.

### subdomains()

Returns an array of subdomains in the domain name of the request.

### hostname()

Returns the hostname derived from the `Host` HTTP header.
