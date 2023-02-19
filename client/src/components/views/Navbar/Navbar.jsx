import React, { useState } from 'react';
import './Navbar.css';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button, Dropdown, Space, Avatar } from 'antd';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import Listmodal from './Listmodal';

/////////////////네브바
function Navbar(props) {
  const { category } = useParams();
  const [cookies, setCookie, removeCookies] = useCookies([]);
  const [data, setData] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const [listModal, setListModal] = useState(false);

  console.log(props, 'navBar props from auth APP.js');

  //////////////////////////////

  const logoutHandler = async () => {
    try {
      await axios.get('/api/user/logout');
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

  ///////////////nav bar 아이콘 내 항목
  const items = [
    props.isAuth ?? {
      key: '1',
      label: (
        <Link to={'/user/login'} state={{ background: location }}>
          {' '}
          <p rel='noopener noreferrer'>로그인</p>
        </Link>
      ),
    },
    props.isAuth ?? {
      key: '2',
      label: (
        <Link to={'/user/register'} state={{ background: location }}>
          {' '}
          <p rel='noopener noreferrer'>회원 가입</p>
        </Link>
      ),
    },
    props.isAuth && {
      key: '6',
      label: (
        <Link to={`/userpage?act=userInfo`} state={{ background: location }}>
          <span rel='noopener noreferrer'>
            <Avatar
              style={{
                color: 'darkgrey',
                backgroundColor: 'bisque',
                margin: 0,
              }}
              size={40}
              icon={<UserOutlined />}
            />
            <span
              style={{
                paddingLeft: '5px',
                color: 'black',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              {props.nickname}
            </span>
            {/* {data.email} */}
          </span>
        </Link>
      ),
    },
    props.isAuth && {
      key: '3',
      label: (
        <Link to={`/userpage?act=userInfo`} state={{ background: location }}>
          {' '}
          <p>회원 정보</p>
        </Link>
      ),
    },

    props.isAuth && {
      key: '5',
      label: <p onClick={logoutHandler}> 로그아웃</p>,
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
      <Listmodal
        logoutHandler={logoutHandler}
        nickname={props.nickname}
        isAuth={props.isAuth}
        listModal={listModal}
        setListModal={setListModal}
      />
      <div className='leftbox'>
        <span className='leftbox-modal'>
          <MenuOutlined
            onClick={() => {
              setListModal(!listModal);
            }}
          />
        </span>

        <div className='logo'>
          <Link to={'/'} className='link'>
            <img src='/logo/logo1.png' className='leftbox-logimg' alt='' />{' '}
          </Link>
          <Link to={'/'} className='link'>
            A'LunchTime
          </Link>
        </div>
      </div>
      <div className='rightbox'>
        <div className='iconbox'>
          {props.isAuth ? (
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
                placement='bottomLeft'
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
