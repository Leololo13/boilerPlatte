import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

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
      image: user?.image,
    }));
  };

  const submitHandler = async (e) => {
    let body = recomment;

    if (props.editon) {
      try {
        await axios.post(`/api/post/comment/${props.commentnum}/edit`, body).then((res) => {
          if (res.data.commentEditSuccess) {
            setRecomment(res.data);
            window.location.reload();
          } else {
            alert(res.data.err.message);
          }
        });
        console.log('누름');
        // .then(window.location.reload());
      } catch (error) {
        alert(error.message);
        console.log(error.message);
      }
    } else {
      try {
        await axios.post(`/api/post/comment`, body).then(window.location.reload());
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (props.editon) {
      setRecomment((prev) => ({
        ...prev,
        content: [props.value],
      }));
    } else {
      setRecomment(initialState);
      onCloseHandler();
    }
  }, [props.editon]);

  return (
    <>
      {props.modalVisibleId === props.id ? (
        <div className='recomment-write-main'>
          <div className='comment-write-img'>
            {user?.image ? (
              <img src={user?.image} alt='' width='56px' style={{ borderRadius: '50%' }} />
            ) : (
              <Avatar size={56} icon={<UserOutlined />} />
            )}
          </div>

          <form action='' onSubmit={submitHandler}>
            <textarea
              value={
                recomment.content.length >= 200
                  ? alert('200글자가 넘었습니다. 댓글은 200글자 밑으로 적어주십시오.')
                  : recomment.content
              }
              name='content'
              type='text'
              onChange={inputHandler}
              placeholder={'@' + recomment.target}
            />
            <button> {props.editon ? '댓글 수정' : '댓글 쓰기'}</button>
          </form>
        </div>
      ) : null}
    </>
  );
}

export default Recomment;
