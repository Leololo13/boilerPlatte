import React from 'react';
import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { topCategories, ALLCATEGORIES, valTotitle } from '../BoardList/category';

const contentStyle = {
  display: 'flex',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  background: '#fff',
  overflow: 'hidden',
  WebkitOverflowScrolling: 'touch',
  outline: 'none',
  width: '69vw',
  height: '81vh',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContents: 'center',
  margin: '0',
  padding: '20px 20px',
  fontSize: '1.1rem',
  zIndex: '100000',
};

const overlayStyle = {
  position: 'fixed',
  backgroundColor: 'rgba(110, 110, 110, 0.4)',
  transition: 'all 1s',
  zIndex: '500',
};

const Rlistmodal = (props) => {
  const [ovstyle, setOvstyle] = useState(overlayStyle);
  const [cntStyle, setCntStyle] = useState(contentStyle);
  const [modal, setModal] = useState(false);

  function timedelay(now) {
    setModal(now);
    setCntStyle((prev) => ({
      ...prev,
      width: '0px',
      height: '0px',
      transition: 'all 0.3s',
    }));
    setOvstyle((prev) => ({
      ...prev,
      backgroundColor: 'rgba(110, 110, 110, 0)',
      transition: 'all 0.5s',
    }));
    setTimeout(() => {
      props.setRlistmodal(now);
      console.log(modal, '모달바뀐다 느리게');
      setOvstyle(overlayStyle);
    }, 500);
  }

  useEffect(() => {
    if (!props.rlistModal) {
      console.log('클로즈상태');
      setCntStyle((prev) => ({
        ...prev,
        width: '0px',
        height: '0px',
      }));
    } else {
      setCntStyle((prev) => ({
        ...prev,
        width: '40vw',
        minHeight: '20vh',
        height: 'fit-content',
        transition: 'all 0.5s',
      }));
    }
  }, [props.rlistModal]);

  return (
    <>
      <Modal
        isOpen={props.rlistModal}
        ariaHideApp={false} /// 모달창이 열릴경우 배경컨텐츠를 메인으로 하지않기위해 숨겨줘야한다.
        onRequestClose={() => {
          timedelay(false);
        }}
        style={{
          overlay: ovstyle,
          content: cntStyle,
        }}
      >
        <div className='rlist-box'>
          {topCategories.map((tp, i) => {
            return (
              <div key={i} className='rlist-card'>
                <div className='rlist-title'>
                  {' '}
                  <Link to={`/${tp}/all`} className='link'>
                    {valTotitle[tp]}{' '}
                  </Link>
                </div>
                {ALLCATEGORIES[i].map((c, idx) => {
                  return (
                    <div key={idx} className='rlist-list'>
                      {' '}
                      <Link className='link' to={`/${tp}/${c}`}>
                        {valTotitle[c]}{' '}
                      </Link>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
};

export default Rlistmodal;
