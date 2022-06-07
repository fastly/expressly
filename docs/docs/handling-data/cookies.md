---
sidebar_position: 2
---

# Cookies

## Request cookies

You can retrieve the cookies sent by the client by accessing the `req.cookies` object, which implements the [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) interface.

```javascript
router.get("/", (req, res) => {
    res.json({
        session: req.cookies.get("session")
    })
})
```

The `req.cookies.entries` method returns an iterator for all cookie key/value pairs.

```javascript
// List all cookie names and values.
for (const [name, value] of req.cookies.entries()) {
  console.log(`${name}=${value}`);
}
```

If you need only the keys or values, use `req.cookies.keys()` or `req.cookies.values()`, respectively.

Use `req.cookies.delete(name)` to delete a cookie:

```javascript
router.get("/", (req, res) => {
    req.cookies.delete("auth");
    const beresp = await fetch(req, { backend: "my-origin" });
    // ...
})
```

## Response cookies

Setting response cookies is done by calling `res.cookie(key, value[, options])`.

```javascript
router.get("/", (req, res) => {
    res.cookie("user", "me");
    res.cookie("auth", "AUTH_TOKEN_HERE", { maxAge: 3600, path: "/" })
    res.send("Cookie set!")
})
```

Calling `res.clearCookie(key[, options])` will expire a response cookie:

```javascript
router.get("/", (req, res) => {
    res.clearCookie("auth", { path: "/" })
    res.send("Cookie expired!")
})
```

### Options

`res.cookie` accepts the following properties in the `options` object:

#### [domain](https://tools.ietf.org/html/rfc6265#section-5.2.3)

Specifies the `string` value for the `Domain` attribute. By default, no domain is set, and most clients will consider the cookie to apply to only the current domain.

#### [expires](https://tools.ietf.org/html/rfc6265#section-5.2.1)

A `Date` object or `string` that determines the value for the `Expires` attribute. By default, this is not set, and most clients will consider this a "non-persistent cookie".

> **Note:** The [cookie storage model specification](https://tools.ietf.org/html/rfc6265#section-5.3) states that if both `expires` and
`maxAge` are set, then `maxAge` takes precedence.

#### [maxAge](https://tools.ietf.org/html/rfc6265#section-5.2.2)

A `number` (in seconds) that determines the value for the `Max-Age` attribute. By default, no maximum cookie age is set.

#### [httpOnly](https://tools.ietf.org/html/rfc6265#section-5.2.6)

A `boolean` value. When truthy, the `HttpOnly` attribute is set, otherwise it is not. By default, the `HttpOnly` attribute is not set.

#### [path](https://tools.ietf.org/html/rfc6265#section-5.2.4)

Specifies the `string` value for the `Path` attribute. 

#### [sameSite](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis-09#section-5.4.7)

Specifies the `boolean` or `string` value for the `SameSite` attribute:

  - `true` will set the `SameSite` attribute to `Strict` for strict same site enforcement.
  - `false` will not set the `SameSite` attribute.
  - `'lax'` will set the `SameSite` attribute to `Lax` for lax same site enforcement.
  - `'none'` will set the `SameSite` attribute to `None` for an explicit cross-site cookie.
  - `'strict'` will set the `SameSite` attribute to `Strict` for strict same site enforcement.

> **Note:** This is an attribute that has not yet been fully standardized, and may change in the future.
This also means many clients may ignore this attribute until they understand it.

#### [secure](https://tools.ietf.org/html/rfc6265#section-5.2.5)

Specifies the `boolean` value for the `Secure` attribute. When truthy, the `Secure` attribute is set, otherwise it is not. By default, the `Secure` attribute is not set.
