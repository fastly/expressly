---
sidebar_position: 1
---

# Getting started

Discover **expressly** _in less than 5 minutes_.

---

First, head over to [developer.fastly.com](https://developer.fastly.com) to get started with JavaScript on Fastly's Compute@Edge:

1. Learn about Compute@Edge: [developer.fastly.com/learning/compute/](https://developer.fastly.com/learning/compute/)
2. Create your first JavaScript app: [developer.fastly.com/learning/compute/javascript/](https://developer.fastly.com/learning/compute/javascript/)

## Install expressly

Install expressly from the [npm registry](https://www.npmjs.com/package/@fastly/expresly):

```shell
npm i @fastly/expressly
```

```shell
yarn add @fastly/expressly
```

## Your first expressly app

Replace the contents of your Compute@Edge app's `src/index.js` with the following:

```javascript
import { Router } from "@fastly/expressly";

const router = new Router();

router.get("/", async (req, res) => {
  return res.send("Hello world!");
});

router.listen();
```

## Try it out

Start your app locally:

```shell
fastly compute serve
```

This will start your service on [http://localhost:7676](http://localhost:7676).

### Live reloading

You can use a tool called [`nodemon`](https://www.npmjs.com/package/nodemon) to automatically reload your app when you make a change in your local development environment.

```shell
npx nodemon --exec \
  "npm run build && fastly compute serve --skip-build"
```
