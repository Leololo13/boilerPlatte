import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../_actions/user_action';

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
    >
      <form
        action=''
        style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onSubmitHandler}
      >
        <label htmlFor=''>E-mail</label>
        <input
          type='email'
          name='email'
          onChange={datahandler}
          placeholder='abc123@leo.com'
        />
        <label htmlFor=''>ID</label>
        <input
          type='text'
          name='id'
          onChange={datahandler}
          placeholder='leo12345'
        />
        <label htmlFor=''>Password</label>
        <input
          type='password'
          name='password'
          placeholder='abc!23'
          onChange={datahandler}
        />
        <label htmlFor=''>confirm Password</label>
        <input
          type='password'
          name='confirmpw'
          placeholder='abc!23'
          onChange={confirmpwHandler}
        />
        <label htmlFor=''>name</label>
        <input
          type='text'
          name='name'
          onChange={datahandler}
          placeholder='leo'
        />{' '}
        <label htmlFor=''>lastname</label>
        <input
          type='text'
          name='lastname'
          value={userdata.lastname}
          onChange={datahandler}
          placeholder='Cap'
        />{' '}
        <label htmlFor=''>nickname</label>
        <input
          type='text'
          name='nickname'
          onChange={datahandler}
          placeholder='leo154441'
        />{' '}
        <br />
        <button>Login</button>
      </form>
    </div>
  );
}

export default Register;
