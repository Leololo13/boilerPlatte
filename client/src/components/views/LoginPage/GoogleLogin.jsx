import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { GoogleOutlined } from '@ant-design/icons';

const GoogleLogins = () => {
  const [profile, setProfile] = useState([]);
  const login = useGoogleLogin({
    ///토큰을 받음=>
    ///토큰으로 구글서버에서 정보를 가져옴.
    //근데 서버에 이미 가입을해서 아이디랑 이메일이 있음. 비번은 어차피 구글로그인이라 ㄱㅊ
    ///userInfo의 email만가지고 그냥 token나오면 user정보 가져오면될듯
    //중요한건 정보가져오기임
    //정보를 가져옴. 이걸 어떻게 user에 저장할것인가?
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
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      // fetching userinfo can be done on the client or the server
      const userInfo = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then((res) => {
          console.log(res.data);
          return res.data;
        });

      console.log(userInfo);
    },
    // flow: 'implicit', // implicit is the default
  });
  const ClientId = process.env.REACT_APP_CLIENT_ID;

  return (
    <div className='googleLogin'>
      <button onClick={login}>
        <GoogleOutlined />
        구글 로그인하기
      </button>
    </div>
  );
};

export default GoogleLogins;
