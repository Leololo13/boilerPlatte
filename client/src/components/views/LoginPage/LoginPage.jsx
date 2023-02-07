import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser } from '../../../_actions/user_action';
import './Login.css';
import GooglSignin from './GooglSignin';
import KakaoLogin from './KakaoLogin';

function LoginPage() {
  const location = useLocation();
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
    let body = { email: email, password: pw, date: new Date() };

    dispatch(loginUser(body)).then((response) => {
      if (response.payload.LoginSuccess === true) {
        alert('Login Sucess');
        navigate(location.state?.background);
        window.location.reload();
      } else {
        alert(response.payload.message);
      }
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        width: '240px',
        gap: '10px',
      }}
      className='loginpage'
    >
      <form
        action=''
        style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onSubmitHandler}
        className='login-form'
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
      <div className='register-config'>
        <span style={{ display: 'flex', gap: '5px' }}>
          <GooglSignin /> <KakaoLogin />
        </span>
        아직 회원이 아니신가요?
        <button>
          <Link to='/user/register' className='link'>
            Register
          </Link>
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
