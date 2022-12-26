import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Recomment from './Recomment';

function Comment() {
  const user = useSelector((state) => {
    return state.rootReducer.user.userData;
  });
  const { id } = useParams();
  /////
  const [comments, setComments] = useState([]);
  const [commentOpen, setCommentOpen] = useState(true);
  const [modalVisibleId, setModalVisibleId] = useState('');
  const [writtenComment, setWrittenComment] = useState({
    writer: user?._id,
    content: '',
    postnum: id,
    commentnum: 0,
    like: [],
    hate: [],
  });
  //////
  function recommentModalHandler(id) {
    setModalVisibleId(id);
  }
  const commentModalHandler = (e) => {
    e.preventDefault();
    setCommentOpen(!commentOpen);
  };
  function dataHandler(e) {
    e.preventDefault();
    setWrittenComment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  const commentSubmitHandler = async (e) => {
    e.preventDefault();
    console.log('pushed submit button');
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
        setComments(res.data.data);
      } catch (error) {
        alert(error);
      }
    };
    fetchComment();
  }, [comments.length]);

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
            {comments.map((comment) => {
              return (
                <div className='comment-main' key={comment._id}>
                  <div className='post-comment'>
                    <div className='comment-writer-img'>?</div>
                    <div className='comment-main-main'>
                      <div className='comment-info'>
                        <div className='comment-writer'>
                          {comment.id}
                          <div className='comment-time'>{comment.date}</div>
                        </div>

                        <div className='comment-action'>
                          <div className='comment-likehate'>
                            {' '}
                            {comment.like.length}/ {comment.hate.length}
                          </div>
                          <div
                            onClick={() => {
                              recommentModalHandler(comment._id);
                              console.log(modalVisibleId);
                            }}
                            style={{ cursor: 'pointer' }}
                            className='comment-recomment'
                            data-id={comment._id}
                          >
                            답댓글달기
                          </div>
                          <div className='comment-edit'>수정하기 </div>
                          <div className='comment-edit'> 지우기</div>
                        </div>
                      </div>

                      <div className='comment-content'>{comment.content}</div>
                    </div>
                  </div>{' '}
                  <Recomment
                    id={comment._id}
                    modalVisibleId={modalVisibleId}
                    setModalVisibleId={setModalVisibleId}
                    commentnum={comment.commentnum}
                  />
                </div>
              );
            })}
          </>
        ) : null}

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
      </div>
    </div>
  );
}

export default Comment;
