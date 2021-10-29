import { Router } from "../../../dist/index.js";

const router = new Router();

/**
 * Add an x-powered-by header to every request
 */
router.use((req, res) => {
  res.setHeader("x-powered-by", "FlightPath");
});

/**
 * incremement the "visitiedcount" cookie on every request
 */
router.use((req, res) => {
  res.cookie("visitcount", (Number(req.cookies.visitcount) + 1) | 0, {
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  res.cookie("hello", "world");
});

router.route("GET", "/", (req, res) => { 
  return res.send("Welcome to the middleware example!");
});

router.listen();
