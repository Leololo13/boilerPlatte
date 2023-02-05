import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button, Dropdown, Space, Avatar } from 'antd';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import Listmodal from './Listmodal';

/////////////////네브바
function Navbar(props) {
  const { category } = useParams();
  const [cookies, setCookie, removeCookies] = useCookies([]);
  const [data, setData] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const [listModal, setListModal] = useState(false);

  console.log(props, 'props from auth APP.js');

  //////////////////////////////
  const trySave = async () => {
    try {
      await axios
        .post('/api/user/modify/Userinfo', data)
        .then((res) => console.log(res.data, '세이브테스트 완료'));
    } catch (error) {
      console.log(error, '세이브테스트실패');
    }
  };
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
      });
    } catch (err) {
      console.log(err, 'navbar auth err발생함');
    }
  };

  ////////////////요청을 페이지 새로고침이나 이런거할때 계속 확인해서 버튼을보여줄지 말지 정한다.
  useEffect(() => {
    tryAuth();
    // setData(props);
    console.log(
      '뭐가 더빠른지 모르겟다. props를 받을지 아니면 자료를 받아올지 첫페이지에서 useEffect'
    );
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
            <Avatar
              style={{ color: 'darkgrey', backgroundColor: 'bisque' }}
              gap={3}
              size={40}
              icon={<UserOutlined />}
            />
            <span
              style={{ paddingLeft: '5px', color: 'black', fontWeight: 'bold' }}
            >
              {data.nickname}
            </span>
            {/* {data.email} */}
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
    {
      key: '7',
      label: (
        <button
          onClick={() => {
            trySave();
          }}
        >
          {' '}
          <p rel='noopener noreferrer'>save test</p>
        </button>
      ),
    },
  ];

  return (
    <div className='navbar-box'>
      <Listmodal listModal={listModal} setListModal={setListModal} />
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
          <button
            onClick={() => {
              setListModal(!listModal);
            }}
          >
            모달
          </button>
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
                    fontSize: '0.8rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    width: '3.5rem',
                    height: '3.5rem',
                  }}
                >
                  {data?.isAdmin ? 'Admin' : 'User'}
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
