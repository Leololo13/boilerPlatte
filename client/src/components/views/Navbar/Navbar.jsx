import React from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { Button, Dropdown, Space } from 'antd';

function Navbar() {
  const location = useLocation();
  const items = [
    {
      key: '1',
      label: (
        <Link to={'/user/login'} state={{ background: location }}>
          {' '}
          <p rel='noopener noreferrer'>SIGN IN</p>
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
        <div className='logo'>
          {' '}
          <Link to={'/'} className='link'>
            LEO.COM <img src='' alt='' />{' '}
          </Link>
        </div>
      </div>
      <div className='rightbox'>
        <div className='iconbox'>
          <Link to={'/list/write'} className='link'>
            {' '}
            <p className='right-icon'>Write</p>
          </Link>

          <Link to={'/list'} className='link'>
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
