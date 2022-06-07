---
sidebar_position: 5
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

## Working with req.query

### append(name, value)
Appends a specified key/value pair as a new search parameter.

### delete(name)
Deletes a given search parameter, and its associated value, from the list of all search parameters.

### entries()
Returns an iterator through all key/value pairs in the same order as they appear in the query string.

### forEach()
Allows iteration through all query string parameters via a callback function.

### get(name)
Returns the first value associated with the given search parameter.

### getAll(name)
Returns all the values associated with a given search parameter.

### has(name)
Returns a boolean value indicating if such a parameter exists.

### keys()
Returns an iterator through all query string parameter keys.

### set(name, value)
Sets the value associated with a given search parameter to the given value. If there are several values, the others are deleted.

### sort()
Sorts all query string parameters, if any, by their name.

### toString()
Returns a serialized query string suitable for use in a URL.

### values()
Returns an iterator through all query string parameter values.
