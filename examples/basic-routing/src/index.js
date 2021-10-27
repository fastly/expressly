import { Router } from "../../../dist/index.js";

const router = new Router();

router.route("GET", "/", (req, res) => {
  return res.send("Home");
});

router.get("/puppies", async (req, res) => {
  res.headers.set("x-testing", "It works!");
  return res.send("You're at the puppy page!");
});

router.get("/greeting/:name", async (req, res) => {
  return res.send(`Hello ${req.params.name}!`);
});

router.get("/assets/*", async (req, res) => {
  return res.send("This is where the assets would be!");
});

/**
 * This must be last! Catch anything we dont handle and return a 404
 */
router.route("*", "*", (req, res) => {
  res.status = 404;
  return res.send("Page not found!");
});

router.listen();
