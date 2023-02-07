import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

const KakaoCb = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');
  const condition = useParams('condition').action;
  console.log(condition);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [userInfo, setUserinfo] = useState({
    id: '',
    nickname: '',
    image: '',
    date: '',
    email: '',
  });

  // let payload = qs.stringify({
  //   grant_type: 'authorization_code',
  //   client_id: REST_API_KEY,
  //   redirect_uri: REDIRECT_URI,
  //   code: code,
  //   client_secret: CLIENT_SECRET,
  // });

  // const [user_id, setUserId] = useState();
  // const [nickName, setNickName] = useState();
  // const [profileImage, setProfileImage] = useState();

  // const datahandler = async () => {
  //   try {
  //     // Kakao SDK API를 이용해 사용자 정보 획득
  //     let data = await window.Kakao.API.request({
  //       url: '/v2/user/me',
  //     });
  //     // 사용자 정보 변수에 저장
  //     console.log(data);
  //     setUserId(data.id);
  //     setNickName(data.properties.nickname);
  //     setProfileImage(data.properties.profile_image);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const kakaoTry = async () => {
    console.log('kakaoTry');

    setLoading(true);
    try {
      await axios
        .get(`/api/user/kakao?code=${code}&cond=${condition}`)
        .then((res) => {
          console.log(res.data);

          setUserinfo({
            id: res.data.data.properties?.nickname,
            nickname: res.data.data.properties?.nickname,
            image: res.data.data.properties?.profile_image,
            email: res.data.data.properties?.email,
            date: res.data.data.connected_at,
          });
          setLoading(false);
          throw new Error(res?.data.message || res.data);
        });
    } catch (error) {
      console.log(error);
      setErr(error?.message);
      console.log(err);
    }
  };

  useEffect(() => {
    kakaoTry();
    // kakaoAction();
  }, [code]);
  console.log(userInfo);
  return (
    <div>
      {/* <button onClick={datahandler}> 프론트에서오케이</button> */}
      {loading ? (
        <div>loading......</div>
      ) : (
        <>
          <h2>{userInfo.id}</h2>
          <h2>{userInfo.nickname}</h2>
          <img width={240} src={userInfo.image}></img>
        </>
      )}
    </div>
  );
};

export default KakaoCb;
