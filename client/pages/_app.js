import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import fetch from 'isomorphic-unfetch';

import { Layout } from '../components/_base/Layout';

class MyApp extends App {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.
  //
  // static async getInitialProps(appContext) {
  //   // calls page's `getInitialProps` and fills `appProps.pageProps`
  //   const appProps = await App.getInitialProps(appContext);
  //
  //   return { ...appProps }
  // }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const httpLink = createHttpLink({
      uri: 'http://localhost:5000',
      fetch: fetch
    });
    const client = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache()
    });
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>Nexus</title>
        </Head>
        <ApolloProvider client={client}>
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </>
    );
  }
}

export default MyApp;
