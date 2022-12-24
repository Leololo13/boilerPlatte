import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { CommentWrite } from '../../../_actions/user_action';
import './Post.css';

function Post() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => {
    return state.rootReducer.user.userData;
  });
  const { id } = useParams();
  const [commentOpen, setCommentOpen] = useState(true);

  const [post, setPost] = useState([]);
  const commentModalHandler = (e) => {
    e.preventDefault();
    setCommentOpen(!commentOpen);
  };

  const [comment, setComment] = useState({
    writer: user?._id,
    content: '',
    postnum: id,
    like: 0,
    hate: 0,
  });
  function dataHandler(e) {
    e.preventDefault();
    setComment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(comment);
  }
  const commentSubmitHandler = async (e) => {
    e.preventDefault();
    let body = comment;
    dispatch(CommentWrite(body)).then((response) => response.data);
  };

  const postDeletehandler = async () => {
    try {
      await axios.post(`/api/post/delete/${id}`).then(navigate('/list'));
    } catch (error) {
      alert(error);
    }
  };

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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/list/post/${id}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPost();
  }, [id]);
  let content = post.content;
  return (
    <div className='post'>
      <header className='postHead'>
        <h3 className='post-title'>{post.title}</h3>
        <div className='postInfo'>
          <div className='postInfo-info'>
            {' '}
            <p className='id'>{post.id}</p>
            <p className='date'>{elapsedTime(post.date)}</p>
            <p className='views'>{post.views}</p>
          </div>
          <div className='postlink'>
            <div>
              link Icon
              <img src='' alt='' />
            </div>
            <a href={location.pathname}>
              http://localhost:3000{location.pathname}
            </a>
          </div>
        </div>
      </header>
      <main className='postContent'>
        <div
          className='postContent-main'
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
        <footer className='postContent-footer'>
          <button className='like'>좋아요 👍 {post.like}</button>
          <button className='hate'>싫어요 🤢 {post.hate}</button>
        </footer>
      </main>
      <footer className='postFooter'>
        <div className='share-edit'>
          <div className='footer-share'>share</div>
          {user?.id === post.id ? (
            <div className='footer-editbox'>
              {' '}
              <Link to={`/api/post/edit/${id}`}>
                <button className='footer-editbox-edit'>edit</button>{' '}
              </Link>
              <button
                className='footer-editbox-delete'
                onClick={postDeletehandler}
              >
                delete
              </button>
            </div>
          ) : null}
        </div>

        <div className='footer-comment'>
          <div className='comment-title'>
            <p className='comment-modal' onClick={commentModalHandler}>
              댓글
            </p>
          </div>
          {commentOpen ? (
            <div className='comment-main'>
              <div className='post-comment'>
                <div className='comment-writer-img'>잘생긴사진</div>
                <div className='comment-main-main'>
                  <div className='comment-info'>
                    <div className='comment-writer'>
                      leo123123 <div className='comment-time'>10분전</div>
                    </div>

                    <div className='comment-action'>
                      <div className='comment-likehate'> 0/0</div>
                      <div className='comment-commentwrite'>답댓글달기</div>
                      <div className='comment-edit'>수정하기 </div>
                      <div className='comment-edit'> 지우기</div>
                    </div>
                  </div>

                  <div className='comment-content'>안녕하세요 댓글이에오</div>
                </div>
              </div>
            </div>
          ) : null}
          <div className='comment-write'>
            <p>댓글쓰기</p>
            <div className='comment-write-main'>
              <div className='comment-write-img'>사진</div>
              <form action='' onSubmit={commentSubmitHandler}>
                <input onChange={dataHandler} name='content' type='text' />
                <button> 댓글달기</button>
              </form>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Post;
