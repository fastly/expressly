import { Router, Fetcher } from "../../../dist/index.js";

const router = new Router();

router.get("*", async (req, res) => {
  const fetcher = new Fetcher({
    header: {
      url: "https://content-stitching-header.edgecompute.app/",
      backend: "header_service"
    },
    page: {
      url: "https://content-stitching-page.edgecompute.app/",
      backend: "page_service"
    }
  })

  let data = await fetcher.fetch();

  res.send(`
    <html>
      <head>
        <title>Content Stitching</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
      </head>
      <body>
        ${data.header.data}
        <hr />
        ${data.page.data}
      </body>
    </html>
  `)
});

// Listen for requests
router.listen();
