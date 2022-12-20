import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function PostContent() {
  const [posts, setPosts] = useState([]);
  const postnum = useParams();
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/list/post/${postnum.id}`);
        setPosts(res.data);
        console.log(res.data, 'posttdata');
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  }, []);
  console.log(posts);
  return (
    <div>
      <h1>{postnum.id}</h1>
      <div>{posts.content}</div>
      <div>{posts.writer.id}</div>
    </div>
  );
}

export default PostContent;
