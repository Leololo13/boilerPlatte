import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Outlet, useOutlet } from 'react-router-dom';
import Main from '../Main/Main';
import './Landingpage.css';
import NaverSignin from '../LoginPage/NaverSignin';

function LandingPage(props) {
  const outlet = useOutlet();
  console.log(props, 'landingpage Props');

  return (
    <div className='landingpage'>
      <header className='landingpage-header'>
        {/* <Switch
          checked={theme === 'dark'}
          onChange={changeTheme}
          checkedChildren='Dark'
          unCheckedChildren='Light'
        /> */}
        <Navbar {...props} />
      </header>

      <main className='landingpage-main'>
        <div
          className='landingpage-main-main'
          // style={{
          //   display: 'flex',
          //   width: '100vw',
          //   height: 'auto',
          // }}
        >
          <aside>
            <div>
              asaide <NaverSignin />
            </div>
          </aside>
          <article className='landingpage-main-content'>{outlet ? <Outlet /> : <Main />}</article>
          <aside>
            <div>aside</div>
          </aside>
        </div>
      </main>
      <footer className='landingpage-footer'>
        <Footer />
      </footer>
    </div>
  );
}

export default LandingPage;
