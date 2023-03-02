import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Findpw = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const onEmailHandler = (e) => {
    setEmail(e.target.value);
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!email) {
      alert('이메일을 입력하십시오');
    }
    try {
      await axios.post('/api/user/sendVmail?condition=findpw', { email }).then((res) => {
        alert(res.data.message);
        if (res.data.findPWSuccess) {
          navigate('/');
        }
      });
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div className='findpw'>
      <div className='explanation'>
        현재 이메일로 변경된 비밀번호를 보내드립니다.
        <br />
        <b>이메일 주소</b> 를 입력하시고, <br />
        비밀번호 찾기 버튼을 클릭하십시오
      </div>
      <form
        action=''
        style={{ display: 'flex', flexDirection: 'column', width: '240px' }}
        onSubmit={onSubmitHandler}
        className='login-form'
      >
        <label htmlFor=''>E-mail</label>
        <input type='email' value={email} onChange={onEmailHandler} placeholder='abc123@leo.com' />
        <div
          style={{
            padding: '10px 0px',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        ></div>
        <button
          style={{
            width: '120px',
            height: '30px',
            textAlign: 'center',
            color: 'darkgray',
            backgroundColor: 'bisque',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          비밀번호 찾기
        </button>
      </form>
    </div>
  );
};

export default Findpw;
