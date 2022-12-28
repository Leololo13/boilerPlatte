import axios from 'axios';

import React from 'react';

import { useState } from 'react';
import { useSelector } from 'react-redux';

function Recomment(props) {
  const user = useSelector((state) => {
    return state.rootReducer.user.userData;
  });
  const onCloseHandler = () => {
    props.setModalVisibleId('');
  };

  const [recomment, setRecomment] = useState({
    content: '',
    writer: user?._id,
    postnum: props.postnum,
    commentnum: 0,
    parentcommentnum: props.commentnum,
    like: [],
    hate: [],
  });

  const inputHandler = (e) => {
    e.preventDefault();
    setRecomment((prev) => ({
      ...prev,
      content: e.target.value,
    }));
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    let body = recomment;
    try {
      await axios
        .post(`/api/post/comment`, body)
        .then(window.location.reload());
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {props.modalVisibleId === props.id ? (
        <>
          <div className='comment-write'>
            <div className='comment-write-main'>
              <div className='comment-write-img'>사진</div>
              <form action='' onSubmit={submitHandler}>
                <input name='content' type='text' onChange={inputHandler} />
                <button> 댓글달기</button>
              </form>
            </div>
          </div>
          <button onClick={onCloseHandler}>닫아버리기</button>
        </>
      ) : null}
    </div>
  );
}

export default Recomment;
