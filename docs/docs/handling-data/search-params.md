---
sidebar_position: 3
---

# Query strings

Search (query string) parameters can be accessed in the `req.query` object, which implements the [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) interface.

## Get the value of a search paramater

```javascript
router.get("/page", (req, res) => {
    if (req.query.has("id")) {
        res.send(`Your page id is: ${req.query.get("id")}`)
    } else {
        res.send("You didnt supply an id! Add one like this: /page?id=123")
    }
})
```

## Working with query string parameters

### req.query.append(name, value)
Appends a specified key/value pair as a new search parameter.

### req.query.delete(name)
Deletes a given search parameter, and its associated value, from the list of all search parameters.

### req.query.entries()
Returns an iterator through all key/value pairs in the same order as they appear in the query string.

### req.query.forEach()
Allows iteration through all query string parameters via a callback function.

### req.query.get(name)
Returns the first value associated with the given search parameter.

### req.query.getAll(name)
Returns all the values associated with a given search parameter.

### req.query.has(name)
Returns a boolean value indicating if such a parameter exists.

### req.query.keys()
Returns an iterator through all query string parameter keys.

### req.query.set(name, value)
Sets the value associated with a given search parameter to the given value. If there are several values, the others are deleted.

### req.query.sort()
Sorts all query string parameters, if any, by their name.

### req.query.toString()
Returns a serialized query string suitable for use in a URL.

### req.query.values()
Returns an iterator through all query string parameter values.
