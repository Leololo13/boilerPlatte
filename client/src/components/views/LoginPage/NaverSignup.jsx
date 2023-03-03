import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const NaverSignup = () => {
  const [loading, setLoading] = useState(false);

  const naverLoginhandler = async () => {
    try {
      await axios.get('/api/user/naver/signup').then((res) => {
        window.location.replace(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <div>...loading</div>
      ) : (
        <span
          onClick={naverLoginhandler}
          style={{
            cursor: 'pointer',
            width: '40px',
            height: '40px',
          }}
        >
          <img src='/logo/naverbtn.png' width={40} height={40} alt='' />
        </span>
      )}
    </>
  );
};

export default NaverSignup;
