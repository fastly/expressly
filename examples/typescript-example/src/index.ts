import { Router } from "../../../dist/index.js";
import FPRequest from "../../../dist/lib/routing/request.js";
import FPResponse from "../../../dist/lib/routing/response.js";
import "@fastly/js-compute";

const router = new Router();

router.route("GET", "/", (req: FPRequest, res: FPResponse): any => {
  return res.send("Home");
});

router.get("/puppies", (req: FPRequest, res: FPResponse): any => {
  return res.send("You're at the puppy page!");
});

/**
 * Embed parameters in the path e.g. `:name` and access them in `req.params`
 */
router.post("/profile/:name", (req: FPRequest, res: FPResponse): any => {
  return res.send(`Hello ${req.params.name}!`);
});

/**
 * Match any path starting /assets/
 * ✅ /assets/logo.png
 * ✅ /assets/static/main.css
 * ❌ /assets
 * ❌ /static/assets/logo.png
 */
router.get("/assets/*", async (req: FPRequest, res: FPResponse): Promise<any> => {
  res.send("This is where assets are!");
});

/**
 * Match on "/page" and use the "id" search parameter
 * /page?id=42 -> "You are on page 42"
 * /page?id=-1337 -> "You are on page -1337"
 * /page -> "You are on page 0"
 */
router.get("/page", async (req: FPRequest, res: FPResponse): Promise<any> => {
  let pageId = Number(req.query.id) | 0;
  res.json({ message: `You are on page ${pageId}` });
});

/**
 * Redirect requests to a specific url
 */
router.get("/redirect", async (req: FPRequest, res: FPResponse): Promise<any> => {
  res.redirect("https://fastly.com");
});

/**
 * Get content from origin
 */
router.get("/origin", async (req: FPRequest, res: FPResponse): Promise<any> => {
  const originRequest = await fetch(
    "https://www.fastly.com/products/edge-compute/serverless",
    {
      backend: "my-origin",
    }
  );

  res.send(originRequest);
});

/**
 * Read post data
 */
router.post("/post", async (req: FPRequest, res: FPResponse): Promise<any> => {
  let body = {};

  try {
    await req.json();
  } catch (e) {
    body = {
      error: "Invalid JSON!"
    }
  }

  res.json(body);
});

/**
 * Match everything
 * For router.route(METHOD, PATH) you can pass a * for the method and path to match all possible requests
 * this works great as a 404 handler
 */
router.route("*", "*", (req: FPRequest, res: FPResponse): any => {
  res.status = 404;
  return res.send("Page not found!");
});

// Listen for requests
router.listen();
