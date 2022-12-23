import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { autoBatchEnhancer } from '@reduxjs/toolkit';

function LandingPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        minHeight: '100vh',
      }}
    >
      <header
        style={{
          flex: 1,
          display: 'flex',
          textAlign: 'center',
          width: '100%',
        }}
      >
        {/* <Switch
          checked={theme === 'dark'}
          onChange={changeTheme}
          checkedChildren='Dark'
          unCheckedChildren='Light'
        /> */}
        <Navbar />
      </header>

      <main
        style={{
          flex: 10,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          height: 'auto',
          maxWidth: '60vw',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100vw',
            height: 'auto',
          }}
        >
          <aside style={{ flex: 3 }}>
            <div>aside</div>
          </aside>
          <article
            className='main-contents'
            style={{
              flex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '1040px',
            }}
          >
            main <Outlet></Outlet>
          </article>
          <aside style={{ flex: 3 }}>
            <div>aside</div>
          </aside>
        </div>
      </main>
      <footer style={{ display: 'flex', padding: '15px' }}>
        <Footer />
      </footer>
    </div>
  );
}

export default LandingPage;
