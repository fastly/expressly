---
sidebar_position: 5
---

# Query strings

Search (query string) parameters can be accessed in the `req.query` object, which implements the [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) interface.

## Get the value of a search parameter

Use `req.query.get(key)` to get the first value associated with a given search parameter. If you need to check whether a parameter is set, use `*.query.has(name)`:

```javascript
router.get("/page", (req, res) => {
  if (req.query.has("id")) {
    res.send(`Your page id is: ${req.query.get("id")}`)
  } else {
    res.send("No id! Add one like this: /page?id=123")
  }
})
```

> 💡 You can use `req.query.getAll(key)` to get all the values of query string array.

## Listing search parameters

Use `req.query.entries()` method to iterate through all key/value pairs in the same order as they appear in the query string.

```javascript
for (const [key, value] of req.query.entries()) {
    console.log(`Query parameter: ${key}`, value);
}
```

If you need only the keys or values, use `req.query.keys()` or `req.query.values()`, respectively.

## Manipulating query strings

`req.query` is a [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) object. You can use a bunch of utility methods to work with query parameters:

* **req.query.set(name, value)** sets the value of a given search parameter.
* **req.query.append(name, value)** appends a new search parameter.
* **req.query.delete(name)** removes a search parameter and its value(s).
* **req.query.sort()** sorts all query string parameters by name.
* **req.query.toString()** returns a serialized query string suitable for use in a URL.
