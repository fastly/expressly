import { Router } from "../../../dist/index.js";

const router = new Router();

router.use((req, res) => {

  // Check if cookie is set for test
  if(!req.cookies.hasOwnProperty("abDarkMode") || req.cookies.abDarkMode === "") {
    const value = `${Math.random() > 0.5}`;

    // Set cookie on request object so it is available for this request
    req.cookies.abDarkMode = value;

    // Set cookie in browser
    res.cookie("abDarkMode", value, {
      maxAge: 60 * 60 // Keep cookie for 1 hour
    });
  }
})

router.get("/", (req, res) => {
  const classes = req.cookies.abDarkMode == "true" ? "text-white bg-dark" : "";
  
  res.send(`
  <html>
    <head>
      <title>Flight Path</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
    </head>
    <body class="m-5 ${classes}">
      <h1>Hello World!</h1>
      <hr />
      <p>This is a basic example of A/B testing at the edge.</p>
      <p>Dark mode test: ${req.cookies.abDarkMode}</p>
      <hr />
      <form method="POST" action="/clear-ab-test">
        <button type="submit" class="btn btn-primary">Reset A/B Test</button>
      </form>
    </body>
  </html>
  `);
});

router.post("/clear-ab-test", (req, res) => {
  res.cookie("abDarkMode", "");
  res.redirect("/");
})

router.listen();