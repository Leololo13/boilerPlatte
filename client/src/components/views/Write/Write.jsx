import React from 'react';
import './Write.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Writer } from '../../../_actions/user_action';

function Write() {
  let list = useSelector((state) => {
    return state.rootReducer.list;
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [writtenData, setWrittenData] = useState({
    title: '',
    content: '',
    id: '',
    postnum: '',
    like: 0,
    hate: 0,
    email: '',
    image: null,
  });

  function writtenDataHandler(e) {
    e.preventDefault();
    setWrittenData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  const onSubmitHandler = function (e) {
    e.preventDefault();
    let body = writtenData;
    dispatch(Writer(body)).then((response) => {
      if (!response.payload) {
        alert('Login이 필요한 기능입니다');
        navigate('/user/login');
      }
      if (response.payload.Writesuccess === true) {
        navigate('/list');
      } else {
        alert(response.payload.err.message);
      }
    });
  };
  return (
    <div className='writebox'>
      <form action='' className='writebox-form' onSubmit={onSubmitHandler}>
        <input
          type='text'
          name='title'
          style={{ width: '100%' }}
          placeholder='title'
          onChange={writtenDataHandler}
        />
        <textarea
          name='content'
          placeholder='Content'
          style={{ width: '100%' }}
          onChange={writtenDataHandler}
          rows='30'
        ></textarea>
        <div>img첨부</div>
        <div>댓글첨부등 radiobutton</div>
        <div className='writebox-btn'>
          <button>Go PrevPage</button>

          <button>write</button>
        </div>
      </form>
    </div>
  );
}

export default Write;
