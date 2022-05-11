import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";
import HomepageFeatures from "../components/HomepageFeatures";
import SyntaxHighlighter from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/esm/styles/prism";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        {/* <h1 className="hero__title">{siteConfig.title}</h1> */}
        <img src="/img/logo.jpeg" className="hero-logo" />
        <p className={clsx("hero__subtitle", styles.heroSubtitle)}>
          {siteConfig.tagline}
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const exampleCode = `import { Router } from "@fastly/expressly";

const router = new Router();

router.use((req, res) => {
  res.setHeader("x-powered-by", "expressly");
});

router.get("/", async (req, res) => {
  return res.send("Hello world!");
});

router.get("/api", async (req, res) => {
  return res.json({
    message: "Hello from the API!"
  });
});

router.listen();`;

  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Routing for C@E`}
      description="Express-style router for Fastly Compute@Edge"
    >
      <HomepageHeader />
      <main>
        <br />

        <div className="container">
          <div className="row">
            <div className={clsx("col col--6", styles.description)}>
                <div>
                  <h2>Dont waste time on boilerplate code, use Flight Path</h2>
                  <p>
                    <strong>expressly</strong> is a lightweight and minimal routing layer for
                    C@E apps. Add <strong>expressly</strong> to any Javascript Compute@Edge app by
                    install with NPM: <code>npm i flight-path</code>
                  </p>
                </div>
            </div>
            <div className="col col--6">
              <SyntaxHighlighter
                language="javascript"
                style={github}
                showLineNumbers={true}
              >
                {exampleCode}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>

        <hr />

        <HomepageFeatures />
      </main>
    </Layout>
  );
}
