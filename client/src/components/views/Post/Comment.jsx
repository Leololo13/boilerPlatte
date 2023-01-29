import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Recomment from './Recomment';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Modal from 'react-modal';

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
  height: '120px',
  width: '360px',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0',
  padding: '0px',
  paddingBottom: '20px',
  fontSize: '1.1rem',
};
function Comment() {
  const user = useSelector((state) => {
    return state.rootReducer.user.userData;
  });
  const navigate = useNavigate();
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
  const [deleteModal, setDeleteModal] = useState({ open: false, num: '' });
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

  const deleteHandler = async (commentnum) => {
    console.log(commentnum);
    if (!user._id) {
      alert('로그인이 필요한 기능입니다');
    } else {
      try {
        axios.post('/api/comment/delete', { commentnum }).then((res) => {
          // console.log(res.data);
          // let cmt = comments.filter(
          //   (comment) => comment.postnum === parseInt(id)
          // );
          // setComments(cmt);
          // console.log(deletedCMT);
        });
      } catch (error) {
        alert(error);
        console.log(error, 'comment delete error');
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
        alert(error, '코멘트 로딩 error');
      }
    };
    fetchComment();
  }, []);

  return (
    <div>
      <Modal
        isOpen={deleteModal.open}
        ariaHideApp={false} /// 모달창이 열릴경우 배경컨텐츠를 메인으로 하지않기위해 숨겨줘야한다.
        onRequestClose={() => {
          setDeleteModal((prev) => ({ ...prev, open: false }));
        }}
        style={{
          overlay: overlayStyle,
          content: contentStyle,
        }}
      >
        <p>이 글을 삭제 하시겠습니까?</p>
        <div>
          <button
            onClick={(e) => {
              console.log(deleteModal.num);
              deleteHandler(deleteModal.num);
              navigate(0);
            }}
          >
            예
          </button>
          <button
            onClick={() => setDeleteModal((prev) => ({ ...prev, open: false }))}
          >
            아니오
          </button>
        </div>
      </Modal>
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
                                setEditOn(false);
                                console.log('닶댓글가즈아', editOn);
                                modalVisibleId
                                  ? setModalVisibleId('')
                                  : recommentModalHandler(comment._id);
                              }}
                              style={{ cursor: 'pointer', fontWeight: 'bold' }}
                              className='comment-recomment'
                              data-id={comment._id}
                            >
                              답댓글달기
                            </div>

                            {(comment.writer === user?._id &&
                              comment.role === 1) ||
                            user?.isAdmin ? (
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
                                    style={{ fontSize: '1.2rem' }}
                                    onClick={() => {
                                      setEditOn(!editOn);
                                      console.log(editOn, 'edit클릭');
                                    }}
                                  />
                                </div>
                                <div
                                  className='comment-delete'
                                  onClick={() => {
                                    setDeleteModal({
                                      open: true,
                                      num: comment.commentnum,
                                    });
                                  }}
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
                                          setEditOn(false);
                                          modalVisibleId
                                            ? setModalVisibleId('')
                                            : recommentModalHandler(
                                                recomment._id
                                              );
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
                                      {(comment.writer === user?._id &&
                                        comment.role === 1) ||
                                      user?.isAdmin ? (
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
                                          <div
                                            data-id={recomment.commentnum}
                                            className='comment-delete'
                                            onClick={() => {
                                              setDeleteModal({
                                                open: true,
                                                num: recomment.commentnum,
                                              });
                                            }}
                                          >
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
