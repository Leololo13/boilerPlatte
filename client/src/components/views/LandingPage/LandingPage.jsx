import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

function LandingPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
        overflowY: 'scroll',
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
          flex: 20,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100vw',
            height: '100%',
          }}
        >
          <aside style={{ flex: 1 }}>
            <div>aside</div>
          </aside>
          <div
            className='main-contents'
            style={{
              flex: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'aqua',
            }}
          >
            main <Outlet></Outlet>
          </div>
          <aside style={{ flex: 1 }}>
            <div>aside</div>
          </aside>
        </div>
      </main>
      <footer style={{ flex: 1 }}>
        <Footer />
      </footer>
    </div>
  );
}

export default LandingPage;
