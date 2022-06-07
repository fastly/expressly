import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";
import HomepageFeatures from "../components/HomepageFeatures";
import CodeBlock from '@theme/CodeBlock';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
       
        <img src="/img/logo.png" className="hero-logo" />
        <h1 className={clsx("hero__title", styles.heroTitle)}>{siteConfig.title}</h1> 
        <p className={clsx("hero__subtitle", styles.heroSubtitle)}>
          {siteConfig.tagline}
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            GET STARTED
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
                <h2>Don't waste time on boilerplate code</h2>
                <p>
                  <strong>expressly</strong> is a lightweight and minimalist routing layer for
                  JavaScript apps running on Fastly's Compute@Edge.
                </p>
                <p>
                  <dl>
                    <dt>Install <strong>expressly</strong> from <a href="https://www.npmjs.com/package/@fastly/expresly" target="_blank">npm</a>:</dt>
                    <dd>
                      <CodeBlock
                        language="shell"
                        showLineNumbers={false}
                      >
                        npm i @fastly/expressly
                      </CodeBlock>
                    </dd>
                    <dd>
                      <CodeBlock
                        language="shell"
                      
                        showLineNumbers={false}
                      >
                        yarn add @fastly/expressly
                      </CodeBlock>
                    </dd>
                  </dl>
                </p>
              </div>
            </div>
            <div className="col col--6">
              <CodeBlock
                language="javascript"
                showLineNumbers={true}
              >
                {exampleCode}
              </CodeBlock>
            </div>
          </div>
        </div>

        <hr />

        <HomepageFeatures />
      </main>
    </Layout>
  );
}
