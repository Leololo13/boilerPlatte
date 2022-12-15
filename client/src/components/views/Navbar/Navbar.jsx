import React, { useState } from 'react';
import './Navbar.css';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button, Dropdown, Space } from 'antd';
import Modal from 'react-modal';

function Navbar() {
  const location = useLocation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const items = [
    {
      key: '1',
      label: (
        <Link
          to={'/user/login'}
          className='link'
          state={{ background: location }}
        >
          {' '}
          <p>SIGN IN</p>
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <Link to={'/user/register'} state={{ background: location }}>
          {' '}
          <p rel='noopener noreferrer'>SIGN UP</p>
        </Link>
      ),
    },
    {
      key: '3',
      label: (
        <Link to={'/user/mypage'} state={{ background: location }}>
          {' '}
          <p rel='noopener noreferrer'>MY Page</p>
        </Link>
      ),
    },
  ];
  return (
    <div className='navbar-box'>
      <div className='leftbox'>
        left{' '}
        <Link to={'/'} className='link'>
          <div className='logo'>
            LEO.COM <img src='' alt='' />{' '}
          </div>
        </Link>
      </div>
      <div className='rightbox'>
        <div className='iconbox'>
          <Link
            to={'/list/write'}
            className='link'
            state={{ background: location }}
          >
            {' '}
            <p className='right-icon'>Write</p>
          </Link>
          <Link
            to={'/list/post'}
            className='link'
            state={{ background: location }}
          >
            {' '}
            <p className='right-icon'>post</p>
          </Link>
          <Link to={'/list'} className='link' state={{ background: location }}>
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
