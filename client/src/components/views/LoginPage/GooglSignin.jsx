import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFetch from './useFetch';
import { LoadingOutlined } from '@ant-design/icons';

const GooglSignin = () => {
  const { handleGoogle, loading, error } = useFetch('/api/user/googlesignin');
  const ClientId = process.env.REACT_APP_CLIENT_ID;

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_CLIENT_ID,
        callback: handleGoogle,
      });

      google.accounts.id.renderButton(document.getElementById('loginDiv'), {
        type: 'icon',
        theme: 'filled_black',
        // size: "small",
        text: 'signin_with',
        shape: 'pill',
      });

      // google.accounts.id.prompt()
    }
  }, [handleGoogle]);

  return (
    <>
      <main
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading ? <LoadingOutlined /> : <div id='loginDiv'></div>}
      </main>
      <footer></footer>
    </>
  );
};

export default GooglSignin;
