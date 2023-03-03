import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const Verfiy = (props) => {
  //////////인증메일 타이머/////////////////////////
  const [time, setTime] = useState();
  const [timeron, setTimeron] = useState(false);
  const count = useRef(null);
  const interval = useRef(null);
  const [value, setValue] = useState('');
  const [scrkey, setScrkey] = useState('');
  const [clicked, setClicked] = useState(false);

  function makeTime(time) {
    if (!time) {
      return '';
    }
    let mm = parseInt(time / 60);
    let ss = (time % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }
  console.log(props);
  const sendMail = async () => {
    console.log('클릭', props.email);
    let email = props.email;
    if (props.checkID) {
      try {
        setClicked(true);
        await axios.post('/api/user/sendVmail', { email }).then((res) => {
          if (res.data.sendMailSuccess) {
            alert(res.data.message);
            setScrkey(res.data.secretkey);
            setTime(res.data.validtime);
            count.current = res.data.validtime;
            console.log(count.current);
            setTimeron(true);
          } else {
            alert('인증메일 발송 과정에서 에러가 발생했습니다');
          }
        });
      } catch (error) {
        alert('인증메일 발송 과정에서 에러가 발생했습니다');
      }
    } else if (!props.email) {
      alert('이메일을 입력하십시오');
    } else {
      alert('사용중인 이메일입니다');
    }
  };
  useEffect(() => {
    console.log('된긴함?');
    if (time >= 0) {
      interval.current = setInterval(() => {
        count.current -= 1;
        // count.current <= 0 ? 0 : count.current;
        setTime(count.current);
      }, 1000);
    }
  }, [timeron]);

  useEffect(() => {
    if (count.current <= 0) {
      clearInterval(interval.current);
      setClicked(false);
      setTimeron(false);
      console.log('들어오나');
    }
    if (props.veri) {
      clearInterval(interval.current);
      setClicked(false);
      setTimeron(false);
    }
  }, [time]);
  /////////////////////////////////////////////////
  console.log(time);
  console.log(count.current);
  const checkHandler = () => {
    if (time > 0 && value === scrkey) {
      props.setVeri(true);
    } else {
      alert('인증번호가 잘못되었습니다');
    }
  };
  const changeHandler = (e) => {
    setValue(e.target.value);
    console.log(e.target.value);
  };
  return (
    <>
      <div className='verify-box'>
        <div className='verify-box-left'>
          <input type='text' value={value} onChange={changeHandler} placeholder='인증번호입력' />
          <button onClick={checkHandler}>인증하기</button>
          <span>{props.veri ? '인증완료' : !props.veri && time <= 0 ? '인증시간 초과' : makeTime(time)}</span>{' '}
        </div>
        <div className='verify-box-right'>
          {' '}
          <button disabled={clicked} style={{ height: '30px', width: '60px' }} onClick={sendMail}>
            인증메일 발송
          </button>
        </div>
      </div>
      {/* 로딩끝+인증완료 = 인증끝, 로딩중+인증은모름=>인증기다림, 로딩끝+인증x=인증실패 */}
      {/* {!loading && verify
        ? '인증완료되었습니다'
        : loading && verify === undefined
        ? '인증을 기다리고 있습니다'
        : '인증 실패'} */}
    </>
  );
};

export default Verfiy;
