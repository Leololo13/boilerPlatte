import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../../_actions/user_action';
import './Register.css';
import GoogleRegister from '../LoginPage/GoogleRegister';
import { Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios';
import Modal from 'react-modal';
import Agreement from './Agreement';
import GoogleSingup from '../LoginPage/GoogleSingup';

const overlayStyle = {
  position: 'fixed',
  backgroundColor: 'rgba(110, 110, 110, 0.4)',
};

const contentStyle = {
  borderRadius: '5px',
  display: 'flex',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  border: '1px solid #ccc',
  background: '#fff',
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
  outline: 'none',
  height: '720px',
  width: '360px',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0',
  padding: '10px',
  paddingBottom: '20px',
  fontSize: '1.1rem',
  gap: '10px',
};

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function Register() {
  const [form] = Form.useForm();

  // 전화번호 앞 국가번호
  // const prefixSelector = (
  //   <Form.Item name='prefix' noStyle>
  //     <Select
  //       style={{
  //         width: 70,
  //       }}
  //     >
  //       <Option value='86'>+86</Option>
  //       <Option value='87'>+87</Option>
  //     </Select>
  //   </Form.Item>
  // );
  const userName = Form.useWatch('nickname', form);
  const [idCheck, setIDCheck] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const agreementModalHandler = () => {};

  const overlapCheckHandler = async (value) => {
    console.log(userName);
    try {
      await axios.post('/api/user/checkID', { id: value }).then((res) => {
        console.log(res.data);
        if (res.data.message) {
          return false; ///false면 중복이라는소리
        } else return true;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitHandler = function (values) {
    const { agreement, confirm, ...others } = values;
    others.signupDate = new Date();
    let body = others;
    console.log(body);
    dispatch(registerUser(body)).then((response) => {
      if (response.payload.RegisterSuccess === true) {
        alert('가입 성공');
        navigate('/');
      } else {
        console.log(response.payload.err);
        alert(response.payload.message);
      }
    });
  };

  return (
    <div className='registerbox'>
      <Modal
        isOpen={modal}
        ariaHideApp={false} /// 모달창이 열릴경우 배경컨텐츠를 메인으로 하지않기위해 숨겨줘야한다.
        onRequestClose={() => {
          setModal(false);
        }}
        style={{
          overlay: overlayStyle,
          content: contentStyle,
        }}
      >
        <Agreement />
        <Checkbox style={{ width: '240px' }}>
          I have read the{' '}
          <span
            style={{
              color: 'black',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            agreement
          </span>
        </Checkbox>
        <button
          onClick={() => {
            setModal(false);
          }}
        >
          닫기
        </button>
      </Modal>
      {/* <form
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
      </form> */}

      <Form
        {...formItemLayout}
        form={form}
        name='register'
        onFinish={onSubmitHandler}
        initialValues={{}}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0',
          margin: '0',
          maxWidth: '100%',
          width: '300px',
        }}
        layout='vertical'
        scrollToFirstError
      >
        <Form.Item
          name='email'
          label='E-mail'
          className='regi-form-item'
          hasFeedback
          rules={[
            {
              type: 'email',
              message: '이메일 형식으로 입력해주십시오',
            },
            {
              required: true,
              message: '이메일을 입력해주십시오',
            },
          ]}
        >
          <Input className='regi-form-input' style={{ width: '240px' }} />
        </Form.Item>

        <Form.Item
          className='regi-form-item'
          name='password'
          label='Password'
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
            {
              validator(_, value) {
                let condition =
                  /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;

                if (condition.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    '영어,숫자,특수문자를 이용한 8~16자리 비밀번호를 입력하십시오'
                  )
                );
              },
            },
          ]}
          hasFeedback
        >
          <Input.Password style={{ width: '240px' }} />
        </Form.Item>

        <Form.Item
          name='confirm'
          className='regi-form-item'
          label='Confirm Password'
          labelCol={3}
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '비밀번호가 일치하는지 확인 해주십시오',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('비밀번호가 일치하지 않습니다')
                );
              },
            }),
          ]}
        >
          <Input.Password style={{ width: '240px' }} />
        </Form.Item>

        <Form.Item
          name='nickname'
          className='regi-form-item'
          label='Nickname'
          labelCol={3}
          tooltip='현재 사이트에서 사용하실 닉네임입니다.'
          hasFeedback
          rules={[
            {
              required: true,
              message:
                '3글자이상 10글자 이하의 특수문자를 제외한 영어,한글,숫자로 입력해주십시오',
            },
            {
              min: 3,
              message: '3글자 이상 입력하십시오',
            },
            {
              max: 10,
              message: '10글자 이하로 입력하십시오',
            },

            {
              validator(_, value) {
                let condition = /^[a-zA-Zㄱ-힣0-9][a-zA-Zㄱ-힣0-9 ]*$/;

                if (condition.test(value)) {
                  console.log('오케이 여기로온다고?');
                  return Promise.resolve();
                } else {
                  return Promise.reject(
                    new Error('특수문자를 제외한 아이디로 입력해주십시오')
                  );
                }
              },
            },
          ]}
        >
          <Input style={{ width: '240px' }} />
        </Form.Item>

        {/* -============phone number==================== */}
        {/* <Form.Item
          name='phone'
          label='Phone Number'
          rules={[
            {
              required: true,
              message: 'Please input your phone number!',
            },
          ]}
        >
          <Input
            addonBefore={prefixSelector}
            style={{
              width: '100%',
            }}
          />
        </Form.Item> */}

        <Form.Item
          name='agreement'
          valuePropName='checked'
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('Should accept agreement')),
            },
          ]}
        >
          <Checkbox style={{ width: '240px' }}>
            I have read the{' '}
            <span
              onClick={() => {
                setModal(true);
              }}
              style={{
                color: 'black',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              agreement
            </span>
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button
            style={{ backgroundColor: 'bisque', color: 'darkgrey' }}
            type='primary'
            htmlType='submit'
          >
            Register
          </Button>
        </Form.Item>
      </Form>

      {/* <GoogleRegister className='googleRegister' /> */}
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <div style={{ paddingBottom: '15px' }}>-----OR-----</div>
        <GoogleSingup />
      </div>
    </div>
  );
}

export default Register;
