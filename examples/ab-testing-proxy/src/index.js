import { Router } from "../../../dist/index.js";

/**
 * In this demo we proxy requests to another origin but add cookies for AB testing.
 * You can add tests into the `tests` object below and they will be added via cookies.
 * 
 * This can be very useful for ab testing either on the client or server side.
 */

const router = new Router();

const tests = [
  {
    name: "A/B Test 1",
    cookieName: "ab-test-1",
    percentage: 50,
    activeValue: "A",
    inactiveValue: "B",
    cookieOpts: {
      path: "/",
    },
  },
  {
    name: "A/B Test 2",
    cookieName: "ab-test-2",
    percentage: 20,
    activeValue: "A",
    inactiveValue: "B",
    cookieOpts: {
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    },
  },
];

// On every request we make sure the user is a part of all tests
router.use((req, res) => {
  tests.map((test) => {
    // Only set cookie if it is not already set
    if (!(test.cookieName in req.cookies)) {
      let selectedValue =
        Math.random() < test.percentage / 100
          ? test.activeValue
          : test.inactiveValue;

      req.cookies[test.cookieName] = selectedValue;
      res.cookie(test.cookieName, selectedValue, test.cookieOpts);
    }
  });
});

const originHostname = "httpbin.org";

router.all("*", async (req, res) => {
  // Change the hostname of the url to our origin
  req.url.host = originHostname;

  // remove port, defaulting to 443 or 80 depending on protocol.
  req.url.port = "";

  // Change Host header to the correct one for our origin
  req.setHeader("host", originHostname);

  // Make a request to the origin
  let originRequest = await fetch(req.url.toString(), {
    backend: "main_origin",
    headers: req.headers,
    method: req.method,
    body: await req.text(),
  });

  // Send response
  res.send(originRequest);
});

router.listen();
