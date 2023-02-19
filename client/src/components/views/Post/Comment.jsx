import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Recomment from './Recomment';
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import Modal from 'react-modal';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Pagination } from 'antd';
import useSubmitFetch from './useSubmitFetch';

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
function Comment(props) {
  const user = useSelector((state) => {
    return state.rootReducer.user.userData;
  });
  console.log(props);
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
    image: '',
  };

  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;
  const [total, setTotal] = useState(0);
  const { formsubmitHandler, loading, error } = useSubmitFetch();
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
      image: user.image ?? '',
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
      formsubmitHandler('/api/comment/delete', { commentnum });
      setDeleteModal((prev) => ({ ...prev, open: false }));
      navigate(0);
      console.log(loading);
    }
  };
  const commentModalHandler = (e) => {
    e.preventDefault();
    setCommentOpen(!commentOpen);
  };

  const commentSubmitHandler = async (e) => {
    let body = writtenComment;
    formsubmitHandler('/api/post/comment', body);
    navigate(0);
  };

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await axios.get(`/api/post/${id}/comment`);
        console.log(res.data);
        setComments(res.data.sortedData);
        setTotal(res.data.sortedData.length);
      } catch (error) {
        alert(error, '댓글 로딩 error');
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
            }}
            disabled={loading ? true : false}
          >
            예
          </button>
          <button onClick={() => setDeleteModal((prev) => ({ ...prev, open: false }))}>아니오</button>
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
            {comments.slice(offset < 0 ? 0 : offset, offset + limit).map((comment) => {
              return (
                <div
                  className={comment.parentcommentnum === 0 ? 'comment-main' : 'comment-main-depth'}
                  key={comment._id}
                >
                  <div className='post-comment'>
                    <div className='comment-writer-img'>
                      {comment.image ? (
                        <img src={comment.image} alt='' style={{ borderRadius: '50%' }} />
                      ) : (
                        <Avatar size={56} icon={<UserOutlined />} />
                      )}
                    </div>
                    <div className='comment-main-main'>
                      <div className='comment-info'>
                        <div className='comment-writer'>
                          {' '}
                          {props.writer === comment.nickname ? (
                            <span>
                              {comment.nickname}
                              <CheckOutlined
                                style={{
                                  color: 'green',
                                }}
                              />
                            </span>
                          ) : (
                            comment.nickname
                          )}
                          <div className='comment-time'>{elapsedTime(comment.date)}</div>
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
                              modalVisibleId ? setModalVisibleId('') : recommentModalHandler(comment._id);
                            }}
                            style={{ cursor: 'pointer', fontWeight: 'bold' }}
                            className='comment-recomment'
                            data-id={comment._id}
                          >
                            답댓글달기
                          </div>

                          {(comment.writer === user?._id && comment.role === 1) || user?.isAdmin ? (
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
                                <DeleteOutlined style={{ fontSize: '1.2rem' }} />
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>

                      <div className='comment-content'>
                        {comment.target ? <span className='targetID'>{'@' + comment.target}</span> : null}
                        {comment.content}
                      </div>
                    </div>
                  </div>
                  {/* 리코멘트누를떄 modal비슷한걸 하나 만들어서 값을 보내서 이때만 value를 받게하면될듯함 */}
                  {/* 첫번쨰 댓글이기떄문에 첫번쨰 parentcommentnum=0을따라간다. */}
                  <Recomment
                    id={comment._id}
                    modalVisibleId={modalVisibleId}
                    setModalVisibleId={setModalVisibleId}
                    parentcommentnum={comment.parentcommentnum === 0 ? comment.commentnum : comment.parentcommentnum}
                    commentnum={comment.commentnum}
                    postnum={comment.postnum}
                    parentNick={comment.nickname}
                    value={comment.content}
                    editon={editOn}
                  />
                  {/* recommenttttttttttttttttttttttttttttttt */}
                </div>
              );
            })}
          </>
        ) : null}

        {props?.isAuth ? (
          <div className='comment-write'>
            <div className='comment-write-main'>
              <div className='comment-write-img'>
                {user?.image ? (
                  <img src={user?.image} alt='' style={{ borderRadius: '50%' }} width='56px' />
                ) : (
                  <Avatar size={56} icon={<UserOutlined />} />
                )}
              </div>
              <form action='' onSubmit={commentSubmitHandler}>
                <textarea onChange={dataHandler} name='content' type='text' />
                <button disabled={loading ? true : false}> 댓글 쓰기</button>
              </form>
            </div>
          </div>
        ) : null}
      </div>
      <div className='pagination-box'>
        {' '}
        <Pagination
          defaultPageSize={limit}
          size={'small'}
          defaultCurrent={1}
          showSizeChanger={false}
          current={page}
          total={total}
          onChange={(page) => {
            setPage(page);
          }}
        />
      </div>
    </div>
  );
}

export default Comment;
