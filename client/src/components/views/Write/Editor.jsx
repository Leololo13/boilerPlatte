import { React, useState, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Editor = () => {
  const quillRef = useRef(); //
  const [value, setValue] = useState(''); // 에디터 속 콘텐츠를 저장하는 state
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ['image'],
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        ],
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
    <>
      <ReactQuill
        ref={quillRef}
        theme='snow'
        placeholder='플레이스 홀더'
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
      />
    </>
  );
};

export default Editor;
