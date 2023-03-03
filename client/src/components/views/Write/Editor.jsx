import axios from 'axios';
import { React, useState, useRef, useMemo, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Writer } from '../../../_actions/user_action';
import './Editor.css';
import { Select, Checkbox, Space } from 'antd';
import { listCategories, comuCategories, blindCategories, valTotitle } from '../BoardList/category';
import { LoadingOutlined } from '@ant-design/icons';

const Video = Quill.import('formats/video');
const Link = Quill.import('formats/link');

let imgurll = '';
function getVideoUrl(url) {
  let match =
    url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) ||
    url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/) ||
    url.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/);
  // console.log(match[2]);
  if (match && match[2].length === 11) {
    imgurll = ` https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`;
    return 'https' + '://www.youtube.com/embed/' + match[2] + '?showinfo=0' + '?autoplay=1';
  }
  if ((match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/))) {
    // eslint-disable-line no-cond-assign
    return (match[1] || 'https') + '://player.vimeo.com/video/' + match[2] + '/' + '?autoplay=1';
  }
  return url;
}

class CoustomVideo extends Video {
  static sanitize(url) {
    const utubeUrl = getVideoUrl(url);
    return Link.sanitize(utubeUrl);
  }

  static create(value) {
    if (!imgurll) {
      imgurll = value;
    }

    const node = super.create(value);
    const utubeUrl = value.includes('youtube');
    const videoUrl = value.includes('video');

    console.log(utubeUrl ? 'iframe' : 'video');
    // this.State({
    //   iFrameHeight: '100px',
    // });

    const video = document.createElement(utubeUrl ? 'iframe' : 'video');
    if (utubeUrl) {
      console.log(utubeUrl);
      video.setAttribute('controls', true);
      video.setAttribute('allowfullscreen', true);
      video.setAttribute('class', 'youtube-video');
      video.setAttribute(
        'allow',
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      );
    } else if (videoUrl) {
      console.log('video');
      video.setAttribute('controls', true);
    } else {
      console.log('gif');
      video.setAttribute('autoplay', true);
      video.setAttribute('playsinline', true);
      video.setAttribute('loop', true);
      video.setAttribute('muted', true);
    }
    video.setAttribute('type', 'video/mp4');
    video.setAttribute('src', this.sanitize(value));

    node.appendChild(video);

    return node;
  }
}
CoustomVideo.blotName = 'video';
CoustomVideo.className = 'ql-video';
CoustomVideo.tagName = 'DIV';

Quill.register('formats/video', CoustomVideo);
const topCategories = [
  {
    value: 'list',
    label: '힐링 시간',
  },
  {
    value: 'comu',
    label: '커뮤니티',
  },
  {
    value: 'blind',
    label: '블라인드',
  },
];
const cateData = {
  list: listCategories.map((c) => {
    return {
      value: c,
      label: valTotitle[c],
    };
  }),
  comu: comuCategories.map((c) => {
    return {
      value: c,
      label: valTotitle[c],
    };
  }),
  blind: blindCategories.map((c) => {
    return {
      value: c,
      label: valTotitle[c],
    };
  }),
};
console.log(cateData);
/////////////////////////////////////////////////////////////////////////////
const Editor = (props) => {
  const { tpcategory } = useParams();
  const { id } = useParams();
  const { category } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editOn = searchParams.get('editOn');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const quillRef = useRef(); //

  const user = useSelector((state) => {
    if (state.rootReducer.user.userData?.isAuth) {
      return state.rootReducer.user.userData;
    }
  });

  const onChangeCheck = (e) => {
    console.log(`checked = ${e.target.checked}`);
    setWrittenData((prev) => ({
      ...prev,
      announce: e.target.checked,
    }));
  };

  const [value, setValue] = useState(''); // 에디터 속 콘텐츠를 저장하는 state

  const [categories, setCategories] = useState(
    cateData[tpcategory] ////이걸로 2번을고른다.즉 대분류에 의한 결과가나와야함
  );
  const [sCate, setScate] = useState(category === 'all' ? cateData[tpcategory][0].label : category); //2번에서고른다
  // useState(cateData[topCategories[0].value][0].value);
  console.log(cateData[tpcategory], cateData[tpcategory][0].label);
  const tophandleChange = (value) => {
    console.log(`selected ${value}`);
    ///선택하면 list,comu,blund 대분류가 들어온다.
    //이걸로 소분류를 선택해준다
    // 소분류

    setCategories(cateData[value]);
    setScate(cateData[value][0].value);

    setWrittenData((prev) => ({
      ...prev,
      topcategory: value,
    }));
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setScate(value);

    setWrittenData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const [writtenData, setWrittenData] = useState({
    title: '',
    content: '',
    writer: user?._id,
    id: user?.id,
    nickname: user?.nickname,
    postnum: 0,
    category: category,
    announce: false,
    image: '',
    topcategory: tpcategory,
  });

  function dataHandler(e) {
    e.preventDefault();
    setWrittenData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function onSubmitHandler(e) {
    e.preventDefault();
    setLoading(true);
    let body = writtenData;
    body.content = value;
    body.category = sCate;
    if (body.image === '' && imgurll) {
      body.image = imgurll;
    }
    if (editOn) {
      axios.post(`/api/post/${id}/edit`, body).then((res) => {
        if (res.data.EditSuccess === true) {
          navigate(`/${writtenData.topcategory}/${writtenData.category}/post/${id}`);
        } else {
          alert(res.data.err);
        }
        console.log(res.data);
      });
    } else {
      dispatch(Writer(body)).then((response) => {
        if (!response.payload) {
          alert('Login이 필요한 기능입니다');
          navigate('/user/login');
        }
        if (response.payload.Writesuccess === true) {
          navigate(`/${writtenData.topcategory}/${writtenData.category}/post/${response.payload.postnum}`);
        } else {
          console.log(response.payload);
          alert(response.payload.err.message);
        }
      });
    }
  }

  const imageHandler = () => {
    //이미지를 누르면 그림이 클릭되도록해서 시작하겠습니다.
    //이미지를 저장할 input = file dom 을 만들어준다
    const input = document.createElement('input');

    ///인풋 속성들 넣기. 타입은 파일이고 승인은 이미지 어쩌고
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*, video/*');
    input.setAttribute('multiple', 'multiple');
    input.click();
    ///input에 변화가생기면? 파일을 넣은다든지
    input.addEventListener('change', async () => {
      console.log('온체인지');
      const file = input.files;
      console.log(file);

      ///뮬터에 맞는 형식으로 만들어주기
      const formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        console.log(i, file[i]);
        formData.append('img', file[i]);
        console.log(formData);
      }

      ///아마도 이 formdata가 뮬터로 가는듯
      try {
        const res = await axios.post('/api/list/write/upload_img', formData);

        console.log('성공시 백엔드가 데이터보내줌', res.data);
        const FILES = res.data.files;
        const IMG_URL = res.data.url;
        setWrittenData((prev) => ({ ...prev, image: IMG_URL[0] }));
        ///퀼의 가지고있는 에디터 가져오기!
        const editor = quillRef.current.getEditor();
        //현재 마우스위치 알려주기. 그래야 여기에 이미지를 넣음
        const range = editor.getSelection();

        for (let i = 0; i < FILES.length; i++) {
          editor.insertEmbed(range, FILES[i].mimetype === 'video/mp4' ? 'video' : 'image', IMG_URL[i]);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ['link', 'image', 'video'],
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        ],
        handlers: {
          // 이미지 처리는 우리가 직접 imageHandler라는 함수로 처리할 것이다.
          image: imageHandler,
        },
      },
    };
  }, []);
  // 위에서 설정한 모듈들 foramts을 설정한다
  const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'image', 'video', 'link'];
  useEffect(() => {
    setLoading(true);
    const FetchEdit = async () => {
      if (editOn) {
        try {
          axios.get(`/api/list/post/${id}`).then((res) => {
            setWrittenData(res.data);
            setValue(res.data.content);
            setLoading(false);
            console.log(res.data);
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        setLoading(false);
      }
    };
    FetchEdit();
  }, []);
  console.log(editOn ? writtenData.category : category === 'all' ? cateData[tpcategory][0].label : category);
  return (
    <div className='editorbox'>
      {loading ? (
        <LoadingOutlined
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '40px',
            color: 'burlywood',
          }}
        />
      ) : (
        <form action='' className='editor-form' onSubmit={onSubmitHandler}>
          {/* <button onClick={onClickcontents}>확인하기기</button> */}
          <div>
            <Select
              defaultValue={editOn ? writtenData.topcategory : tpcategory}
              style={{
                width: 120,
              }}
              onChange={tophandleChange}
              options={topCategories.map((topc) => ({
                label: topc.label,
                value: topc.value,
              }))}
            />
            <Select
              defaultValue={
                editOn ? writtenData.category : category === 'all' ? cateData[tpcategory][0].label : category
              }
              style={{
                width: 120,
              }}
              value={sCate}
              onChange={handleChange}
              options={categories.map((cat) => ({
                label: cat.label,
                value: cat.value,
              }))}
            />
            {user?.isAdmin ? <Checkbox onChange={onChangeCheck}> 공지 사항</Checkbox> : null}
          </div>

          <input type='text' name='title' value={writtenData.title} onChange={dataHandler} placeholder='Title' />
          <ReactQuill
            style={{ width: '100%', height: '480px', paddingBottom: '40px' }}
            ref={quillRef}
            theme='snow'
            placeholder='Content Here'
            value={value}
            onChange={setValue}
            modules={modules}
            formats={formats}
          />
          <footer className='footer-btn-box'>
            <button> {editOn ? '수정하기' : '글쓰기'}</button>
            <span
              onClick={() => {
                navigate(-1);
                console.log('돌아가ㄱ클릭');
              }}
            >
              돌아가기
            </span>
          </footer>
        </form>
      )}
    </div>
  );
};

export default Editor;
