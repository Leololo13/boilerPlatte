import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Mypage.css';
import { Pagination } from 'antd';
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

function Mypage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const act = searchParams.get('act');
  const [userdata, setUserdata] = useState({});
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [modal, setModal] = useState(false);
  const userId = useRef(null);

  ///page
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const offset = (page - 1) * limit;
  const [total, setTotal] = useState('');

  const logoutHandler = async () => {
    try {
      await axios.get('/api/user/logout').then(alert('로그아웃 성공'));
      navigate('/');
    } catch (error) {
      window.location.reload();
      console.log(error);
    }
  };
  const userPWHandler = async () => {};
  const userInfoHandler = async (e) => {
    setUserdata((prev) => ({ ...prev, nickname: e.target.value }));
  };
  const datasubmitHandler = async () => {
    try {
      await axios.post('/api/user/infochange', userdata).then((res) => {
        if (res.data.infoChangeSuccess) {
          alert('닉네임변경에 성공했습니다');
          navigate('/userpage?act=userInfo');
        } else {
          console.log(res.data, 'false');
        }
      });
    } catch (error) {
      console.log(error);
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
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/user/mypage');
        const { password, refresh_token, access_token, role, posts, comments, ...others } = res.data;
        setUserdata(others);
        userId.current = others?.nickname;
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

  function switchPage() {
    switch (act) {
      case 'userInfo':
        return (
          <div>
            <div className='mypage-userInfo'>
              <p>
                <span style={{ color: 'red' }}>*{'  '}</span>아이디 : {userdata.id}
              </p>
              <p>
                <span style={{ color: 'red' }}>*{'  '}</span>닉네임 : {userdata.nickname}
              </p>
              <p>
                <span style={{ color: 'red' }}>*{'  '}</span>E-mail :{' '}
                {userdata.email ?? '카카오 연동으로 가입시 이메일이 없습니다'}
              </p>
              <p>가입일 : {userdata.signupDate}</p>
              <p>마지막 접속 일시 : {userdata.date}</p>
            </div>
            <div className='mypage-userAction'>
              <button
                onClick={() => {
                  setModal(true);
                }}
              >
                로그아웃
              </button>
              <Link className='link' to={'/userpage?act=userInfoChange'} onClick={userInfoHandler}>
                <button>회원정보 변경하기</button>
              </Link>{' '}
              <Link className='link' to={'/userpage?act=userPWChange'} onClick={userPWHandler}>
                <button>비밀번호 변경하기</button>
              </Link>{' '}
              <button> 회원 탈퇴</button>
            </div>
          </div>
        );
      case 'userInfoChange':
        let IDcondition = /^[a-zA-Zㄱ-힣0-9][a-zA-Zㄱ-힣0-9 ]{2,9}$/;
        return (
          <div>
            <div className='mypage-userInfo'>
              <p>
                <span style={{ color: 'red' }}>*{'  '}</span>아이디 :{' '}
                <input type='text' disabled={true} value={userdata.id} />
              </p>
              <p>
                <span style={{ color: 'red' }}>*{'  '}</span>닉네임 :{' '}
                <input type='text' value={userdata.nickname} onChange={userInfoHandler} />{' '}
                {IDcondition.test(userdata.nickname)
                  ? '사용가능한 닉네임입니다'
                  : '특수문자를 제외한 3~10글자로 입력해주십시오'}
                {/* {console.log(IDcondition.test(userdata.nickname))} */}
              </p>
              <p>
                <span style={{ color: 'red' }}>*{'  '}</span>E-mail :{' '}
                <input type='text' disabled={true} value={userdata.email} />
              </p>
              <p>가입일 : {userdata.signupDate}</p>
              <p>마지막 접속 일시 : {userdata.date}</p>
            </div>
            <div className='mypage-userAction'>
              <Link className='link' to={'/userpage?act=userInfo'}>
                <button>취소</button>
              </Link>{' '}
              <button onClick={datasubmitHandler}>변경하기</button>
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
                          <Link className='link' to={`/list/${post.category}/post/${post.postnum}`}>
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
              <span>
                Page {page}/{Math.ceil(total / limit)}
              </span>
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
                {comments.slice(offset < 0 ? 0 : offset, offset + limit).map((cmt, idx) => {
                  return (
                    <tr key={idx + offset + 1} className='mypage-post-each'>
                      <td>{idx + offset + 1}</td>
                      <td>
                        <Link className='link' to={`/${cmt.topcategory}/all/post/${cmt.postnum}`}>
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
            <button
              onClick={() => {
                setModal(true);
              }}
            >
              로그 아웃
            </button>
          </div>
        );
    }
  }

  return (
    <div>
      <Modal
        isOpen={modal}
        ariaHideApp={false} /// 모달창이 열릴경우 배경컨텐츠를 메인으로 하지않기위해 숨겨줘야한다.
        onRequestClose={() => {
          setModal(false);
        }}
        style={{
          overlay: overlayStyle,
          content: contentStyle,
        }}
      >
        <p>로그아웃 하시겠습니까?</p>
        <div>
          <button
            onClick={() => {
              logoutHandler();
            }}
          >
            예
          </button>
          <button onClick={() => setModal(false)}>아니오</button>
        </div>
      </Modal>
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
      <h3>
        <span ref={userId}>{userId.current} 님의 회원정보입니다</span>
      </h3>
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
