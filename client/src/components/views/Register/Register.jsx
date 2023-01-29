import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../_actions/user_action';
import './Register.css';
import GoogleRegister from '../LoginPage/GoogleRegister';
import { AutoComplete, Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios';

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

// const tailFormItemLayout = {
//   wrapperCol: {
//     xs: {
//       span: 24,
//       offset: 0,
//     },
//     sm: {
//       span: 16,
//       offset: 8,
//     },
//   },
// };

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
          maxWidth: '100%',
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
          <Input className='regi-form-input' />
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
          <Input.Password />
        </Form.Item>

        <Form.Item
          name='confirm'
          className='regi-form-item'
          label='Confirm Password'
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
          <Input.Password />
        </Form.Item>

        <Form.Item
          name='nickname'
          className='regi-form-item'
          label='Nickname'
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
          <Input />
        </Form.Item>
        <div
          className='register-overlap'
          onClick={() => {
            console.log(overlapCheckHandler(userName));
          }}
        >
          닉네임 중복 확인
        </div>
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
          <Checkbox>
            I have read the <a href=''>agreement</a>
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Register
          </Button>
        </Form.Item>
      </Form>
      {/* <GoogleRegister className='googleRegister' /> */}
    </div>
  );
}

export default Register;
