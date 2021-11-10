import { Router, Fetcher } from "../../../dist/index.js";

// Create router object for binding routes to.
const router = new Router();

// Add middleware for all routes
router.use((req, res) => {
  
  // Add a header to the response
  res.setHeader("x-powered-by", "Fastly C@E - Flight Path");

  // Set abtest cookie if it isn not already set
  if(!("abtest" in req.cookies)) {
    let value = Math.random() > 0.5 ? "a" : "b"; // 50% chance of being "a" or "b"
    res.cookie("abtest", value);
    req.cookies.abtest = value;
  }
});

// Bind to GET requests on /
router.get("/", async (req,res) => {

  // Fetch data from our micro frontends
  const fetcher = new Fetcher({
    header: {
      url: "https://content-stitching-header.edgecompute.app/",
      backend: "header_service"   // Backends configured in fastly.toml
    },
    body: {
      url: "https://content-stitching-page.edgecompute.app/",
      backend: "page_service",    // Backends configured in fastly.toml
      cache: new CacheOverride("override", {
        ttl: 60
      })
    }
  })

  // Wait for fetch to complete
  let content = await fetcher.fetch();

  // Pick classes based on abtest cookie
  // This this test we are using the abtest cookie to determine if the user is in "Dark Mode" or not.
  let classes = req.cookies.abtest == "b" ? "bg-dark text-white" : "";
  
  res.setHeader("Content-Type", "text/html");

  // Render HTML
  res.send(`
    <!DOCTYPE html>
      <head>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
      </head>
      <body class="${classes}">
        ${content.header.data}
        <hr/>
        ${content.body.data}
      </body>
    </html>
  `)
});

// Finally, have Flight Path handle requests by calling .listen() on the router.
router.listen();