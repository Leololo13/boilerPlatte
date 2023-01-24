import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

function Recomment(props) {
  const initialState = {
    content: '',
    writer: '',
    nickname: '',
    postnum: props.postnum,
    parentcommentnum: props.parentcommentnum,
    like: [],
    hate: [],
    target: props.parentNick,
  };
  const user = useSelector((state) => {
    return state.rootReducer.user.userData;
  });

  const onCloseHandler = () => {
    props.setModalVisibleId('');
  };

  const [recomment, setRecomment] = useState(initialState);

  const inputHandler = (e) => {
    e.preventDefault();

    setRecomment((prev) => ({
      ...prev,
      content: e.target.value,
      writer: user?._id,
      nickname: user?.nickname,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    let body = recomment;

    if (props.editon) {
      try {
        await axios
          .post(`/api/post/comment/${props.commentnum}/edit`, body)
          .then((res) => {
            if (res.data.commentEditSuccess) {
              setRecomment(res.data);
              window.location.reload();
            } else {
              alert(res.data.err.message);
            }
            console.log(res.data, 'ressssssssssssssssssssssssssssss');
          });
        console.log('누름');
        // .then(window.location.reload());
      } catch (error) {
        alert(error.message);
        console.log(error.message);
      }
    } else {
      try {
        await axios
          .post(`/api/post/comment`, body)
          .then(window.location.reload());
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (props.editon) {
      setRecomment((prev) => ({
        ...prev,
        content: [props.value + props.commentnum],
      }));
    } else {
      setRecomment(initialState);
      onCloseHandler();
    }
    console.log(props.editon);
  }, [props.editon]);

  return (
    <div>
      {props.modalVisibleId === props.id ? (
        <div className='recomment-main-edit'>
          <div className='comment-write'>
            <div className='comment-write-main'>
              <div className='comment-write-img'>사진</div>
              <form action='' onSubmit={submitHandler}>
                <input
                  value={recomment.content}
                  name='content'
                  type='text'
                  onChange={inputHandler}
                  placeholder={'@' + recomment.target}
                />
                <button> {props.editon ? '댓글 수정' : '댓글 쓰기'}</button>
              </form>
            </div>
          </div>
          <button onClick={onCloseHandler}>닫기</button>
        </div>
      ) : null}
    </div>
  );
}

export default Recomment;
