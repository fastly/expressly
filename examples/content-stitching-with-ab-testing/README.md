# Compute@Edge starter kit for JavaScript

Experiment with running JavaScript in the Fastly Compute@Edge environment with a basic starter that demonstrates rudimentary request handling.

**For more details about other starter kits for Compute@Edge, see the [Fastly developer hub](https://developer.fastly.com/solutions/starters)**

## Features

* Handling incoming requests via a handler for the `fetch` event
* Getting the incoming request via `event.request`
* Basic handling of requests, including
  * reading headers and request bodies using `request.text()`, `request.arrayBuffer()`, `request.json()`
  * reading request headers using `request.headers`
* Setting response bodies via the `Response` constructor (but not the `body` setter)
* Setting response headers via the `Response#headers` getter
* Sending async upstream requests using `fetch(request, { backend: "backend_name" })`
* Reading values from Edge Dictionaries using the `Dictionary` builtin
* Getting the client's IP address via `event.client.address`
* Getting the client's geolocation data via `event.client.geo`
* Getting geolocation data for any IP address via `getGeolocationForIpAddress`

## Understanding the code

The code in `src/index.js` registers a handler for the `fetch` event that takes an event object with the downstream request as a `request` property, and shows how to read the URL, request body and headers, and send a response.

The template uses webpack to bundle `index.js` and its imports into a single JS file, `bin/index.js`, which is then wrapped into a `.wasm` file, `bin/index.wasm` using the `js-compute-runtime` CLI tool bundled with the `@fastly/js-compute` npm package, and bundled into a `.tar.gz` file ready for deployment to Compute@Edge.

After deployment, your Compute@Edge service will simply return an iframe with instructions on how to get started with C@E. For more complex examples of what can be done within a Compute@Edge program, see the [usage guide for JavaScript](https://developer.fastly.com/learning/compute/javascript) or our library of [code examples](https://developer.fastly.com/solutions/examples).

## Security issues

Please see our [SECURITY.md](SECURITY.md) for guidance on reporting security-related issues.
