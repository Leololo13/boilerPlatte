import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const NaverCb = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  console.log(code, state);
  useEffect(() => {
    const naverLoginFetch = async () => {
      try {
        await axios.get(`/api/user/naver/callback?code=${code}&state=${state}`).then((res) => console.log(res));
      } catch (error) {
        console.log(error);
      }
    };
    naverLoginFetch();
  }, []);
  return <div>NaverCb</div>;
};

export default NaverCb;
