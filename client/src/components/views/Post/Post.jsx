import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import './Post.css';
import Comment from './Comment';

function Post() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => {
    return state.rootReducer.user.userData;
  });
  const { id } = useParams();
  const [post, setPost] = useState([]);

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

  //////포스트 받아오기
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
        {/* Dompurify 라이브러리 사용해서 설정해줘야함 */}
        {/* {typeof window !== "undefined" && <div
            dangerouslySetInnerHTML={{
              __html: Dompurify.sanitize(data?.fetchBoard.contents),
            }}></div>}
    */}
        <p
          className='postContent-main'
          dangerouslySetInnerHTML={{ __html: content }}
        ></p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Recusandaeqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq qui
          nihil sit, illo quo corporis deserunt, minima ad illum reprehenderit
          fugiat voluptates deleniti aliquid reiciendis, vero sint nemo quaerat
          repellendus!
        </p>
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
        <Comment />
      </footer>
    </div>
  );
}

export default Post;
