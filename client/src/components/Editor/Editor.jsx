import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const Editor = () => {
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const quillRef = useRef();
  const imageHandler = () => {
    console.log('에디터에서 이미지 버튼을 클릭하면 이 핸들러가 시작됩니다!');

    // 1. 이미지를 저장할 input type=file DOM을 만든다.
    const input = document.createElement('input');
    // 속성 써주기
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
    // input이 클릭되면 파일 선택창이 나타난다.

    // input에 변화가 생긴다면 = 이미지를 선택
    input.addEventListener('change', async () => {
      console.log('온체인지');
      const file = input.files[0];
      // multer에 맞는 형식으로 데이터 만들어준다.
      const formData = new FormData();
      formData.append('img', file); // formData는 키-밸류 구조
      // 백엔드 multer라우터에 이미지를 보낸다.
      try {
        const res = await axios.post('/api/list/upload_img', formData);
        console.log('성공 시, 백엔드가 보내주는 데이터', res.data.url);
        const IMG_URL = res.data.url;
        // 이 URL을 img 태그의 src에 넣은 요소를 현재 에디터의 커서에 넣어주면 에디터 내에서 이미지가 나타난다
        // src가 base64가 아닌 짧은 URL이기 때문에 데이터베이스에 에디터의 전체 글 내용을 저장할 수있게된다
        // 이미지는 꼭 로컬 백엔드 uploads 폴더가 아닌 다른 곳에 저장해 URL로 사용하면된다.

        // 이미지 태그를 에디터에 써주기 - 여러 방법이 있다.
        const editor = quillRef.current.getEditor(); // 에디터 객체 가져오기
        // editor.root.innerHTML =
        //   editor.root.innerHTML + `<img src=${IMG_URL} /><br/>`;
        /////위에 에디터객체가져와서 innerhtml 딲히 수정안해줘도될듯
        // 1. 에디터 root의 innerHTML을 수정해주기
        // editor의 root는 에디터 컨텐츠들이 담겨있다. 거기에 img태그를 추가해준다.
        // 이미지를 업로드하면 -> 멀터에서 이미지 경로 URL을 받아와 -> 이미지 요소로 만들어 에디터 안에 넣어준다.
        // editor.root.innerHTML =
        //   editor.root.innerHTML + `<img src=${IMG_URL} /><br/>`; // 현재 있는 내용들 뒤에 써줘야한다.

        // 2. 현재 에디터 커서 위치값을 가져온다
        const range = editor.getSelection();

        // 가져온 위치에 이미지를 삽입한다
        editor.insertEmbed(range.index, 'image', IMG_URL);
      } catch (error) {
        console.log(error);
        console.log('실패했어요ㅠ');
      }
    });
  };
  //use memo안쓰면 꼐속 imghandler 가 포커스됨
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ['image'],
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        ],
        handlers: {
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
  return (
    <div className='text-editor'>
      <form
        action=''
        style={{ backgroundColor: 'red', padding: '0', margin: '0' }}
      >
        <input
          type='text'
          name='title'
          style={{ width: '90%', textAlign: 'center' }}
          placeholder='title'
          onChange={setTitle}
        />
        <ReactQuill
          name=''
          style={{
            height: 'fit-content',
            minHeight: '240px',
          }}
          ref={quillRef}
          theme='snow'
          modules={modules}
          formats={formats}
          value={value}
          onChange={setValue}
          placeholder='write here'
        />
        <button>write</button>
      </form>
    </div>
  );
};
