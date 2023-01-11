import React from 'react';
import { useEffect } from 'react';
import useFetch from './useFetch';
import { gapi } from 'gapi-script';
import { useState } from 'react';

const GoogleSingup = () => {
  const [profile, setProfile] = useState([]);
  const { handleGoogle, loading, error } = useFetch('/api/user/googleregister');
  const ClientId = process.env.REACT_APP_CLIENT_ID;

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: ClientId,
        callback: handleGoogle,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('signUpDiv'),
        {
          type: 'standard',
          theme: 'filled_black',
          //size: 'small',
          text: 'signup_with',
          shape: 'pill',
        }
      );
      window.google.accounts.id.prompt();
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
