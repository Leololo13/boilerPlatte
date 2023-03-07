import React from 'react';
import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { topCategories, ALLCATEGORIES, valTotitle } from '../BoardList/category';
import axios from 'axios';
const contentStyle = {
  display: 'flex',
  position: 'relative',
  background: '#fff',
  overflow: 'hidden',
  WebkitOverflowScrolling: 'touch',
  outline: 'none',
  width: '80px',
  height: 'fit-content',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContents: 'center',
  margin: '0',
  padding: '10px 10px',
  fontSize: '0.8rem',
  zIndex: '100000',
  transition: 'all 1s',
};

const overlayStyle = {
  position: 'fixed',
  backgroundColor: 'rgba(110, 110, 110, 0)',
  transition: 'all 1s',
};

const Usermodal = (props) => {
  const id = props.writer;
  const navigate = useNavigate();
  const { tpcategory, category } = useParams();

  const moveTouserSearch = () => {
    navigate(
      `/${tpcategory}/${category}?page=${1}&category=search&limit=20&search=${id}&topc=${tpcategory}&soption=nickname`
    );
  };
  const moveToucmtSearch = () => {
    navigate(
      `/${tpcategory}/${category}?page=${1}&category=search&limit=20&search=${id}&topc=${tpcategory}&soption=comment`
    );
  };

  return (
    <div className='usermodal'>
      <Modal
        isOpen={props.userModal}
        ariaHideApp={false} /// 모달창이 열릴경우 배경컨텐츠를 메인으로 하지않기위해 숨겨줘야한다.
        onRequestClose={() => {
          props.setUsermodal(false);
        }}
        style={{
          overlay: overlayStyle,
          content: { ...contentStyle, left: props.position[0], top: props.position[1] },
        }}
      >
        <span style={{ cursor: 'pointer' }} onClick={moveTouserSearch} className='modaluser-search'>
          작성글 보기{' '}
        </span>{' '}
      </Modal>
    </div>
  );
};

export default Usermodal;
