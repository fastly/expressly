// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes: { github: lightCodeTheme, nightOwl: darkCodeTheme} } = require("prism-react-renderer");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "expressly",
  tagline: "Express-style router for Fastly Compute",
  url: "https://expressly.edgecompute.app",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
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
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: "expressly",
        logo: {
          alt: "expressly Logo",
          src: 'img/logo.png',
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Docs",
          },
          {
            href: "https://developer.fastly.com/solutions/examples/javascript/",
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
                href: "https://developer.fastly.com/solutions/examples/javascript/",
              },
            ],
          },
          {
            title: "Compute",
            items: [
              {
                label: "Learn about Compute",
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
        copyright: `Copyright © ${new Date().getFullYear()} Fastly Inc. All rights reserved.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
