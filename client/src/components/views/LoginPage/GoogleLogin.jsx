import React, { useState } from 'react';
import { useEffect } from 'react';
import useFetch from './useFetch';
import { gapi } from 'gapi-script';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLogins = () => {
  const [profile, setProfile] = useState([]);
  const { handleGoogle, loading, error } = useFetch('/api/user/login');
  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
      console.log('성공?');
      const tokens = await axios.post('/api/user/googlelogin', {
        // http://localhost:3001/auth/google backend that will exchange the code
        code,
      });
      const userInfo = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokens.data.access_token}` },
        })
        .then((res) => res.data);

      console.log(userInfo);
      console.log(tokens);
    },

    // fetching userinfo can be done on the client or the server

    flow: 'auth-code',
  });
  const ClientId = process.env.REACT_APP_CLIENT_ID;

  return (
    <div>
      <button onClick={login}>클릭</button>
    </div>
  );
};

export default GoogleLogins;
