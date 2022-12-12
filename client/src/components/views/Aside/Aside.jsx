import React, { useState } from 'react';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

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
  getItem('User Info', 'sub1', <MailOutlined />, [
    getItem('Login', 'user/login'),
    getItem('Register', 'user/register'),
    getItem('Mypage', 'user/mypage'),
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

const Aside = (props) => {
  const [current, setCurrent] = useState('1');
  const navigate = useNavigate();
  const onClick = (e) => {
    setCurrent(e.key);
    navigate(`/${e.key}`);
  };
  return (
    <div>
      <Menu
        theme={props.theme}
        onClick={onClick}
        style={{
          width: 256,
        }}
        defaultOpenKeys={['sub1']}
        selectedKeys={[current]}
        mode='inline'
        items={items}
      />
    </div>
  );
};
export default Aside;
