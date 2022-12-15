import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function PostContent() {
  const [posts, setPosts] = useState([]);
  const postnum = useParams();

  //   useEffect(() => {
  //     const fetchPost = async () => {
  //       try {
  //         const res = await axios.get(`/api/list/${postnum}`);
  //         setPosts(res.data);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //     fetchPost();
  //   }, []);

  return (
    <div>
      <h1>하이하이하이재댜ㅓㄹ대쟈ㅓㄹ</h1>
    </div>
  );
}

export default PostContent;
