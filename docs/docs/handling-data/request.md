---
sidebar_position: 1
title: Request
---

# The Request object

## Properties

### req.url
A string containing the request URL.

### req.urlObj
The [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) object corresponding to the request URL.

### req.query
Request [query string parameters](search-params.md).

### req.params
An object containing properties mapped to any [named route "parameters"](../routing#path-parameters), if the [`extractRequestParameters`](../config.md#extractRequestParameters) configuration option is enabled.

### req.cookies
A Map containing [request cookies](cookies.md#request-cookies), if the [`parseCookie`](../config.md#parseCookie) configuration option is enabled.

### req.headers
Request [headers](headers.md).

### req.path
The path part of the request URL.

### req.ip
The remote IP address of the request

### req.protocol
The request protocol string: either `http` or (for TLS requests) `https`.

### req.secure
A boolean value that is `true` if a TLS connection is established.

### req.subdomains
An array of subdomains in the domain name of the request.

### req.hostname
The hostname derived from the `Host` HTTP header.

### req.geo 
A geolocation dictionary corresponding to the IP address of the downstream client.

## Methods

### req.waitUntil()
Tells the host environment that work is ongoing until the promise settles, and it shouldn't terminate the application if it wants that work to complete.

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
