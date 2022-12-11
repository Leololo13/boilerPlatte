import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoginUser } from '../../../_reducers/User_slice';
import { useNavigate } from 'react-router-dom';

const Loginpage = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  const onEmailHandler = function (e) {
    setEmail(e.currentTarget.value);
  };

  const onPwlHandler = function (e) {
    setPw(e.currentTarget.value);
  };

  const onSubmitHandler = function (e) {
    let body = { email: email, password: pw, hello: '??' };
    e.preventDefault();
    dispatch(LoginUser(body)).then((response) => {
      if (response.payload.LoginSuccess === true) {
        navigate('/');
      } else {
        alert('error');
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
          onChange={onEmailHandler}
          placeholder='abc123@abc.com'
        />
        <label htmlFor=''>Password</label>
        <input
          type='password'
          name='pw'
          onChange={onPwlHandler}
          placeholder='password'
        />
        <button onClick={onSubmitHandler}>Login</button>
      </form>
    </div>
  );
};

export default Loginpage;
