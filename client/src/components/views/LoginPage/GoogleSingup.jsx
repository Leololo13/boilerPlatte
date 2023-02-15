import React from 'react';
import { useEffect } from 'react';
import useFetch from './useFetch';
import { useState } from 'react';

const GoogleSingup = () => {
  const { handleGoogle, loading, error } = useFetch('/api/user/googlesignup');
  const ClientId = process.env.REACT_APP_CLIENT_ID;

  useEffect(() => {
    if (window.google) {
      console.log('구글 로긴 진행');
      window.google.accounts.id.initialize({
        client_id: ClientId,
        callback: handleGoogle,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('signUpDiv'),
        {
          type: 'icon',
          theme: 'filled_blue',
          //size: 'small',
          text: 'continue_with',
          shape: 'pill',
        }
      );
      // window.google.accounts.id.prompt();
    }
  }, [handleGoogle]);

  return (
    <>
      {/* <nav style={{ padding: '2rem' }}>
        <Link to='/'>Go Back</Link>
      </nav>
      <header style={{ textAlign: 'center' }}>
        <h1>Register to continue</h1>
      </header> */}
      <main
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading ? (
          <div>Loading....</div>
        ) : (
          <div id='signUpDiv' data-text='구글로 가입하기'></div>
        )}
      </main>
      <footer></footer>
    </>
  );
};

export default GoogleSingup;
