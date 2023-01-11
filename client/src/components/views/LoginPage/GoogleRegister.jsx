import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useEffect } from 'react';
import { GoogleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const GoogleRegister = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState();
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      // fetching userinfo can be done on the client or the server
      const userInfo = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then((res) => {
          setProfile({
            id: res.data.name,
            email: res.data.email,
            name: res.data.given_name,
            lastname: res.data.family_name,
            image: res.data.picture,
            nickname: res.data.name,
          });
          return res.data;
        });

      console.log(userInfo);
    },
    // flow: 'implicit', // implicit is the default
  });
  const ClientId = process.env.REACT_APP_CLIENT_ID;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const registerUser = async () => {
      console.log(profile);
      if (profile) {
        try {
          const register = await axios
            .post('/api/user/googleregister', profile)
            .then(navigate('/'));
          if (register.data.RegisterSuccess === false) {
            alert(register.data.message);
          } else {
            console.log(register, '가입하겠습니다.');
          }
          // const register = await axios.post('/api/user/googleregister', profile);
        } catch (error) {
          console.log(error, '실패패패');
        }
      }
    };
    registerUser();
  }, [profile]);
  return (
    <div>
      <button className='googleRegister' onClick={googleLogin}>
        <GoogleOutlined />
        구글로 회원가입
      </button>
    </div>
  );
};

export default GoogleRegister;
