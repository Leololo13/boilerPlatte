import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './Post.css';

function Post() {
  const location = useLocation();
  const { id } = useParams();
  const [post, setPost] = useState([]);
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
        console.log('h', res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPost();
  }, [id]);

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
        <article className='postContent-main'>{post.content}</article>
        <footer className='postContent-footer'>
          <button className='like'>좋아요 👍 {post.like}</button>
          <button className='hate'>싫어요 🤢 {post.hate}</button>
        </footer>
      </main>
      <footer className='postFooter'>
        <div className='post-list'>list</div>
        <div className='share'>share</div>
        <div className='repl'>repl</div>
      </footer>
    </div>
  );
}

export default Post;
