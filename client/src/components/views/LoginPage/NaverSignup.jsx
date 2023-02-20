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
    <div>
      {loading ? (
        <div>...loading</div>
      ) : (
        <span
          onClick={naverLoginhandler}
          style={{
            cursor: 'pointer',
            //   color: 'white',
            //   display: 'flex',
            width: '100%',
            height: '100%',
            //   justifyContent: 'center',
            //   alignItems: 'center',
            //   fontSize: '30px',
            //   fontWeight: 'bold',
            //   borderRadius: '5px',
            //   backgroundColor: 'rgb(30,200,0)',
          }}
        >
          <img src='/logo/naverbtn.png' width={40} alt='' />
        </span>
      )}
    </div>
  );
};

export default NaverSignup;
