import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './Mypage.css';
import { Pagination } from 'antd';
function Mypage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const act = searchParams.get('act');
  const [userdata, setUserdata] = useState({});
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  ///page
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const offset = (page - 1) * limit;
  const [total, setTotal] = useState('');

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
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/user/mypage');
        const {
          password,
          refresh_token,
          access_token,
          role,
          posts,
          comments,
          ...others
        } = res.data;
        setUserdata(others);
        setComments(comments.reverse());
        setPosts(posts.reverse());
        setTotal(act === 'post' ? posts.length : comments.length);
        console.log(comments);
      } catch (error) {
        alert(error);
        console.log(error.message);
      }
    };

    fetchUser();
  }, []);
  console.log(total);
  function switchPage() {
    switch (act) {
      case 'userInfo':
        return (
          <div>
            <div className='mypage-userInfo'>
              <p>
                <span style={{ color: 'red' }}>*{'  '}</span>아이디 :{' '}
                {userdata.id}
              </p>
              <p>
                <span style={{ color: 'red' }}>*{'  '}</span>닉네임 :{' '}
                {userdata.nickname}
              </p>
              <p>
                <span style={{ color: 'red' }}>*{'  '}</span>E-mail :{' '}
                {userdata.email}
              </p>
              <p>가입일 : {userdata.signupDate}</p>
              <p>마지막 접속 일시 : {userdata.date}</p>
            </div>
            <div className='mypage-userAction'>
              <button>로그아웃</button>
              <button>회원정보 변경하기</button>
              <button>비밀번호 변경</button>
              <button> 회원 탈퇴</button>
            </div>
          </div>
        );
      case 'post':
        return (
          <div className='mypage-posts'>
            <h3 style={{ padding: '0px', margin: '10px 0px' }}>작성글 보기</h3>
            <div className='mypage-postsInfo'>
              <span>총 게시글 수: {total} </span>
              <span>
                Page {page}/{Math.ceil(total / limit)}
              </span>
            </div>
            <table className='mypage-post-table'>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th>작성일</th>
                  <th>추천수</th>
                </tr>
              </thead>
              <tbody>
                {posts

                  .slice(offset < 0 ? 0 : offset, offset + limit)

                  .map((post, idx) => {
                    return (
                      <tr key={idx + offset + 1} className='mypage-post-each'>
                        <td>{idx + offset + 1}</td>
                        <td>
                          <Link
                            className='link'
                            to={`/list/${post.category}/post/${post.postnum}`}
                          >
                            {post.title}
                          </Link>
                        </td>
                        <td>{elapsedTime(post.date)}</td>
                        <td>
                          {post.like.length}/{post.hate.length}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <Pagination
              showQuickJumper
              showTotal={(total) => `총 ${total} 게시물`}
              defaultPageSize={limit}
              size={'small'}
              defaultCurrent={1}
              showSizeChanger={false}
              total={total}
              current={page}
              onChange={(page) => {
                setPage(page);
              }}
            />
          </div>
        );
      case 'comment':
        return (
          <div className='mypage-posts'>
            <h3 style={{ padding: '0px', margin: '10px 0px' }}>작성글 보기</h3>
            <div className='mypage-postsInfo'>
              <span>총 댓글 수: {total} </span>
              <span>Page {page}/1</span>
            </div>
            <table className='mypage-post-table'>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>댓글 내용</th>
                  <th>작성일</th>
                  <th>추천수</th>
                </tr>
              </thead>
              <tbody>
                {comments

                  .slice(offset < 0 ? 0 : offset, offset + limit)

                  .map((cmt, idx) => {
                    return (
                      <tr key={idx + offset + 1} className='mypage-post-each'>
                        <td>{idx + offset + 1}</td>
                        <td>
                          <Link
                            className='link'
                            to={`/list/all/post/${cmt.postnum}`}
                          >
                            {cmt.content}
                          </Link>
                        </td>
                        <td>{elapsedTime(cmt.date)}</td>
                        <td>
                          {cmt.like.length}/{cmt.hate.length}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <Pagination
              showQuickJumper
              showTotal={(total) => `총 ${total} 게시물`}
              defaultPageSize={limit}
              size={'small'}
              defaultCurrent={1}
              showSizeChanger={false}
              total={total}
              current={page}
              onChange={(page) => {
                setPage(page);
              }}
            />
          </div>
        );
      default:
        return (
          <div>
            <p>잘못된 요청입니다</p>
            <button>메인화면으로 돌아가기</button>
            <button>로그 아웃</button>
          </div>
        );
    }
  }

  return (
    <div>
      <header className='mypage-headerbox'>
        <Link to={'/userpage?act=userInfo'} className='link'>
          회원 정보 보기
        </Link>
        <Link to={'/userpage?act=scrap'} className='link'>
          스크랩 보기
        </Link>
        <Link to={'/userpage?act=post'} className='link'>
          작성 글보기
        </Link>
        <Link to={'/userpage?act=comment'} className='link'>
          작성 댓글 보기
        </Link>
        <Link to={'/userpage?act=userInfo'} className='link'>
          회원정보보기
        </Link>
      </header>
      <h3>{userdata.nickname} 님의 회원정보입니다</h3>
      <main className='mypage-main'>
        {switchPage()}
        {/* {act === 'userInfo' ? (
          <>
            <div className='mypage-userInfo'>
              <p>*아이디 : {userdata.id}</p>
              <p>*닉네임 : {userdata.nickname}</p>
              <p>*E-mail : {userdata.email}</p>
              <p>가입일 : {userdata.signupDate}</p>
              <p>마지막 접속 일시 : {userdata.date}</p>
            </div>
            <div className='mypage-userAction'>
              <button>로그아웃</button>
              <button>회원정보 변경하기</button>
              <button>비밀번호 변경</button>
              <button> 회원 탈퇴</button>
            </div>
          </>
        ) : null} */}
      </main>
    </div>
  );
}

export default Mypage;
