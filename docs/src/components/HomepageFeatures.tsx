import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to use',
    description: (
      <>
        <strong>expressly</strong> was designed for JavaScript developers and inspired by the popular framework, <a href="https://expressjs.com/" target="_blank">Express</a>.
      </>
    ),
  },
  {
    title: 'Focus on what matters',
    description: (
      <>
        <strong>expressly</strong> lets you focus on your business logic, and makes it easier than ever to get started with <a href="https://www.fastly.com/products/edge-compute" target="_blank">Fastly Compute</a>.
      </>
    ),
  },
  {
    title: 'Open source',
    description: (
      <>
        Available for free to make the web a better place! Your contributions are welcomed and appreciated.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
