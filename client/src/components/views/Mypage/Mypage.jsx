import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Mypage() {
  const [userdata, setUserdata] = useState({});
  const [modalopen, setModalopen] = useState(false);
  const modalHandler = () => {
    setModalopen(!modalopen);
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/user/mypage');
        const { password, refresh_token, access_token, role, ...others } =
          res.data;

        setUserdata(others);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);
  return (
    <div>
      <h3>{userdata.id}님의 페이지입니다</h3>

      <p>
        <button onClick={modalHandler}>{userdata.id}님의 Info 확인하기</button>
      </p>
      {modalopen ? <div>{userdata.id}</div> : null}
    </div>
  );
}

export default Mypage;
