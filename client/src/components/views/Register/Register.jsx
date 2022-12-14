import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../_actions/user_action';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userdata, setUserdata] = useState({
    id: '',
    email: '',
    password: '',
    name: '',
    lastname: '',
    nickname: '',
  });
  const [confirmpw, setConfirmpw] = useState('');
  const datahandler = function (e) {
    e.preventDefault();
    console.log(e.target.value, e.target.name);
    setUserdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const confirmpwHandler = function (e) {
    setConfirmpw((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const onSubmitHandler = function (e) {
    e.preventDefault();
    let body = { email: userdata.email, password: userdata.password };

    dispatch(registerUser(body)).then((response) => {
      if (response.payload.loginSuccess === true) {
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
      className='registerbox'
    >
      <form
        action=''
        style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onSubmitHandler}
        className='register-form'
      >
        <label htmlFor=''>E-mail</label>
        <input
          type='email'
          name='email'
          onChange={datahandler}
          placeholder='ex : abc123@leo.com'
        />
        <label htmlFor=''>ID</label>
        <input
          type='text'
          name='id'
          onChange={datahandler}
          placeholder='ex : leo12345'
        />
        <label htmlFor=''>Password</label>
        <input
          type='password'
          name='password'
          placeholder='ex : abc!23'
          onChange={datahandler}
        />
        <label htmlFor=''>confirm Password</label>
        <input
          type='password'
          name='confirmpw'
          placeholder='ex : abc!23'
          onChange={confirmpwHandler}
        />
        <label htmlFor=''>name</label>
        <input
          type='text'
          name='name'
          onChange={datahandler}
          placeholder='ex : GilDong'
        />{' '}
        <label htmlFor=''>lastname</label>
        <input
          type='text'
          name='lastname'
          value={userdata.lastname}
          onChange={datahandler}
          placeholder='ex : Go'
        />{' '}
        <label htmlFor=''>nickname</label>
        <input
          type='text'
          name='nickname'
          onChange={datahandler}
          placeholder='ex : leo154441'
        />{' '}
        <br />
        <button>Register</button>
      </form>
    </div>
  );
}

export default Register;
