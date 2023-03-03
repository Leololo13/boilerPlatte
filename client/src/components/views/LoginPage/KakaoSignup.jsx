import React from 'react';

const KakaoSignup = () => {
  function kakaoSignupHnadler() {
    if (!window.Kakao.isInitialized()) {
      console.log('카카오로그인 준비');
      window.Kakao.init(process.env.REACT_APP_KAKAO_JSKEY);

      window.Kakao.Auth.authorize({
        redirectUri: `http://localhost:3000/user/kakao/signup`,
      });
    }
  }
  return (
    <>
      <span id='kakao-login-btn' style={{ cursor: 'pointer', height: '40px' }} onClick={kakaoSignupHnadler}>
        <img src='/logo/kakaologin.png' alt='카카오 로그인 버튼' width={40} height={40} />
      </span>
    </>
  );
};

export default KakaoSignup;
