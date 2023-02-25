import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Mypage.css';
import { message, Pagination } from 'antd';
import Modal from 'react-modal';
import { CheckOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

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

function Timechanger(time) {
  const curr = new Date(time);
  let year = curr.getFullYear();
  let month = curr.getMonth() + 1;
  let date = curr.getDate();
  let h = curr.getHours();
  let m = curr.getMinutes();

  const timenow = year + '년 ' + month + '월 ' + date + '일 ' + h + '시 ' + m + '분';
  return timenow;
}

function Mypage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const act = searchParams.get('act');
  const [userdata, setUserdata] = useState({});
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [scraps, setScraps] = useState([]);
  const [modal, setModal] = useState(false);
  const userId = useRef(null);
  const IDcondition = /^[a-zA-Zㄱ-힣0-9][a-zA-Zㄱ-힣0-9 ]{2,9}$/;

  ///page
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const offset = (page - 1) * limit;
  const [total, setTotal] = useState(0);
  const [checkpw, setCheckpw] = useState({
    bfpw: '',
    afpw: '',
    cfpw: '',
    message: '',
    check: false,
  });

  const logoutHandler = async () => {
    try {
      await axios.get('/api/user/logout').then(alert('로그아웃 성공'));
      navigate('/');
    } catch (error) {
      window.location.reload();
      console.log(error);
    }
  };
  const userPWHandler = async (e) => {
    console.log({ ...checkpw, [e.target.name]: e.target.value });
    setCheckpw((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const checkPwHandler = async (e) => {
    console.log(checkpw);
    let body = { email: userdata.email, password: checkpw.bfpw };
    try {
      await axios.post('/api/user/pwcheck', body).then((res) => {
        if (res.data.PWCheck) {
          setCheckpw((prev) => ({
            ...prev,
            check: true,
            message: res.data.message,
          }));
        } else {
          setCheckpw((prev) => ({
            ...prev,
            check: false,
            message: res.data.message,
          }));
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const userInfoHandler = async (e) => {
    setUserdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  console.log(userdata);
  const datasubmitHandler = async (e) => {
    let action = e.target.dataset.action;
    console.log(e.target.dataset.action);
    if (action === 'changeinfo') {
      if (IDcondition.test(userdata.nickname)) {
        try {
          await axios.post(`/api/user/infochange?act=info`, userdata).then((res) => {
            if (res.data.infoChangeSuccess) {
              alert('닉네임변경에 성공했습니다');
              navigate('/userpage?act=userInfo');
            } else {
              alert(res.data.message);
              console.log(res.data, 'false');
            }
          });
        } catch (error) {
          alert(message);
          console.log(error);
        }
      } else {
        alert('닉네임 양식이 잘못되었습니다. 특수문자를 제외하고 3~10 글자로 입력해 주십시오');
      }
    } else if (action === 'changepw') {
      if (!checkpw.check) {
        alert('현재 비밀번호가 일치하지 않습니다');
      } else if (checkpw.afpw !== checkpw.cfpw) {
        alert('새 비밀번호가 일치하지 않습니다');
      } else {
        try {
          await axios.post('/api/user/infochange?act=pw', { pw: checkpw.cfpw }).then((res) => {
            if (res.data.infoChangeSuccess) {
              console.log(res.data.message);
              alert('비밀번호 변경에 성공했습니다');
              navigate('/userpage?act=userInfo');
            } else {
              alert(res.data.message);
              console.log(res.data, 'false');
            }
          });
        } catch (error) {
          alert(message);
          console.log(error);
        }
      }
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
        const { password, refresh_token, access_token, scrap, posts, comments, ...others } = res.data;
        setUserdata(others);
        console.log(scrap);
        userId.current = others?.nickname;
        setComments(comments.reverse());
        setScraps(scrap.reverse());
        setPosts(posts.reverse());
        setTotal(act === 'post' ? posts.length : act === 'comments' ? comments.length : scrap.length);
      } catch (error) {
        alert(error);
        console.log(error.message);
      }
    };

    fetchUser();
  }, []);
  const [time, setTime] = useState(0);
  const [timeron, setTimeron] = useState(false);
  const count = useRef(null);
  const interval = useRef(null);
  useEffect(() => {
    console.log('된긴함?');
    if (time >= 0) {
      console.log('들어옴');
      interval.current = setInterval(() => {
        count.current -= 1;
        setTime(count.current);
      }, 1000);
    }
  }, [timeron]);

  useEffect(() => {
    if (count.current <= 0) {
      clearInterval(interval.current);
    }
  }, [time]);

  const sendMail = async (email) => {
    console.log('클릭', email);
    try {
      await axios.post('/api/user/sendVmail', { email }).then((res) => {
        console.log(res.data);
        setTime(res.data.validtime);
        count.current = res.data.validtime;
        setTimeron(true);
      });
    } catch (error) {
      console.log(error);
    }
  };
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
              <p>가입일 : {Timechanger(userdata.signupDate)}</p>
              <p>마지막 접속 일시 : {Timechanger(userdata?.date)}</p>
            </div>
            <div className='mypage-userAction'>
              <button
                className='mypage-button'
                onClick={() => {
                  setModal(true);
                }}
              >
                로그아웃
              </button>
              <Link className='link' to={'/userpage?act=userInfoChange'} onClick={userInfoHandler}>
                <button className='mypage-button'>회원정보 변경하기</button>
              </Link>{' '}
              {userdata.role === 2 ? null : (
                <Link className='link' to={'/userpage?act=userPWChange'}>
                  <button className='mypage-button'>비밀번호 변경하기</button>
                </Link>
              )}
              <button className='mypage-button'> 회원 탈퇴</button>
            </div>
          </div>
        );
      case 'userInfoChange':
        return (
          <div>
            <div className='mypage-userInfo'>
              <p>
                <span style={{ color: 'red' }}>*{'  '}</span>아이디 :{' '}
                <input type='text' disabled={true} value={userdata.id} />
              </p>

              <p>
                <span style={{ color: 'red' }}>*{'  '}</span>닉네임 :{' '}
                <input type='text' name='nickname' value={userdata.nickname} onChange={userInfoHandler} />
                {IDcondition.test(userdata.nickname) ? (
                  <CheckOutlined style={{ padding: '0px 5px', color: 'green' }} />
                ) : (
                  <span style={{ fontSize: '0.8rem' }}>
                    <CheckOutlined style={{ padding: '0px 5px', color: 'red' }} /> 특수문자를 제외한 3~10글자로
                    입력해주십시오
                  </span>
                )}
                {/* {console.log(IDcondition.test(userdata.nickname))} */}
              </p>
              <p>
                <span style={{ color: 'red' }}>*{'  '}</span>E-mail :{' '}
                <input type='text' disabled={true} value={userdata.email} />
              </p>
              <p>가입일 : {Timechanger(userdata.signupDate)}</p>
              <p>마지막 접속 일시 : {Timechanger(userdata.date)}</p>
            </div>
            <div className='mypage-userAction'>
              <Link className='link' to={'/userpage?act=userInfo'}>
                <button>취소</button>
              </Link>{' '}
              <button data-action='changeinfo' onClick={datasubmitHandler}>
                변경하기
              </button>
            </div>
          </div>
        );
      case 'userPWChange':
        let pwcondition = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;

        return (
          <div>
            <div className='mypage-userpwchange'>
              <div>
                <input type='text' disabled={true} placeholder={userdata.id} />
              </div>
              <div>
                <input type='email' disabled={true} placeholder={userdata.email} />
              </div>
              <div>
                <h4>네이버,카카오,구글을 이용해 가입하신 경우 변경하실수 없습니다</h4>
                <input
                  type='password'
                  name='bfpw'
                  onChange={userPWHandler}
                  onBlur={checkPwHandler}
                  placeholder='현재 비밀번호'
                />
                {checkpw.check ? (
                  <CheckOutlined style={{ padding: '0px 5px', color: 'green' }} />
                ) : (
                  <>
                    <CheckOutlined style={{ padding: '0px 5px', color: 'red' }} />{' '}
                    <p style={{ fontSize: '0.75rem' }}> 비밀번호가 일치하지 않습니다</p>
                  </>
                )}
              </div>{' '}
              <div>
                <input type='password' name='afpw' placeholder='새 비밀번호' onChange={userPWHandler} />
                <span style={{ fontSize: '0.8rem' }}>
                  {pwcondition.test(checkpw.afpw) ? (
                    <CheckOutlined style={{ padding: '0px 5px', color: 'green' }} />
                  ) : (
                    <>
                      {' '}
                      <CheckOutlined style={{ padding: '0px 5px', color: 'red' }} />{' '}
                      <p style={{ fontSize: '0.75rem' }}>
                        {' '}
                        영어,숫자,특수문자를 이용한 8~16자리 비밀번호를 입력하십시오
                      </p>
                    </>
                  )}
                </span>
              </div>{' '}
              <div>
                <input type='password' name='cfpw' onChange={userPWHandler} placeholder='새 비밀번호 확인' />
                <span style={{ fontSize: '0.8rem' }}>
                  {checkpw.afpw === checkpw.cfpw ? (
                    <CheckOutlined style={{ padding: '0px 5px', color: 'green' }} />
                  ) : (
                    <>
                      <CheckOutlined style={{ padding: '0px 5px', color: 'red' }} />{' '}
                      <p style={{ fontSize: '0.75rem' }}> 새 비밀번호가 일치하지 않습니다</p>
                    </>
                  )}
                </span>
              </div>
              <div className='mypage-userAction'>
                <Link className='link' to={'/userpage?act=userInfo'}>
                  <button>취소</button>
                </Link>{' '}
                <button data-action='changepw' onClick={datasubmitHandler}>
                  변경하기
                </button>
              </div>
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
                          <Link className='link' to={`/${post.topcategory}/${post.category}/post/${post.postnum}`}>
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
            <h3 style={{ padding: '0px', margin: '10px 0px' }}>작성댓글 보기</h3>
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
                        <Link
                          className='link'
                          to={`/${cmt.post?.topcategory}/${cmt.post?.category}/post/${cmt.postnum}`}
                        >
                          <Tooltip color='gold' title={cmt.post?.title ?? '삭제된 게시글입니다'}>
                            <span>{cmt.content}</span>
                          </Tooltip>
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
      case 'scrap':
        return (
          <div className='mypage-posts'>
            <h3 style={{ padding: '0px', margin: '10px 0px' }}>스크랩글 보기</h3>
            <div className='mypage-postsInfo'>
              <span>총 스크랩 수: {total} </span>
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
                {scraps

                  .slice(offset < 0 ? 0 : offset, offset + limit)

                  .map((scrap, idx) => {
                    return (
                      <tr key={idx + offset + 1} className='mypage-post-each'>
                        <td>{idx + offset + 1}</td>
                        <td>
                          <Link className='link' to={`/${scrap.topcategory}/${scrap.category}/post/${scrap.postnum}`}>
                            {scrap.title}
                          </Link>
                        </td>
                        <td>{elapsedTime(scrap.date)}</td>
                        <td>
                          {scrap.like.length}/{scrap.hate.length}
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
    <div style={{ width: '95%' }}>
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
            className='modal-button'
            onClick={() => {
              logoutHandler();
            }}
          >
            예
          </button>
          <button className='modal-button' onClick={() => setModal(false)}>
            아니오
          </button>
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
      </header>
      <h3>
        <span>{userId.current ?? ''} 님의 회원정보입니다</span>
        <button
          onClick={() => {
            sendMail(userdata?.email);
          }}
        >
          {' '}
          인증 메일 발송 테스트용
        </button>
        <p> {time}</p>
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
