import Modal from 'react-modal';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

function Modalpopup(props) {
  let title = '';
  const location = useLocation();
  const navigate = useNavigate();
  const [modalOpen, setModalopen] = useState(true);

  const overlayStyle = {
    position: 'fixed',
    backgroundColor: 'rgba(110, 110, 110, 0.4)',
  };

  const contentStyle = {
    display: 'flex',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    height: 'fit-content',
    width: '380px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0',
    padding: '0px',
    paddingBottom: '20px',
    fontSize: '1.1rem',
  };
  return createPortal(
    <div>
      <Modal
        ariaHideApp={false} /// 모달창이 열릴경우 배경컨텐츠를 메인으로 하지않기위해 숨겨줘야한다.
        isOpen={modalOpen}
        onRequestClose={() => {
          setModalopen(false);
          navigate(-1);
        }}
        style={{
          overlay: overlayStyle,
          content: contentStyle,
        }}
      >
        <h3
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '2.5rem',
            width: '100%',
            backgroundColor: 'bisque',
            padding: '0',
            margin: '0',
            color: 'darkgrey',
            marginBottom: '10px',
          }}
        >
          {location.pathname === '/user/register'
            ? (title = 'SIGN UP')
            : (title = 'SIGN IN')}
        </h3>
        <Outlet></Outlet>
      </Modal>
    </div>,
    document.getElementById('modal-root')
  );
}

export default Modalpopup;
