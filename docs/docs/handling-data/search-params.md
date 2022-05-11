---
sidebar_position: 3
---

# Query strings

Search (query string) parameters can be accessed in the `req.query` object.

## Get the value of a search paramater

```javascript
router.get("/page", (req, res) => {
    if ("id" in req.query) {
        res.send(`Your page id is: ${req.query.id}`)
    } else {
        res.send("You didnt supply an id! Add one like this: /page?id=123")
    }
})
```
