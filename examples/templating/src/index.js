import { Router } from "../../../dist/index.js";

const router = new Router({
  templatesDir: "templates",
});

/**
 * Add an x-powered-by header to every request
 */
router.use((req, res) => {
  res.setHeader("x-powered-by", "FlightPath");
});

/**
 * Render index page using Mustache (https://github.com/janl/mustache.js)
 */
router.route("GET", "/", (req, res) => {
  return res.render("home", {
    title: "Home Page!",
    framework: "FlightPath",
    bold: function () {
      return function (text, render) {
        return "<b>" + render(text) + "</b>";
      };
    },
  });
});

/**
 * Render about page
 */
router.route("GET", "/about", (req, res) => {
  return res.render("about", {
    title: "About Page",
    segments: [
      {
        name: "First Thing",
        description: "This is the first thing",
      },
      {
        name: "Second Thing",
        description: "This is the second thing",
      },
    ],
    time: () => {
      return new Date().toISOString();
    },
  });
});

router.listen();
