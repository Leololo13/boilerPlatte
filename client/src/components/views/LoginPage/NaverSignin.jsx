import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NaverSignin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [btn, setBtn] = useState('');

  useEffect(() => {
    const naverLoginhandler = async () => {
      try {
        await axios.get('/api/user/naver/login').then((res) => {
          setBtn(res.data);
          console.log(res.data);
        });
      } catch (error) {
        console.log(error);
      }
    };
    naverLoginhandler();
  }, []);

  return (
    <div>
      <a href={btn}>
        <img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG' />
      </a>
    </div>
  );
};

export default NaverSignin;
