---
sidebar_position: 1
---

# Working with origins

Accessing data from origins is done via the standard Fetch API available in Compute@Edge. [Read more on developer.fastly.com.](https://developer.fastly.com/learning/compute/javascript/#communicating-with-backend-servers-and-the-fastly-cache)

## Performance

> 💡 The most efficient way of proxying data from your origin to the client is to ensure you do not consume the body in your code. 

Below, a `fetch()` request is made to an origin and the entire Response object passed through to `res.send()`. Doing this avoids reading the content of the response which saves processing time and memory.

```javascript
router.get("/origin", async (req, res) => {
  res.send(await fetch(
    "https://example.com", { backend: "my-origin" }
  ));
});
```

### `req` and `res`

`req` and `res` are compatible with anything that expects a `Request` or `Response`. It's therefore possible to pass `req` directly to `fetch()`, for example:

```javascript
router.get("/origin", async (req, res) => {
  res.send(await fetch(
    req, { backend: "my-origin" }
  ));
});
```

## Reading a response

If you need to read the body of a response, you can do so like this:

```javascript
router.get("/api", async (req, res) => {
  let originRequest = await fetch(
    "https://example.com", { backend: "my-origin" }
  );

  let body = await originRequest.text();

  res.send(`Body had a length of ${body.length}`);
});
```
