import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

function Recomment(props) {
  const onCloseHandler = () => {
    props.setModalVisibleId('');
  };
  const submitHandler = async () => {
    try {
    } catch (error) {}
  };

  return (
    <div>
      {props.modalVisibleId === props.id ? (
        <>
          <div className='comment-write'>
            <div className='comment-write-main'>
              <div className='comment-write-img'>사진</div>
              <form action='' onSubmit={submitHandler}>
                <input name='content' type='text' />
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
