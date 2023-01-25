import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button, Dropdown, Space } from 'antd';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { category } = useParams();
  const [cookies, setCookie, removeCookies] = useCookies([]);
  const [data, setData] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  //////////////////////////////
  const logoutHandler = async () => {
    try {
      await axios.get('/api/user/logout');
      console.log('logout');
      navigate('/');
    } catch (error) {
      window.location.reload();
      console.log(error);
    }
  };

  ////일단은 인증용. refreshtoken잘되는지 확인용으로 쓰다 삭제
  const tryAuth = async () => {
    try {
      await axios.get(`/api/user/auth`).then((res) => {
        setData(res.data);
        console.log(res.data);
      });
    } catch (err) {
      console.log(err, 'navbar autherr');
    }
  };

  ////////////////요청을 페이지 새로고침이나 이런거할때 계속 확인해서 버튼을보여줄지 말지 정한다.
  useEffect(() => {
    tryAuth();
    console.log('navbar authtry');
  }, []);
  ///////////////nav bar 아이콘 내 항목
  const items = [
    data.email ?? {
      key: '1',
      label: (
        <Link to={'/user/login'} state={{ background: location }}>
          {' '}
          <p rel='noopener noreferrer'>SIGN IN</p>
        </Link>
      ),
    },
    data.email ?? {
      key: '2',
      label: (
        <Link to={'/user/register'} state={{ background: location }}>
          {' '}
          <p rel='noopener noreferrer'>SIGN UP</p>
        </Link>
      ),
    },
    data.email && {
      key: '6',
      label: (
        <Link to={`/userpage?act=userInfo`} state={{ background: location }}>
          <p rel='noopener noreferrer'>
            <span style={{ color: 'blue' }}>{data.nickname}</span>
            {data.email}
          </p>
        </Link>
      ),
    },
    data.email && {
      key: '3',
      label: (
        <Link to={`/userpage`} state={{ background: location }}>
          {' '}
          <p rel='noopener noreferrer'>MY Page</p>
        </Link>
      ),
    },

    data.email && {
      key: '5',
      label: (
        <div rel='noopener noreferrer' onClick={logoutHandler}>
          {' '}
          LogOut
        </div>
      ),
    },
    {
      key: '4',
      label: (
        <button
          onClick={() => {
            tryAuth();
          }}
        >
          {' '}
          <p rel='noopener noreferrer'>Auth test</p>
        </button>
      ),
    },
  ];

  return (
    <div className='navbar-box'>
      <div className='leftbox'>
        <div className='logo'>
          <Link to={'/'} className='link'>
            <img src='/logo/cow.png' className='leftbox-logimg' alt='' />{' '}
          </Link>
          <Link to={'/'} className='link'>
            BMCow.Com
          </Link>
        </div>
      </div>
      <div className='rightbox'>
        <div className='iconbox'>
          {data.email ? (
            <Link to={`/list/${category ?? 'all'}/editor`} className='link'>
              <p className='right-icon'>Write</p>
            </Link>
          ) : null}

          <Link to={'/list/all'} className='link'>
            {' '}
            <p className='right-icon'>List</p>
          </Link>
        </div>
        <div className='userprofile-box'>
          <Space direction='vertical'>
            <Space wrap>
              <Dropdown
                menu={{
                  items,
                }}
                overlayStyle={{
                  width: '240px',
                  fontSize: '60px',
                  fontWeight: 'bold',
                }}
                placement='topRight'
              >
                <Button
                  style={{
                    border: 'none',
                    borderRadius: '50%',
                    width: '3.5rem',
                    height: '3.5rem',
                  }}
                >
                  User
                </Button>
              </Dropdown>
            </Space>
          </Space>
          {/* <Link to={'/user/login'} className='link'>
            User <img className='user-profile' src='' alt='' />
          </Link> */}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
