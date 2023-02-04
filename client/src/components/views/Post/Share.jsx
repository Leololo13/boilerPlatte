import React, { useEffect, useState } from 'react';

// http://localhost:3000/list/humor/post/134

const Share = (props) => {
  const [content, setContent] = useState({
    url: '',
    title: '',
    img: '',
  });
  console.log(props, content);
  useEffect(() => {
    console.log('useEffect');
    setContent(props);
    if (window.Kakao) {
      console.log('kakao share 준비');
      if (!window.Kakao.isInitialized()) {
        console.log('이니셜');
        window.Kakao.init('d7b59d3aab47f55c67190f5f46d5d829');
      }

      window.Kakao.Share.createDefaultButton({
        container: '#kakaotalk-sharing-btn',
        objectType: 'feed',
        content: {
          title: '딸기 치즈 케익',
          description: '#케익 #딸기 #삼평동 #카페 #분위기 #소개팅',
          imageUrl:
            'http://k.kakaocdn.net/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png',
          link: {
            // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
            mobileWebUrl: 'https://developers.kakao.com',
            webUrl: 'https://developers.kakao.com',
          },
        },

        buttons: [
          {
            title: '앱으로 보기',
            link: {
              mobileWebUrl: 'https://developers.kakao.com',
              webUrl: 'https://developers.kakao.com',
            },
          },
        ],
      });
    }
  }, [props]);
  return (
    <>
      <p
        id='kakaotalk-sharing-btn'
        style={{
          cursor: 'pointer',
          margin: '0',
          padding: '0',
          width: '40px',
          height: '40px',
        }}
      >
        <img
          src='https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png'
          alt='카카오톡 공유 보내기 버튼'
          width='100%'
          height='100%'
        />
      </p>
    </>
  );
};

export default Share;
