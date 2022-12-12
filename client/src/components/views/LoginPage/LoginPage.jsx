import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../../_actions/user_action';

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [pw, setPW] = useState('');
  const onEmailHandler = function (e) {
    setEmail(e.currentTarget.value);
  };
  const onPwHandler = (e) => {
    setPW(e.currentTarget.value);
  };
  const onSubmitHandler = function (e) {
    e.preventDefault();
    let body = { email: email, password: pw };

    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess === true) {
        alert('Login Sucess');
        navigate('/');
      } else {
        alert('Error');
      }
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        width: '240px',
      }}
    >
      <form
        action=''
        style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onSubmitHandler}
      >
        <label htmlFor=''>E-mail</label>
        <input
          type='email'
          value={email}
          onChange={onEmailHandler}
          placeholder='abc123@leo.com'
        />
        <label htmlFor=''>Password</label>
        <input
          type='password'
          value={pw}
          placeholder='abc!23'
          onChange={onPwHandler}
        />
        <br />
        <button>Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
