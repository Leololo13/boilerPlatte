import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Mypage.css';
import { Avatar, Pagination } from 'antd';
import Modal from 'react-modal';
import { CheckOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { Tooltip, Progress } from 'antd';
import Usermodal from '../BoardList/Usermodal';

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

  //////////////////////////변수들
  ////사용자///
  const [userdata, setUserdata] = useState({});
  const [fileImg, setFileImg] = useState('');
  const [profileImg, setProfileimg] = useState('');
  const [lvInfo, setLvinfo] = useState([]);
  //사용자 작성글
  const [posts, setPosts] = useState([]);
  ///사용자가 쓴 댓글
  const [comments, setComments] = useState([]);
  ///사용자 스크랩 글
  const [scraps, setScraps] = useState([]);
  //각종 액션들 정보. 비번변경,아이디변경,
  const userId = useRef(null);
  const IDcondition = /^[a-zA-Zㄱ-힣0-9][a-zA-Zㄱ-힣0-9 ]{2,9}$/;
  ///////페이지 모달
  const [modal, setModal] = useState(false);
  ////관리자 전용
  const [troubler, setTroubler] = useState([]);
  const [modalinfo, setModalinfo] = useState({});
  /////유저 모달용 props/////////////////
  const [userModal, setUsermodal] = useState(false);
  const [mPosition, setMposition] = useState([0, 0]);

  //////////////////////////
  ///page
  const [loading, setLoading] = useState(false);
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
  //////////////////////
  function levelSystem(exp) {
    let needExp = 0;
    let lv = 0;
    for (let i = 0; i < 99; i++) {
      needExp += 10 * (2 * i);
      if (needExp >= exp) {
        lv = i;
        exp = exp - needExp + 10 * (2 * i);
        needExp = 10 * (2 * i);
        break;
      }
    }
    return [lv, exp, needExp];
  }

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

  const datasubmitHandler = async (e) => {
    let action = e.target.dataset.action;
    if (action === 'changeinfo') {
      if (IDcondition.test(userdata.nickname)) {
        try {
          if (fileImg) {
            console.log('이미지 변경됨');
            const formData = new FormData();
            formData.append('img', profileImg[0]);
            await axios.post(`/api/user/upload_profile_img?id=${userdata._id}`, formData).then((res) => {
              console.log(res.data);
              if (!res.data.imgChangeSuccess) {
                alert(res.data.message);
              } else {
                // navigate('/userpage?act=userInfo');
                console.log(res.data);
                URL.revokeObjectURL(fileImg);
                setFileImg('');
                setProfileimg('');
              }
            });
          }
          await axios.post(`/api/user/infochange?act=info`, userdata).then((res) => {
            if (res.data.infoChangeSuccess) {
              console.log(res.data);
              alert(res.data.message);
              navigate('/userpage?act=userInfo');
            } else {
              alert(res.data.message);
              console.log(res.data, 'false');
            }
          });
        } catch (error) {
          alert(error);
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
          alert(error);
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
    setLoading(true);
    const fetchTroubler = async () => {
      try {
        const res1 = await axios.get('/api/user/troubler');
        const res = await axios.post('/api/user/mypage');
        const { password, refresh_token, access_token, scrap, posts, comments, ...others } = res.data;
        setUserdata(others);
        userId.current = others?.nickname;
        setTroubler(res1.data.rpl);
        setTotal(res1.data.rpl.length);
        setLoading(false);
        console.log(userdata);
      } catch (error) {
        console.log(error);
        alert(error);
      }
    };
    const fetchUser = async () => {
      try {
        const res = await axios.post('/api/user/mypage');
        const { password, refresh_token, access_token, scrap, posts, comments, ...others } = res.data;
        setUserdata(others);
        userId.current = others?.nickname;
        setLvinfo(levelSystem(others.exp));
        setComments(comments.reverse());
        setScraps(scrap.reverse());
        setPosts(posts.reverse());
        setTotal(act === 'post' ? posts.length : act === 'comment' ? comments.length : scrap.length);
        setLoading(false);
      } catch (error) {
        alert(error);
        console.log(error.message);
      }
    };

    if (act === 'findTroublemaker') {
      console.log('ㅂ재아뱆아ㅐㅂ자앱자앱자앱자애ㅏㅂ재아뱆아ㅐㅈ방');
      fetchTroubler();
    } else {
      fetchUser();
    }
  }, [act]);

  const scrapdelHandler = async (e) => {
    const obid = e.target.dataset.id;
    console.log(obid);
    await axios.get(`/api/post/scrap?obid=${obid}&act=del`).then((res) => {
      if (res.data.scrapDelSuccess) {
        alert(res.data.message);
        navigate('/userpage?act=scrap');
      } else {
        alert('스크랩 삭제 도중 에러가 발생했습니다.');
      }
    });
  };
  const imgChanger = (e) => {
    const file = e.target.files[0];
    setFileImg(URL.createObjectURL(file));
    setProfileimg(e.target.files);
  };
  function switchPage() {
    switch (act) {
      case 'userInfo':
        return (
          <div>
            <div className='mypage-userInfo'>
              <div className='mypage-userinfo-img'>
                <p>
                  <img src={userdata.image} alt='' width={56} height={56} />
                </p>
                <div className='mypage-userinfo-idnickname'>
                  <p>
                    <span style={{ color: 'red' }}>*{'  '}</span>아이디 : {userdata.id}
                  </p>
                  <p>
                    <span style={{ color: 'red' }}>*{'  '}</span>닉네임 : {userdata.nickname}
                  </p>
                </div>
              </div>
              <div>
                {userdata.email ? (
                  <>
                    <span style={{ color: 'red' }}>*{'  '}</span>E-mail : {userdata.email}
                  </>
                ) : (
                  '카카오 연동으로 가입시 이메일이 없습니다'
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  height: '36px',
                  alignItems: 'center',
                  margin: '14px 0px',
                }}
              >
                레벨 :
                <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '10px' }}>
                  <div
                    style={{
                      height: '12px',
                      width: '160px',
                      fontSize: '0.7rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>LV : {lvInfo[0]} </span> <span>{lvInfo[1] + ' point' + ' / ' + lvInfo[2] + ' point'}</span>
                  </div>
                  <div>
                    {' '}
                    <Progress style={{ width: '160px' }} percent={(lvInfo[1] / lvInfo[2]) * 100} size='small' />
                  </div>
                </div>
              </div>
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
              <Link className='link' to={'/userpage?act=out'}>
                <button className='mypage-button'>회원 탈퇴</button>
              </Link>
            </div>
          </div>
        );
      case 'userInfoChange':
        return (
          <div>
            <div className='mypage-userInfo'>
              <p className='mypage-userinfochange-img'>
                {userdata?.image ? (
                  <img src={userdata.image} alt='' width={56} height={56} style={{ borderRadius: '50%' }} />
                ) : (
                  <Avatar
                    style={{
                      color: 'darkgrey',
                      backgroundColor: 'bisque',
                      margin: 0,
                    }}
                    size={56}
                    icon={<UserOutlined />}
                  />
                )}
                {fileImg ? (
                  <span style={{ width: fileImg ? '56px' : '' }}>
                    <img src={fileImg} width={56} height={56} alt='' />
                  </span>
                ) : null}

                <input type='file' name='profile_img' accept='image/*' onChange={imgChanger} />
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                  파일 용량 제한: 200.0KB, 가로 제한 길이: 90px, 세로 제한 길이: 90px{' '}
                </span>
              </p>
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
                {scraps.slice(offset < 0 ? 0 : offset, offset + limit).map((scrap, idx) => {
                  return (
                    <tr key={idx + offset + 1} className='mypage-post-each'>
                      <td>{idx + offset + 1}</td>
                      <td>
                        <Link className='link' to={`/${scrap.topcategory}/${scrap.category}/post/${scrap.postnum}`}>
                          {scrap.title}
                        </Link>
                        <button data-id={scrap._id} onClick={scrapdelHandler}>
                          삭제
                        </button>
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
      case 'out':
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
                {scraps.slice(offset < 0 ? 0 : offset, offset + limit).map((scrap, idx) => {
                  return (
                    <tr key={idx + offset + 1} className='mypage-post-each'>
                      <td>{idx + offset + 1}</td>
                      <td>
                        <Link className='link' to={`/${scrap.topcategory}/${scrap.category}/post/${scrap.postnum}`}>
                          {scrap.title}
                        </Link>
                        <button data-id={scrap._id} onClick={scrapdelHandler}>
                          삭제
                        </button>
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
      case 'findTroublemaker':
        return (
          <div className='mypage-posts'>
            <h3 style={{ padding: '0px', margin: '10px 0px' }}>신고누적 보기</h3>
            <div className='mypage-postsInfo'>
              <span>총 신고된 게시글 수: {total} </span>
              <span>
                Page {page}/{Math.ceil(total / limit)}
              </span>
            </div>
            <table className='mypage-post-table'>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>신고수</th>
                  <th>블럭수</th>
                </tr>
              </thead>
              <tbody>
                {troubler.slice(offset < 0 ? 0 : offset, offset + limit).map((trb, idx) => {
                  return (
                    <tr key={idx + offset + 1} className='mypage-post-each'>
                      <td>{idx + offset + 1}</td>
                      <td>
                        <Link className='link' to={`/${trb.topcategory}/${trb.category}/post/${trb.postnum}`}>
                          {trb.title}
                        </Link>
                      </td>
                      <td>
                        <p
                          className='id'
                          data-id={trb.writer._id}
                          data-nickname={trb.writer.nickname}
                          style={{ cursor: 'pointer', margin: 0 }}
                          onClick={(e) => {
                            console.log(e.target.dataset.id);
                            setModalinfo({ _id: e.target.dataset.id, nickname: e.target.dataset.nickname });
                            setMposition([e.clientX, e.clientY]);
                            setUsermodal(!userModal);
                          }}
                        >
                          {/* <span style={{ width: '25px', height: '15px', backgroundColor: 'white' }}>
                {levelSystem(post.writer?.exp).lv}
              </span> */}

                          {trb.writer.nickname}
                        </p>
                      </td>
                      <td>{trb.report_count}</td>
                      <td>{trb.writer.block}</td>
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
            <Link to={'/'} className='link'>
              <button>메인화면으로 돌아가기</button>
            </Link>

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
  console.log(troubler);
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
      <Usermodal
        target_id={modalinfo._id}
        isAuth={userdata?.role === 0 ? true : false}
        writer={modalinfo.nickname}
        position={mPosition}
        userModal={userModal}
        setUsermodal={setUsermodal}
      />
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
        {userdata?.role === 0 ? (
          <Link to={'/userpage?act=findTroublemaker'} className='link'>
            게시글 관리
          </Link>
        ) : null}
      </header>
      <h3>
        {loading ? (
          <LoadingOutlined style={{ fontSize: '20px', color: 'burlywood' }} />
        ) : (
          <span>{userId.current ?? ''} 님의 회원정보입니다</span>
        )}
      </h3>
      <main className='mypage-main'>
        {loading ? (
          <div
            style={{
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LoadingOutlined style={{ fontSize: '40px', color: 'burlywood' }} />
          </div>
        ) : (
          switchPage()
        )}

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
