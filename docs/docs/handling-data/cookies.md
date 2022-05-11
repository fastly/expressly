---
sidebar_position: 2
---

# Cookies

## Get cookies

You can retrieve the cookies sent by the client by accessing the `req.cookies` object.

```javascript
router.get("/", (req, res) => {
    res.json({
        session: req.cookies["session"]
    })
})
```

## Set cookies

Setting cookies is done by calling `res.cookie(key, value)`.

```javascript
router.get("/", (req, res) => {
    res.cookie("session", "SESSION_TOKEN_HERE");

    res.send("Cookie set!")
})
```
