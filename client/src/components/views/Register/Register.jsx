import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../_actions/user_action';
import './Register.css';
import { Button, Checkbox, Form, Input } from 'antd';
import Modal from 'react-modal';
import Agreement from './Agreement';
import GoogleSingup from '../LoginPage/GoogleSingup';
import KakaoSignup from '../LoginPage/KakaoSignup';
import useSubmitFetch from '../Post/useSubmitFetch';
import axios from 'axios';
import { useEffect } from 'react';

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
  height: '80vh',
  width: '69vw',
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

function Register() {
  const [checked, setChecked] = useState(false);
  const [form] = Form.useForm();
  const nameValue = Form.useWatch('nickname', form);
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
  const [loading, setLoading] = useState(false);
  const [checkID, setCheckID] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);

  const onChange = (e) => {
    console.log('checked = ', e.target.checked);
    setChecked(e.target.checked);
  };
  const onSubmitHandler = function (values) {
    setLoading(true);
    const { agreement, confirm, ...others } = values;
    others.signupDate = new Date();
    let body = others;
    dispatch(registerUser(body)).then((response) => {
      if (response.payload.isloading) {
        setLoading(true);
        console.log(response);
      } else if (response.payload.RegisterSuccess === true) {
        console.log(response);
        alert('가입 성공');
        setLoading(false);
        navigate('/');
      } else {
        console.log(response);
        alert(response.payload.message);
      }
    });
  };
  const checkEmail = async () => {
    if (
      form.getFieldError('email').length === 0 &&
      form.getFieldValue('email')
    ) {
      let email = { email: form.getFieldValue('email') };
      console.log(email);
      try {
        await axios.post('/api/user/checkID', email).then((res) => {
          console.log(res);
          if (!res.data.CheckID) {
            form.setFields([
              {
                name: 'email',
                errors: ['사용중인 이메일 입니다'],
              },
            ]);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const checIdFetch = async () => {
    if (
      form.getFieldError('nickname').length === 0 &&
      form.getFieldValue('nickname')
    ) {
      let id = { id: form.getFieldValue('nickname') };
      console.log(id);
      try {
        await axios.post('/api/user/checkID', id).then((res) => {
          console.log(res);
          if (!res.data.CheckID) {
            form.setFields([
              {
                name: 'nickname',
                errors: ['사용중인 닉네임 입니다'],
              },
            ]);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  console.log(checked, 'checheijdd');
  useEffect(() => {
    console.log('useeffect');
  }, [checked, checkID, modal]);
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
        <Checkbox
          className='agreement-checkbox'
          defaultChecked={checked}
          onChange={onChange}
        >
          위의 내용을 모두 읽었으며
          <span
            className='agrement-check'
            style={{
              color: 'black',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {'  '}동의{'  '}
          </span>
          합니다
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
          <Input
            onBlur={checkEmail}
            className='regi-form-input'
            style={{ width: '240px' }}
          />
        </Form.Item>
        <Form.Item
          className='regi-form-item'
          name='password'
          label='비밀번호'
          rules={[
            {
              required: true,
              message: '비밀번호를 입력해주십시오',
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
          label='비밀번호 일치 확인'
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
          label='닉네임'
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
          <Input style={{ width: '240px' }} onBlur={checIdFetch} />
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
        <div>
          <span
            className='agrement-check'
            onClick={() => {
              setModal(true);
            }}
          >
            {' '}
            약관 사항 읽어보기
          </span>
        </div>{' '}
        <Form.Item
          name='agreement'
          valuePropName='checked'
          style={{ textAlign: 'center' }}
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error('관련 약관을 읽어보신 후 동의하셔야합니다')
                    ),
            },
          ]}
        >
          <Checkbox
            className='agreement-checkbox'
            checked={checked}
            defaultChecked={checked}
            onChange={onChange}
            style={{ width: '240px', fontSize: '0.8rem' }}
          >
            약관 사항 을 모두 읽었으며 동의합니다.
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button
            // disabled={loading ? true : false}
            style={{ backgroundColor: 'bisque', color: 'darkgrey' }}
            type='primary'
            htmlType='submit'
          >
            회원가입
          </Button>
        </Form.Item>
      </Form>

      {/* <GoogleRegister className='googleRegister' /> */}
      <footer
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <div>-----OR-----</div>
        <span style={{ display: 'flex', gap: '5px' }}>
          <GoogleSingup />

          <KakaoSignup />
        </span>
      </footer>
    </div>
  );
}

export default Register;
