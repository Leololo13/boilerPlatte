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
  width: '75px',
  height: 'fit-content',
  flexDirection: 'column',
  gap: '5px',
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
const contentStyle1 = {
  borderRadius: '5px',
  display: 'flex',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  border: '1px solid #ccc',
  background: '#fff',
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
  outline: 'none',
  height: '120px',
  width: '360px',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0',
  padding: '0px',
  paddingBottom: '20px',
  fontSize: '1.1rem',
};

const overlayStyle1 = {
  position: 'fixed',
  backgroundColor: 'rgba(110, 110, 110, 0.4)',
  transition: 'all 1s',
};

const Usermodal = (props) => {
  const id = props.writer;
  const isAuth = props.isAuth;
  const target_id = props.target_id;
  const [delmodal, setDelmodal] = useState(false);
  const [value, setValue] = useState(0);
  console.log(props);
  const navigate = useNavigate();
  const { tpcategory, category } = useParams();

  const moveTouserSearch = () => {
    navigate(
      `/${tpcategory}/${category}?page=${1}&category=search&limit=20&search=${id}&topc=${tpcategory}&soption=nickname`
    );
  };
  const userBlockhandler = async (e) => {
    let body = { id, target_id };
    try {
      await axios.post('/api/user/block', body).then((res) => {
        console.log(res.data);
        if (res.data.blockSuccess) {
          alert(res.data.message);
        } else {
          alert(res.data.message);
        }
        props.setUsermodal(false);
      });
    } catch (error) {
      alert(error, '유저모달');
    }
  };

  const userBlockdelhandler = async (e) => {
    e.preventDefault();
    let body = { id, target_id, number: value };
    try {
      await axios.post('/api/user/blockdel', body).then((res) => {
        alert(res.data.message);
        if (res.data.blockdelSuccess) {
          alert(res.data.message);
        } else {
          alert(res.data.message);
        }
        props.setUsermodal(false);
        setDelmodal(false);
      });
    } catch (error) {
      alert(error, '유저모달');
    }
  };
  const blocknumHandler = (e) => {
    if (0 <= e.target.value && e.target.value <= 3) {
      setValue(e.target.value);
    } else if (e.target.value > 3) {
      setValue(3);
    } else {
      setValue(0);
    }
  };

  return (
    <div className='usermodal'>
      <Modal
        isOpen={delmodal}
        ariaHideApp={false} /// 모달창이 열릴경우 배경컨텐츠를 메인으로 하지않기위해 숨겨줘야한다.
        onRequestClose={() => {
          setDelmodal(false);
          props.setUsermodal(false);
        }}
        style={{
          overlay: overlayStyle1,
          content: contentStyle1,
        }}
      >
        <div>블럭을 해제하시겠습니까?</div>
        <input type='number' value={value} onChange={blocknumHandler} />
        <button onClick={userBlockdelhandler}>예</button>
      </Modal>
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
        {isAuth ? (
          <>
            {' '}
            <span className='modaluser-block' onClick={userBlockhandler} style={{ cursor: 'pointer' }}>
              계정 블럭
            </span>
            <span
              className='modaluser-block'
              onClick={() => {
                setDelmodal(true);
                props.setUsermodal(false);
              }}
              style={{ cursor: 'pointer' }}
            >
              블럭 해제
            </span>
          </>
        ) : null}
      </Modal>
    </div>
  );
};

export default Usermodal;
