// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "expressly",
  tagline: "Express-style router for Fastly's Compute@Edge",
  url: "https://flight-path.edgecompute.app",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/logo.jpeg",
  organizationName: "fastly", 
  projectName: "expressly", 

  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          sidebarCollapsed: false,
          editUrl: 'https://github.com/fastly/expressly/edit/main/docs/',
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "expressly",
        logo: {
          alt: "expressly Logo",
          src: "img/logo-black.png",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Docs",
          },
          {
            href: "https://github.com/fastly/expressly/tree/main/examples",
            label: "Examples",
            position: "left",
          },
          {
            href: "https://github.com/fastly/expressly",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "expressly",
            items: [
              {
                label: "Documentation",
                to: "/docs/intro",
              },
              {
                label: "Examples",
                href: "https://github.com/fastly/expressly/tree/main/examples",
              },
            ],
          },
          {
            title: "Compute@Edge",
            items: [
              {
                label: "Learn about Compute@Edge",
                href: "https://developer.fastly.com/learning/compute/",
              },
              {
                label: "Create your first JavaScript app",
                href: "https://developer.fastly.com/learning/compute/javascript/",
              },
              {
                label: "Fastly Developer Hub",
                href: "https://developer.fastly.com/",
              },
            ],
          },
          {
            title: "Fastly",
            items: [
              {
                label: "Twitter",
                href: "https://twitter.com/fastly",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Fastly`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
