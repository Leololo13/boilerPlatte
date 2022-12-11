import React from 'react';
import { useEffect } from 'react';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';

const LandingPage = () => {
  return (
    <>
      <header style={{ height: '8vh' }}>
        <Navbar></Navbar>
      </header>
      <div className='mainbox'>
        <aside>qaaa</aside>
        <main style={{ height: '80vh' }}>ass</main>
      </div>

      <footer style={{ height: '20px' }}>
        <Footer></Footer>
      </footer>
    </>
  );
};

export default LandingPage;
