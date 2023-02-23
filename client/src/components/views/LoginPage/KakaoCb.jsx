import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

const KakaoCb = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');
  const { condition } = useParams();
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
      await axios.get(`/api/user/kakao/${condition}?code=${code}`).then((res) => {
        console.log(res.data);
        setLoading(false);
        navigate('/');
        throw new Error(res?.data.message || res.data);
      });
    } catch (error) {
      console.log(error);
      setErr(error?.message);
      console.log(error);
    }
  };

  useEffect(() => {
    kakaoTry();
    // kakaoAction();
  }, [code]);
  console.log(userInfo);
  return (
    <div style={{ height: '360px', display: 'flex', alignItems: 'center' }}>
      {/* <button onClick={datahandler}> 프론트에서오케이</button> */}
      {loading ? (
        <div>
          {' '}
          <LoadingOutlined />
        </div>
      ) : (
        <>
          <h2>{userInfo.id}</h2>
          <h2>{userInfo.nickname}</h2>
          <img alt='' width={240} src={userInfo.image}></img>
        </>
      )}
    </div>
  );
};

export default KakaoCb;
