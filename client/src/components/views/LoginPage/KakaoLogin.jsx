import React from 'react';

const KakaoLogin = () => {
  function kakaoLoginHnadler() {
    console.log('클릭');
    if (!window.Kakao.isInitialized()) {
      console.log('카카오로그인 준비');
      window.Kakao.init(process.env.REACT_APP_KAKAO_JSKEY);

      window.Kakao.Auth.authorize({
        redirectUri: `http://localhost:3000/user/kakao/oauth`,
      });
    } else {
      window.Kakao.Auth.authorize({
        redirectUri: `http://localhost:3000/user/kakao/oauth`,
      });
    }
  }
  // function getCookie(name) {
  //   let parts = document.cookie.split(name + '=');
  //   if (parts.length === 2) {
  //     return parts[1].split(';')[0];
  //   }
  // }

  // function displayToken() {
  //   let token = getCookie('authorize-access-token');
  //   console.log('되긴함?');
  //   setToken(token);
  //   if (token) {
  //     window.Kakao.Auth.setAccessToken(token);
  //     window.Kakao.Auth.getStatusInfo()
  //       .then((res) => {
  //         if (res.status === 'connected') {
  //           document.getElementById('token-result').innerText =
  //             'login Success 이녀석아; TOKEN:' +
  //             window.Kakao.Auth.getAccessToken();
  //         }
  //       })
  //       .catch((err) => window.Kakao.Auth.setAccessToken(null));
  //   }
  // }

  return (
    <div>
      <span id='kakao-login-btn' style={{ cursor: 'pointer' }} onClick={kakaoLoginHnadler}>
        <img src='/logo/kakaologin.png' alt='카카오 로그인 버튼' width={40} height={40} />
      </span>
    </div>
  );
};

export default KakaoLogin;
