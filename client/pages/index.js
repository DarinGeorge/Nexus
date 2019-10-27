import React from 'react';
import Head from 'next/head';
import Nav from '../components/nav';

const Home = () => (
  <div>
    <Head>
      <title>Home</title>
      <link rel='icon' href='/favicon.ico' />
    </Head>

    <Nav />

    <div className='hero'>
      <h1 className='title'>Nexus</h1>
      <p className='description'>A Bleeding-Edge Social Network.</p>
    </div>
  </div>
);

export default Home;
