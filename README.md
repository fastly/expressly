# expressly
Express-style router for Fastly Compute.

## Using expressly

[Check out the docs](https://expressly.edgecompute.app/).

---

First, head over to [developer.fastly.com](https://developer.fastly.com) to get started with JavaScript on Fastly Compute:

1. Learn about Fastly Compute: [developer.fastly.com/learning/compute/](https://developer.fastly.com/learning/compute/)
2. Create your first JavaScript app: [developer.fastly.com/learning/compute/javascript/](https://developer.fastly.com/learning/compute/javascript/)

### Install expressly

Install expressly from the [npm registry](https://www.npmjs.com/package/@fastly/expressly):

```shell
npm i @fastly/expressly
```

```shell
yarn add @fastly/expressly
```

### Your first expressly app

Replace the contents of your Compute app's `src/index.js` with the following:

```javascript
import { Router } from "@fastly/expressly";

const router = new Router();

router.get("/", async (req, res) => {
  return res.send("Hello world!");
});

router.listen();
```

### Try it out

Start your app locally:

```shell
fastly compute serve
```

This will start your service on [http://localhost:7676](http://localhost:7676).

## Examples

Check out the JavaScript code examples for Compute on Fastly's [Developer Hub](https://developer.fastly.com/solutions/examples/javascript/).
