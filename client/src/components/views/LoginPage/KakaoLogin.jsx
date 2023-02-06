import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import useFetch from './useFetch';

const KakaoLogin = () => {
  const [token, setToken] = useState('');
  function kakaoLoginHnadler() {
    if (!window.Kakao.isInitialized()) {
      console.log('카카오로그인 준비');
      window.Kakao.init('b18ca2d74f4a17d6908f33d9c4958961');

      window.Kakao.Auth.authorize({
        redirectUri: 'http://localhost:3000/kakao/oauth',
      });
    }
  }
  function getCookie(name) {
    let parts = document.cookie.split(name + '=');
    if (parts.length === 2) {
      return parts[1].split(';')[0];
    }
  }

  function displayToken() {
    let token = getCookie('authorize-access-token');
    console.log('되긴함?');
    setToken(token);
    if (token) {
      window.Kakao.Auth.setAccessToken(token);
      window.Kakao.Auth.getStatusInfo()
        .then((res) => {
          if (res.status === 'connected') {
            document.getElementById('token-result').innerText =
              'login Success 이녀석아; TOKEN:' +
              window.Kakao.Auth.getAccessToken();
          }
        })
        .catch((err) => window.Kakao.Auth.setAccessToken(null));
    }
  }

  useEffect(() => {
    displayToken();
  }, [token]);

  return (
    <div>
      <a id='kakao-login-btn' onClick={kakaoLoginHnadler}>
        <img
          src='https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg'
          width='222'
          alt='카카오 로그인 버튼'
        />
      </a>
      <button onClick={displayToken}>하이이이</button>
      <p id='token-result'></p>
    </div>
  );
};

export default KakaoLogin;
