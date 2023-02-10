import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu, Avatar } from 'antd';
import { useState } from 'react';
import React from 'react';
import Modal from 'react-modal';
import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const contentStyle = {
  display: 'flex',
  position: 'absolute',
  top: '0',
  left: '0',
  background: '#fff',
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
  outline: 'none',
  height: '100vh',
  width: 'fit-content',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0',
  padding: '0px',
  paddingBottom: '20px',
  fontSize: '1.1rem',
};

const overlayStyle = {
  position: 'fixed',
  backgroundColor: 'rgba(110, 110, 110, 0.4)',
  transition: 'all 1s',
};

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

// submenu keys of first level
const rootSubmenuKeys = ['user', 'list', 'comu'];

const Listmodal = (props) => {
  const cat = useParams().category;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userAction = searchParams.get('act');

  const [ovstyle, setOvstyle] = useState(overlayStyle);
  const [cntStyle, setCntStyle] = useState(contentStyle);
  const [modal, setModal] = useState(false);

  const loginUser = getItem(
    <Link to={`/userpage`} className='link'>
      {props.nickname}
    </Link>,
    'user',
    <Avatar
      style={{
        color: 'darkgrey',
        backgroundColor: 'bisque',
        display: 'flex',
        justifyContent: 'center',
      }}
      gap={3}
      size={40}
      icon={<UserOutlined />}
    />,
    [
      getItem(
        <Link to={`/userpage?act=userInfo`} className='link'>
          회원 정보
        </Link>,
        '1'
      ),
      getItem(
        <Link to={`/userpage?act=post`} className='link'>
          작성 글
        </Link>,
        '2'
      ),
      getItem(
        <Link to={`/userpage?act=comment`} className='link'>
          작성 댓글
        </Link>,
        '3'
      ),
      getItem(<div onClick={props.logoutHandler}>로그 아웃</div>, '4'),
    ]
  );
  const nloginUser = getItem(
    <Link to={`/user/login`} className='link'>
      로그인 혹은 회원가입하기
    </Link>,

    'user',
    <UserOutlined />
  );
  const items = [
    props.isAuth ? loginUser : nloginUser,

    getItem(
      <Link to={`/list/all`} className='link'>
        힐링 시간
      </Link>,
      'list',
      <AppstoreOutlined />,
      [
        getItem(
          <Link to={`/list/healing`} className='link'>
            힐링
          </Link>,
          '5'
        ),
        getItem(
          <Link to={`/list/humor`} className='link'>
            유머
          </Link>,
          '6'
        ),
        getItem(
          <Link to={`/list/info`} className='link'>
            정보
          </Link>,
          '7'
        ),
        getItem(
          <Link to={`/list/enter`} className='link'>
            연예인
          </Link>,
          '8'
        ),
      ]
    ),
    getItem(
      <Link to={`/comu/all`} className='link'>
        커뮤니티
      </Link>,
      'comu',
      <AppstoreOutlined />,
      [
        getItem(
          <Link to={`/comu/lunch`} className='link'>
            점심자랑
          </Link>,
          '5'
        ),
        getItem(
          <Link to={`/comu/AI`} className='link'>
            AI 대유쾌마운틴
          </Link>,
          '6'
        ),
        getItem(
          <Link to={`/comu/comic`} className='link'>
            만화 추천
          </Link>,
          '7'
        ),
      ]
    ),
    getItem(
      <Link to={`/blind/all`} className='link'>
        블라인드
      </Link>,
      'blind',
      <SettingOutlined />,
      [
        getItem(
          <Link to={`/blind/any`} className='link'>
            익명 - 아무말
          </Link>,
          '9'
        ),
        getItem(
          <Link to={`/blind/politic`} className='link'>
            익명 - 정치
          </Link>,
          '10'
        ),
        getItem(
          <Link to={`/blind/blind`} className='link'>
            블라인드
          </Link>,
          '11'
        ),
      ]
    ),
  ];

  function timedelay(now) {
    setModal(now);
    setCntStyle((prev) => ({
      ...prev,
      width: '0px',
      transition: 'all 0.3s',
    }));
    setOvstyle((prev) => ({
      ...prev,
      backgroundColor: 'rgba(110, 110, 110, 0)',
      transition: 'all 0.5s',
    }));
    setTimeout(() => {
      props.setListModal(now);
      console.log(modal, '모달바뀐다 느리게');
      setOvstyle(overlayStyle);
    }, 500);
  }

  const [openKeys, setOpenKeys] = useState([
    cat ? 'list' : userAction ? 'user' : 'comu',
  ]);

  const onOpenChange = (keys) => {
    console.log(keys);
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  useEffect(() => {
    if (!props.listModal) {
      console.log('클로즈상태');
      setCntStyle((prev) => ({
        ...prev,
        width: '0px',
      }));
    } else {
      setCntStyle((prev) => ({
        ...prev,
        width: '256px',
        transition: 'all 0.5s',
      }));
    }
  }, [props.listModal]);

  return (
    <>
      <Modal
        isOpen={props.listModal}
        ariaHideApp={false} /// 모달창이 열릴경우 배경컨텐츠를 메인으로 하지않기위해 숨겨줘야한다.
        onRequestClose={() => {
          timedelay(false);
        }}
        // overlayElement={(props, children) => (
        //   <div isOpen={modal} {...props}>
        //     {children}
        //     {/* children이 content임 */}
        //   </div>
        // )}
        style={{
          overlay: ovstyle,
          content: cntStyle,
        }}
      >
        <Menu
          mode='inline'
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          items={items}
        />{' '}
      </Modal>
    </>
  );
};

export default Listmodal;
