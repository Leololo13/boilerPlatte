import { AppstoreOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, Avatar } from 'antd';
import { useState } from 'react';
import React from 'react';
import Modal from 'react-modal';
import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { topCategories, listCategories, comuCategories, blindCategories, valTotitle } from '../BoardList/category';

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
  zIndex: '100000',
};

const overlayStyle = {
  position: 'fixed',
  backgroundColor: 'rgba(110, 110, 110, 0.4)',
  transition: 'all 1s',
  zIndex: '500',
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
const rootSubmenuKeys = ['user', ...topCategories];

const Listmodal = (props) => {
  const cat = useParams().category;
  const location = useLocation();

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

      listCategories.map((list, i) => {
        return getItem(
          <Link to={`/${topCategories[0]}/${list}`} className='link'>
            {valTotitle[list]}
          </Link>,
          `${i + loginUser.children.length + 1}`
        );
      })
    ),
    getItem(
      <Link to={`/comu/all`} className='link'>
        커뮤니티
      </Link>,
      'comu',
      <AppstoreOutlined />,
      comuCategories.map((list, i) => {
        return getItem(
          <Link to={`/${topCategories[1]}/${list}`} className='link'>
            {valTotitle[list]}
          </Link>,
          `${i + loginUser.children.length + 1 + listCategories.length}`
        );
      })
    ),
    getItem(
      <Link to={`/blind/all`} className='link'>
        블라인드
      </Link>,
      'blind',
      <SettingOutlined />,
      blindCategories.map((list, i) => {
        return getItem(
          <Link to={`/${topCategories[2]}/${list}`} className='link'>
            {valTotitle[list]}
          </Link>,
          `${i + loginUser.children.length + 1 + listCategories.length + comuCategories.length}`
        );
      })
    ),
  ];
  console.log(items);
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

  const [openKeys, setOpenKeys] = useState([location?.pathname.split('/')[1]]);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      console.log(keys);
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
        <Menu mode='inline' openKeys={openKeys} onOpenChange={onOpenChange} items={items} />{' '}
      </Modal>
    </>
  );
};

export default Listmodal;
