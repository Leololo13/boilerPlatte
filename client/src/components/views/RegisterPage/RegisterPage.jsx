import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterUser } from '../../../_reducers/User_slice';
import { useNavigate } from 'react-router-dom';

const RegisterPage = (props) => {
  const [userdata, setUserdata] = useState({
    id: '',
    password: '',
    name: '',
    lastname: '',
    nickname: '',
    email: '',
  });

  // deconstrution 하는 법 대충 const = {password, ...others} =  userdata;;
  //////////////그담으ㅔ othsers를 쓰면됨
  const [confirmpw, setConfirmPW] = useState('');
  const handleChange = (e) => {
    setUserdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const confirmPwChange = (e) => {
    setConfirmPW(e.target.value);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmitHandler = function (e) {
    let body = userdata;
    e.preventDefault();

    if (userdata.password !== confirmpw) {
      return alert('비밀번호와 비밀번호 확인은 같아야합니다.');
    }
    dispatch(RegisterUser(body)).then((response) => {
      if (response.payload.success === true) {
        navigate('/');
      } else {
        alert(response.payload.message.message);
      }
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <form
        action=''
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <label htmlFor=''>E-mail</label>
        <input
          type='email'
          name='email'
          onChange={handleChange}
          placeholder='abc123@abc.com'
        />{' '}
        <label htmlFor=''>ID</label>
        <input
          type='text'
          name='id'
          onChange={handleChange}
          placeholder='leo12345'
        />{' '}
        <label htmlFor=''>Password</label>
        <input
          type='password'
          name='password'
          onChange={handleChange}
          placeholder='password'
        />{' '}
        <label htmlFor=''>conFifm Password</label>
        <input
          type='password'
          name='confirmpw'
          onChange={confirmPwChange}
          placeholder='confirm password'
        />{' '}
        <label htmlFor=''>Name</label>
        <input
          type='text'
          name='name'
          onChange={handleChange}
          placeholder='KillDong'
        />{' '}
        <label htmlFor=''>Last Name</label>
        <input
          type='text'
          name='lastname'
          onChange={handleChange}
          placeholder='Hong'
        />
        <label htmlFor=''>Nickname</label>
        <input
          type='text'
          name='nickname'
          onChange={handleChange}
          placeholder='Nickname'
        />
        <button onClick={onSubmitHandler}>Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
