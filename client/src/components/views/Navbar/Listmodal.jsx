import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Divider, Menu } from 'antd';
import { useState } from 'react';
import React from 'react';
import Modal from 'react-modal';
import './Listmodal.css';
import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

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
const items = [
  getItem('Navigation One', 'sub1', <MailOutlined />, [
    getItem('Option 1', '1'),
    getItem('Option 2', '2'),
    getItem('Option 3', '3'),
    getItem('Option 4', '4'),
  ]),
  getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [
      getItem('Option 7', '7'),
      getItem('Option 8', '8'),
    ]),
  ]),
  getItem('Navigation Three', 'sub4', <SettingOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Option 11', '11'),
    getItem('Option 12', '12'),
  ]),
];

// submenu keys of first level
const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

const Listmodal = (props) => {
  const [ovstyle, setOvstyle] = useState(overlayStyle);
  const [cntStyle, setCntStyle] = useState(contentStyle);
  const [modal, setModal] = useState(false);

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
  const [openKeys, setOpenKeys] = useState(['sub1']);
  const onOpenChange = (keys) => {
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
