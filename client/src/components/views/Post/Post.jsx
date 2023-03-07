import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import './Post.css';
import Comment from './Comment';
import Dompurify from 'dompurify';
import Modal from 'react-modal';
import {
  LikeFilled,
  DislikeFilled,
  LinkOutlined,
  EyeOutlined,
  FlagOutlined,
  LoadingOutlined,
  LikeTwoTone,
  DislikeTwoTone,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
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

function Post(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  console.log(props, 'in post props');
  const user = useSelector((state) => {
    return state.rootReducer.user.userData;
  });
  const [userModal, setUsermodal] = useState(false);
  const [mPosition, setMposition] = useState([0, 0]);
  const [writer, setWriter] = useState('');

  const { id, category } = useParams();
  const [post, setPost] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  function shareKakao() {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: post.title,
        imageUrl: post.image,
        link: {
          // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
          mobileWebUrl: `http://localhost:3000${location.pathname}`,
          webUrl: `http://localhost:3000${location.pathname}`,
        },
      },
      buttons: [
        {
          title: '앱으로 보기',
          link: {
            mobileWebUrl: `http://localhost:3000${location.pathname}`,
            webUrl: `http://localhost:3000${location.pathname}`,
          },
        },
      ],
    });
  }
  const scrapHandler = async () => {
    console.log(id, post._id);
    if (!props.isAuth) {
      alert('로그인이 필요한 기능입니다');
    }
    await axios.get(`/api/post/scrap?&obid=${post._id}`).then((res) => {
      if (res.data.scrapSuccess) {
        alert(res.data.message);
      } else {
        alert('스크랩 도중 에러가 발생했습니다.');
      }
    });
  };
  const deleteModalHandler = () => {
    setDeleteModal(true);
  };
  const postDeletehandler = async () => {
    try {
      await axios.post(`/api/post/delete/${id}`).then((res) => {
        console.log(res.data);
        !res.data.DeleteSuccess ? alert(res.data.message) : navigate('/list/all');
      });
    } catch (error) {
      alert(error);
    }
  };
  const likeHandler = async (e) => {
    let modal = e.target.name;

    if (!user) {
      alert('로그인이 필요한 기능입니다');
    } else {
      try {
        await axios
          .post(`/api/post/${modal}/${id}`, {
            user: user,
            like: post.like,
            hate: post.hate,
          })
          .then((res) => {
            navigate(0);
          });
      } catch (error) {
        alert(error);
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

  //////포스트 받아오기
  useEffect(() => {
    setLoading(true);
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/list/post/${id}`);
        setPost(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    if (window.Kakao) {
      console.log('카카카카');
      if (!window.Kakao.isInitialized()) {
        console.log('쉐어준비완료');
        window.Kakao.init('b18ca2d74f4a17d6908f33d9c4958961');
      }
    }

    fetchPost();
  }, []);

  console.log('render', post?.like?.includes(props?._id));
  // iframe.setAttribute('allow', 'loop');
  // console.log(iframe?.style.height);
  // console.log(iframe?.contentWindow.document.body.scrollHeight);

  let content = post?.content;
  let pl = post?.like?.includes(props?._id);
  let dpl = post?.hate?.includes(props?._id);

  return (
    <div className='post'>
      <Usermodal writer={writer} position={mPosition} userModal={userModal} setUsermodal={setUsermodal} />
      <Modal
        isOpen={deleteModal}
        ariaHideApp={false} /// 모달창이 열릴경우 배경컨텐츠를 메인으로 하지않기위해 숨겨줘야한다.
        onRequestClose={() => {
          setDeleteModal(false);
        }}
        style={{
          overlay: overlayStyle,
          content: contentStyle,
        }}
      >
        <p>이 글을 삭제 하시겠습니까?</p>
        <div>
          <button
            className='modal-button'
            onClick={() => {
              postDeletehandler();
              navigate(-2);
            }}
          >
            예
          </button>
          <button className='modal-button' onClick={() => setDeleteModal(false)}>
            아니오
          </button>
        </div>
      </Modal>

      <header className='postHead'>
        <h3 className='post-title'>
          <Link className='link' to={location.pathname + location.search}>
            {post.title}
          </Link>
        </h3>
        <div className='postInfo'>
          <div className='postInfo-info'>
            {' '}
            <p
              className='id'
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                setMposition([e.clientX, e.clientY]);
                setWriter(post.nickname);
                setUsermodal(!userModal);
              }}
            >
              {post.nickname}
            </p>
            <p className='date'>{elapsedTime(post.date)}</p>
            <p className='views'>
              {' '}
              <EyeOutlined />
              {'  '}
              {post.views}
            </p>
          </div>
          <div className='postlink'>
            {' '}
            <div>
              <LinkOutlined />
            </div>
            <a href={location.pathname}>http://localhost:3000{location.pathname}</a>
          </div>
        </div>
      </header>
      <main className='postContent'>
        {loading ? (
          <div
            style={{
              height: '360px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LoadingOutlined style={{ fontSize: '40px', color: 'burlywood' }} />
          </div>
        ) : (
          <>
            {' '}
            {typeof window !== 'undefined' && (
              <div
                className='postContent-main'
                dangerouslySetInnerHTML={{
                  __html: Dompurify.sanitize(content, {
                    ADD_TAGS: ['iframe'],
                    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
                  }),
                }}
              ></div>
            )}
            <footer className='postContent-footer'>
              <button className='like' name='like' onClick={likeHandler}>
                좋아요
                {pl ? (
                  <LikeTwoTone twoToneColor={'orange'} style={{ fontSize: '18px' }} />
                ) : (
                  <LikeFilled style={{ color: 'white', fontSize: '18px' }} />
                )}
                {post.like?.length}
              </button>
              <button className='hate' name='hate' onClick={likeHandler}>
                싫어요
                {dpl ? (
                  <DislikeTwoTone twoToneColor={'darkgray'} style={{ fontSize: '18px' }} />
                ) : (
                  <DislikeFilled style={{ color: 'white', fontSize: '18px' }} />
                )}{' '}
                {post.hate?.length}
              </button>
            </footer>
          </>
        )}
        {/* Dompurify 라이브러리 사용해서 설정해줘야함 */}
      </main>
      <footer className='postFooter'>
        <div className='share-edit'>
          <div className='footer-share'>
            <Tooltip placement='bottom' title={'카카오 공유하기'}>
              <p
                id='kakaotalk-sharing-btn'
                style={{
                  cursor: 'pointer',
                  margin: '0',
                  padding: '0',
                  width: '40px',
                  height: '40px',
                }}
                onClick={shareKakao}
              >
                <img
                  src='https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png'
                  alt='카카오톡 공유 보내기 버튼'
                  width='100%'
                  height='100%'
                />
              </p>
            </Tooltip>
            <Tooltip placement='bottom' title={'스크랩하기'}>
              {' '}
              <FlagOutlined
                onClick={scrapHandler}
                style={{
                  paddingLeft: '5px',
                  fontSize: '30px',
                  cursor: 'pointer',
                }}
              />
            </Tooltip>
          </div>
          {user?._id === post.writer?._id || props.isAdmin ? (
            <div className='footer-editbox'>
              <Link to={`/list/${category}/post/${id}/edit?editOn=true`}>
                <button className='footer-editbox-edit'>수정</button>{' '}
              </Link>
              <button className='footer-editbox-delete' onClick={deleteModalHandler}>
                삭제
              </button>
            </div>
          ) : null}
        </div>
        <Comment p_id={post._id} writer={post.writer?._id} isAuth={props.isAuth} />
      </footer>
    </div>
  );
}

export default Post;
