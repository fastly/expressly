import { Router } from "../../../dist/index.js";
import * as jws from "jws";

const router = new Router();

let secret = null;
const getJwtSecret = () => {
  if(secret !== null) {
    return secret;
  }

  const dict = new Dictionary("config");
  secret = dict.get("secret");
  return secret;
}

/**
 * JWT authentication middleware
 */
router.use(async (req, res) => {

  // Get JWT token from cookie
  let jwt = req.cookies.jwt;

  // If the user is not on the login page, check if the user is logged in
  if (req.url.pathname !== "/login") {
    if (!jwt) {
      res.redirect("/login");
      return;
    }

    // Validate JWT token
    let isValid = await jws.verify(jwt, "HS256", getJwtSecret());

    // If the token is not valid, redirect to login page
    if(!isValid){
      console.log("Got invalid jwt!");
      res.redirect("/login");
      return;
    }

    // If the token is valid, set the session on the request
    try {
      req.session = JSON.parse((await jws.decode(jwt, "HS256", getJwtSecret())).payload);
    } catch (e) {
      console.log("Got invalid jwt!");
      res.redirect("/login");
      return;
    }
  }
});

router.route("GET", "/login", (req, res) => {
  return res.send("Welcome to the login page");
});

/**
 * Login endpoint
 * Creates the JWT token and stores it in the cookie
 * and then redirects to the home page
 */
router.route("POST", "/login", async (req, res) => {
  /**
   * Read post body for username
   */
  let body = null;

  try {
    body = JSON.parse(await req.text());
  }catch(e){
    res.status = 400;
    return res.send("Invalid JSON in login post body");
  }

  // If the username is not set correctly, return an error
  if(typeof body !== "object" || !body.hasOwnProperty("username") || typeof body.username !== "string") {
    res.status = 400;
    return res.send("your must include a 'username' property in the login post body");
  }

  const username = body.username;

  // Create JWT token
  const token = jws.sign({
    header: { alg: "HS256" },
    payload: {
      name: username,
    },
    secret: getJwtSecret(),
  });

  // Set the cookie
  res.cookie("jwt", token);

  // Redirect to home page now we are logged in
  return res.redirect("/");
});

/**
 * This route is only accessible if the user is logged in
 * because the middleware above will redirect to the login page
 * if the user is not logged in
 */
router.all("*", async (req, res) => {
  console.log(JSON.stringify(req.session));
  res.send(`Welcome! You are authenticated ${req.session.name}!`);
});

// Listen for requests
router.listen();
