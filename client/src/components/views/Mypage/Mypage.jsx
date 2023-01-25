import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './Mypage.css';
function Mypage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const act = searchParams.get('act');
  console.log(act);
  const [userdata, setUserdata] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/user/mypage');
        const { password, refresh_token, access_token, role, ...others } =
          res.data;
        setUserdata(others);
        console.log(res.data);
      } catch (error) {
        alert(error);
        console.log(error.message);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <header className='headerbox'>
        <Link to={'/userpage?act=userInfo'} className='link'>
          회원 정보 보기
        </Link>
        <Link to={'/userpage?act=scrap'} className='link'>
          스크랩 보기
        </Link>
        <Link to={'/userpage?act=post'} className='link'>
          작성 글보기
        </Link>
        <Link to={'/userpage?act=comment'} className='link'>
          작성 댓글 보기
        </Link>
        <Link to={'/userpage?act=userInfo'} className='link'>
          회원정보보기
        </Link>
      </header>
      <h3>{userdata.nickname} 님의 회원정보입니다</h3>
      <main>{}</main>
    </div>
  );
}

export default Mypage;
