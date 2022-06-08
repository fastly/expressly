---
sidebar_position: 1
title: Request
---

# The Request object

## Properties

* **url**: The [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) object corresponding to the request URL
* **query**: Request [query string parameters](search-params.md)
* **params**: An object containing properties mapped to any [named route "parameters"](../routing#path-parameters), if the [`extractRequestParameters`](../config.md#extractRequestParameters) configuration option is enabled
* **cookies**: A Map containing [request cookies](cookies.md#request-cookies), if the [`parseCookie`](../config.md#parseCookie) configuration option is enabled
* **headers**: Request [headers](headers.md)
* **path**: The path part of the request URL
* **ip**: The remote IP address of the request
* **protocol**: The request protocol string: either `http` or (for TLS requests) `https`.
* **secure**: A boolean value that is `true` if a TLS connection is established.
* **subdomains**: An array of subdomains in the domain name of the request.
* **hostname**: The hostname derived from the `Host` HTTP header.

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
