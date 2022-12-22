import axios from 'axios';
import { React, useState, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Writer } from '../../../_actions/user_action';

const Editor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    return state.rootReducer.user.userData;
  });
  const quillRef = useRef(); //

  const [value, setValue] = useState(''); // 에디터 속 콘텐츠를 저장하는 state
  const [writtenData, setWrittenData] = useState({
    title: '',
    content: '',
    writer: user._id,
    id: user.id,
    postnum: 0,
    like: 0,
    hate: 0,
  });
  function dataHandler(e) {
    e.preventDefault();
    setWrittenData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function onSubmitHandler(e) {
    e.preventDefault();

    let body = writtenData;
    body.content = value;
    console.log(body);
    dispatch(Writer(body)).then((response) => {
      console.log(response);
      if (!response.payload) {
        alert('Login이 필요한 기능입니다');
        navigate('/user/login');
      }
      if (response.payload.Writesuccess === true) {
        navigate('/list');
      } else {
        alert(response.payload.err.message);
      }
    });
  }
  const imageHandler = () => {
    //이미지를 누르면 그림이 클릭되도록해서 시작하겠습니다.
    //이미지를 저장할 input = file dom 을 만들어준다
    const input = document.createElement('input');

    ///인풋 속성들 넣기. 타입은 파일이고 승인은 이미지 어쩌고
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
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
        const IMG_URL = res.data.url;
        ///퀼의 가지고있는 에디터 가져오기!
        const editor = quillRef.current.getEditor();
        //현재 마우스위치 알려주기. 그래야 여기에 이미지를 넣음
        const range = editor.getSelection();
        editor.insertEmbed(range, 'image', IMG_URL);
      } catch (error) {
        console.log(error);
      }
    });
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ['image'],
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
  ];
  const onClickcontents = () => {
    const editor = quillRef.current.getEditor();
    console.log('내부내용', quillRef.current.getEditorContents());
  };
  return (
    <div className='editorbox'>
      <form action='' className='editor-form' onSubmit={onSubmitHandler}>
        <button onClick={onClickcontents}>확인하기기</button>
        <label htmlFor=''>제목</label>
        <input
          type='text'
          name='title'
          placeholder='title'
          onChange={dataHandler}
        />
        <ReactQuill
          style={{ width: '100%', height: '480px', paddingBottom: '40px' }}
          ref={quillRef}
          theme='snow'
          placeholder='Write Here'
          value={value}
          onChange={setValue}
          modules={modules}
          formats={formats}
        />
        <footer>
          hello
          <button> 제출해버리기</button>
        </footer>
      </form>
    </div>
  );
};

export default Editor;
