import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import classes from './index.module.scss';
import HomepageHeader from '../components/HomepageHeader';
import HomepageFeatures from '../components/HomepageFeatures';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="Discover" description={siteConfig.tagline}>
      <HomepageHeader />
      <div id="more" className={classes.annoucement}>
        Coming from <code>react-native-render-html</code> v4 or v5 ? Check out our{' '}
        <Link to="/docs/migration-guide">
          <strong>migration guide</strong>
        </Link>
        .
      </div>
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
