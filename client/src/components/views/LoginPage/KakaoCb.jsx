import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import qs from 'qs';
import { useState } from 'react';
const KakaoCb = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');
  const [userInfo, setUserinfo] = useState({
    id: '',
    nickname: '',
    image: '',
    date: '',
    email: '',
  });
  const [user_id, setUserId] = useState();
  const [nickName, setNickName] = useState();
  const [profileImage, setProfileImage] = useState();

  const REST_API_KEY = 'be27c24b34303e11325a8037494dcd27';
  const REDIRECT_URI = 'http://localhost:3000/kakao/oauth';
  const CLIENT_SECRET = 'rMvI4fJxYM91ghrxVwdBh3H1PAO4XwN7';
  let payload = qs.stringify({
    grant_type: 'authorization_code',
    client_id: REST_API_KEY,
    redirect_uri: REDIRECT_URI,
    code: code,
    client_secret: CLIENT_SECRET,
  });

  const datahandler = async () => {
    try {
      // Kakao SDK API를 이용해 사용자 정보 획득
      let data = await window.Kakao.API.request({
        url: '/v2/user/me',
      });
      // 사용자 정보 변수에 저장
      console.log(data);
      setUserId(data.id);
      setNickName(data.properties.nickname);
      setProfileImage(data.properties.profile_image);
    } catch (err) {
      console.log(err);
    }
  };
  const kakaoTry = async () => {
    console.log('kakaoTry');
    try {
      await axios.get(`/api/user/kakaologin?code=${code}`).then((res) => {
        console.log(res);
        setUserinfo({
          id: res.data.data.properties.nickname,
          nickname: res.data.data.properties.nickname,
          image: res.data.data.properties.profile_image,
          email: res.data.data.properties.email,
          date: res.data.data.connected_at,
        });
        alert(res.data.message);
      });
      console.log(userInfo);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const kakaoAction = async () => {
      console.log('들어옴');
      try {
        if (code) {
          console.log('카카오로그인간다아');
          const res = await axios.post(
            'https://kauth.kakao.com/oauth/token',
            payload
          );
          console.log(res.data);
          if (!window.Kakao.isInitialized()) {
            console.log('카카오로그인 준비');
            window.Kakao.init('b18ca2d74f4a17d6908f33d9c4958961');
            window.Kakao.Auth.setAccessToken(res.data.access_token);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    // kakaoAction();
  }, [code]);

  return (
    <div>
      <button onClick={datahandler}> 프론트에서오케이</button>
      <button onClick={kakaoTry}> 서버에서</button>

      <h2>{userInfo.id}</h2>
      <h2>{userInfo.nickname}</h2>
      <img width={240} src={userInfo.image}></img>
    </div>
  );
};

export default KakaoCb;
