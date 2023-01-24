import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import Recomment from './Recomment';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

function Comment() {
  const user = useSelector((state) => {
    return state.rootReducer.user.userData;
  });

  const { id } = useParams();
  let initialState = {
    writer: '',
    content: '',
    postnum: id,
    commentnum: 0,
    nickname: '',
    like: [],
    hate: [],
  };

  const [comments, setComments] = useState([]);
  const [commentOpen, setCommentOpen] = useState(true);
  const [modalVisibleId, setModalVisibleId] = useState('');
  const [writtenComment, setWrittenComment] = useState(initialState);
  const [editOn, setEditOn] = useState(false);
  function elapsedTime(date) {
    const start = new Date(date);
    const end = new Date();

    const diff = (end - start) / 1000;

    const times = [
      { name: '년', milliSeconds: 60 * 60 * 24 * 365 },
      { name: '개월', milliSeconds: 60 * 60 * 24 * 30 },
      { name: '일', milliSeconds: 60 * 60 * 24 },
      { name: '시간', milliSeconds: 60 * 60 },
      { name: '분', milliSeconds: 60 },
    ];

    for (const value of times) {
      const betweenTime = Math.floor(diff / value.milliSeconds);

      if (betweenTime > 0) {
        return `${betweenTime}${value.name} 전`;
      }
    }
    return '방금 전';
  }
  /////

  //////

  function dataHandler(e) {
    e.preventDefault();
    setWrittenComment((prev) => ({
      ...prev,
      content: e.target.value,
      writer: user._id,
      nickname: user.nickname,
    }));
  }

  function recommentModalHandler(id) {
    if (!user._id) {
      alert('로그인이필요한기능입니다');
    } else {
      setModalVisibleId(id);
    }
  }

  const deleteHandler = async (e) => {
    e.preventDefault();
    let commentnum = e.target.dataset;

    if (!user._id) {
      alert('로그인이 필요한 기능입니다');
    } else {
      try {
        axios.post('/api/comment/delete', commentnum).then((res) => {
          let cmt = comments.filter(
            (comment) => comment.postnum === parseInt(id)
          );

          setComments(cmt);
          // console.log(deletedCMT);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const commentModalHandler = (e) => {
    e.preventDefault();
    setCommentOpen(!commentOpen);
  };

  const commentSubmitHandler = async (e) => {
    e.preventDefault();
    let body = writtenComment;

    try {
      await axios
        .post(`/api/post/comment`, body)
        .then(window.location.reload());
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await axios.get(`/api/post/${id}/comment`);
        console.log(res.data.data);
        setComments(res.data.data);
      } catch (error) {
        alert(error);
      }
    };
    fetchComment();
  }, []);

  return (
    <div>
      {' '}
      <div className='footer-comment'>
        <div className='comment-title'>
          <p className='comment-modal' onClick={commentModalHandler}>
            댓글 <span>{comments.length}</span>
          </p>
        </div>

        {commentOpen ? (
          <>
            {comments
              .filter((comment) => comment.parentcommentnum === 0)
              .map((comment) => {
                return (
                  <div className='comment-main' key={comment._id}>
                    <div className='post-comment'>
                      <div className='comment-writer-img'>?</div>
                      <div className='comment-main-main'>
                        <div className='comment-info'>
                          <div className='comment-writer'>
                            {comment.nickname}

                            <div className='comment-time'>
                              {elapsedTime(comment.date)}
                            </div>
                          </div>

                          <div className='comment-action'>
                            <div className='comment-likehate'>
                              {' '}
                              {comment.like.length}/ {comment.hate.length}
                            </div>
                            <div
                              onClick={() => {
                                recommentModalHandler(comment._id);
                              }}
                              style={{ cursor: 'pointer', fontWeight: 'bold' }}
                              className='comment-recomment'
                              data-id={comment._id}
                            >
                              답댓글달기
                            </div>
                            {comment.writer === user?._id ? (
                              <>
                                <div
                                  className='comment-edit'
                                  onClick={() => {
                                    recommentModalHandler(comment._id);
                                  }}
                                  style={{ cursor: 'pointer' }}
                                  data-id={comment.content}
                                >
                                  <EditOutlined
                                    data-id={'hello'}
                                    style={{ fontSize: '1.2rem' }}
                                    onClick={() => {
                                      setEditOn(!editOn);
                                      console.log(editOn, 'edit클릭');
                                    }}
                                  />
                                </div>
                                <div
                                  data-id={comment.commentnum}
                                  className='comment-delete'
                                  onClick={deleteHandler}
                                >
                                  <DeleteOutlined
                                    style={{ fontSize: '1.2rem' }}
                                  />
                                </div>
                              </>
                            ) : null}
                          </div>
                        </div>

                        <div className='comment-content'>{comment.content}</div>
                      </div>
                    </div>
                    {/* 리코멘트누를떄 modal비슷한걸 하나 만들어서 값을 보내서 이때만 value를 받게하면될듯함 */}
                    {/* 첫번쨰 댓글이기떄문에 첫번쨰 parentcommentnum=0을따라간다. */}
                    <Recomment
                      id={comment._id}
                      modalVisibleId={modalVisibleId}
                      setModalVisibleId={setModalVisibleId}
                      parentcommentnum={comment.commentnum}
                      commentnum={comment.commentnum}
                      postnum={comment.postnum}
                      parentNick={comment.nickname}
                      value={comment.content}
                      editon={editOn}
                    />
                    {/* recommenttttttttttttttttttttttttttttttt */}
                    <>
                      {comments
                        .filter(
                          (cmt) => cmt.parentcommentnum === comment.commentnum
                        )
                        .map((recomment) => {
                          return (
                            <div className='recomment-main' key={recomment._id}>
                              <div
                                className='post-comment'
                                style={{
                                  marginLeft: '20px',
                                  padding: '10px',
                                  paddingBottom: '0px',
                                  borderTop: '1px solid burlywood',
                                }}
                              >
                                <div className='comment-writer-img'>?</div>
                                <div className='comment-main-main'>
                                  <div className='comment-info'>
                                    <div className='comment-writer'>
                                      {recomment.nickname}
                                      <div className='comment-time'>
                                        {elapsedTime(recomment.date)}
                                      </div>
                                    </div>

                                    <div className='comment-action'>
                                      <div className='comment-likehate'>
                                        {recomment.like.length}/{' '}
                                        {recomment.hate.length}
                                      </div>
                                      <div
                                        onClick={() => {
                                          recommentModalHandler(recomment._id);
                                        }}
                                        style={{
                                          cursor: 'pointer',
                                          fontWeight: 'bold',
                                        }}
                                        className='comment-recomment'
                                        data-id={recomment._id}
                                      >
                                        답댓글달기
                                      </div>
                                      {comment.writer === user?._id ? (
                                        <>
                                          {' '}
                                          <div
                                            className='comment-edit'
                                            onClick={() => {
                                              recommentModalHandler(
                                                recomment._id
                                              );
                                            }}
                                            style={{ cursor: 'pointer' }}
                                            data-id={comment._id}
                                          >
                                            <EditOutlined
                                              style={{ fontSize: '1.2rem' }}
                                              onClick={() => {
                                                setEditOn(!editOn);

                                                console.log(
                                                  editOn,
                                                  'edit2클릭'
                                                );
                                              }}
                                            />
                                          </div>
                                          <div className='comment-delete'>
                                            <DeleteOutlined
                                              style={{ fontSize: '1.2rem' }}
                                            />
                                          </div>{' '}
                                        </>
                                      ) : null}
                                    </div>
                                  </div>

                                  <div className='comment-content'>
                                    <span className='targetID'>
                                      {recomment.target
                                        ? '@' + recomment.target
                                        : ''}
                                    </span>

                                    {recomment.content}
                                  </div>
                                </div>
                              </div>
                              <Recomment
                                id={recomment._id}
                                modalVisibleId={modalVisibleId}
                                setModalVisibleId={setModalVisibleId}
                                parentcommentnum={recomment.parentcommentnum}
                                commentnum={recomment.commentnum}
                                postnum={recomment.postnum}
                                parentNick={recomment.nickname}
                                value={recomment.content}
                                editon={editOn}
                              />
                            </div>
                          );
                        })}
                    </>
                  </div>
                );
              })}
          </>
        ) : null}

        {user?.id ? (
          <div className='comment-write'>
            <p>댓글쓰기</p>
            <div className='comment-write-main'>
              <div className='comment-write-img'>?</div>
              <form action='' onSubmit={commentSubmitHandler}>
                <input onChange={dataHandler} name='content' type='text' />
                <button> 댓글달기</button>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Comment;
