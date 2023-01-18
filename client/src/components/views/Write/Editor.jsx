import axios from 'axios';
import { React, useState, useRef, useMemo, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Writer } from '../../../_actions/user_action';
import './Editor.css';
import { Select } from 'antd';
import ReactDOM from 'react-dom';

const Video = Quill.import('formats/video');
const Link = Quill.import('formats/link');

function getVideoUrl(url) {
  let match =
    url.match(
      /^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/
    ) ||
    url.match(
      /^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/
    ) ||
    url.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/);
  // console.log(match[2]);
  if (match && match[2].length === 11) {
    return (
      'https' +
      '://www.youtube.com/embed/' +
      match[2] +
      '?showinfo=0' +
      '?autoplay=1'
    );
  }
  if ((match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/))) {
    // eslint-disable-line no-cond-assign
    return (
      (match[1] || 'https') +
      '://player.vimeo.com/video/' +
      match[2] +
      '/' +
      '?autoplay=1'
    );
  }
  return url;
}

class CoustomVideo extends Video {
  static sanitize(url) {
    const utubeUrl = getVideoUrl(url);
    return Link.sanitize(utubeUrl);
  }

  static create(value) {
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

/////////////////////////////////////////////////////////////////////////////
const Editor = (props) => {
  const { id } = useParams();
  const { category } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editOn = searchParams.get('editOn');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => {
    if (state.rootReducer.user.userData?.isAuth) {
      return state.rootReducer.user.userData;
    }
  });
  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setWrittenData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const quillRef = useRef(); //

  const [value, setValue] = useState(''); // 에디터 속 콘텐츠를 저장하는 state
  const [writtenData, setWrittenData] = useState({
    title: '',
    content: '',
    writer: user?._id,
    id: user?.id,
    postnum: 0,
    category: category,
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

    let body = writtenData;
    body.content = value;
    if (editOn) {
      axios.post(`/api/post/${id}/edit`, body).then((res) => {
        console.log(res.data);
      });
    } else {
      dispatch(Writer(body)).then((response) => {
        if (!response.payload) {
          alert('Login이 필요한 기능입니다');
          navigate('/user/login');
        }
        if (response.payload.Writesuccess === true) {
          navigate(
            `/list/${writtenData.category}/post/${response.payload.postnum}`
          );
        } else {
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

    input.click();
    ///input에 변화가생기면? 파일을 넣은다든지
    input.addEventListener('change', async () => {
      console.log('온체인지');
      const file = input.files[0];
      ///뮬터에 맞는 형식으로 만들어주기
      const formData = new FormData();

      formData.append('img', file);
      ///아마도 이 formdata가 뮬터로 가는듯
      try {
        const res = await axios.post('/api/list/write/upload_img', formData);
        console.log('성공시 백엔드가 데이터보내줌', res.data.url);
        const FILE_TYPE = res.data.type;
        const IMG_URL = res.data.url;
        ///퀼의 가지고있는 에디터 가져오기!
        const editor = quillRef.current.getEditor();
        //현재 마우스위치 알려주기. 그래야 여기에 이미지를 넣음
        const range = editor.getSelection();

        editor.insertEmbed(
          range,
          FILE_TYPE === 'video/mp4' ? 'video' : 'image',
          IMG_URL
        );
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
  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'image',
    'video',
    'link',
  ];
  useEffect(() => {
    const FetchEdit = async () => {
      if (editOn) {
        try {
          axios.get(`/api/list/post/${id}`).then((res) => {
            setWrittenData(res.data);
            setValue(res.data.content);
            console.log(res.data);
          });
        } catch (error) {
          console.log(error);
        }
      }
    };
    FetchEdit();
  }, []);
  console.log(writtenData.category);
  return (
    <div className='editorbox'>
      <form action='' className='editor-form' onSubmit={onSubmitHandler}>
        {/* <button onClick={onClickcontents}>확인하기기</button> */}
        <Select
          defaultValue={editOn ? writtenData.category : 'humor'}
          style={{
            width: 120,
          }}
          onChange={handleChange}
          options={[
            {
              value: 'humor',
              label: 'Humor',
            },
            {
              value: 'politic',
              label: 'Politic',
            },
            {
              value: '18+',
              label: '18+',
            },
            {
              value: 'healing',
              label: 'healing',
            },
          ]}
        />
        <input
          type='text'
          name='title'
          value={writtenData.title}
          onChange={dataHandler}
          placeholder='Title'
        />
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
        <footer>
          <button> {editOn ? '수정하기' : '글쓰기'}</button>
        </footer>
      </form>
    </div>
  );
};

export default Editor;
