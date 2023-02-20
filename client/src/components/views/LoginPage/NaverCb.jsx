import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';

const NaverCb = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { act } = useParams();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  useEffect(() => {
    const naverLoginFetch = async () => {
      setLoading(true);
      try {
        await axios.get(`/api/user/naverCB/${act}?code=${code}&state=${state}&act=${act}`).then((res) => {
          console.log(res.data);
          setLoading(false);
          alert(res.data.message);
          if (res.data.message === '가입에 성공하셨습니다.') {
            console.log('??');
            navigate('/user/naver/signin');
          } else {
            navigate('/');
          }
        });
      } catch (error) {
        alert('로그인 과정에서 오류가 발생했습니다.');
        navigate('/');
        console.log(error);
      }
    };
    naverLoginFetch();
  }, []);
  return (
    <div>
      {loading ? (
        <div>
          <LoadingOutlined />
        </div>
      ) : (
        <div>loading Complete</div>
      )}
    </div>
  );
};

export default NaverCb;
