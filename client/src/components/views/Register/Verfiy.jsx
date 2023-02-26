import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Verfiy = (props) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const vemail = searchParams.get('vemail');
  const validkey = searchParams.get('validkey');
  const validtimes = searchParams.get('validtimes');
  const [loading, setLoading] = useState(false);
  const [verify, setVerify] = useState(undefined);

  useEffect(() => {
    setLoading(true);
    const verifyID = async () => {
      try {
        await axios
          .get(`/api/user/sendVmail/?condition=verify?vemail=${vemail}&validkey=${validkey}&validtimes=${validtimes}`)
          .then((res) => {
            if (res.data.verify) {
              setVerify(true);
            }
            setLoading(false);
            console.log(res.data);
          });
      } catch (error) {
        console.log(error.message);
      }
    };
  });

  return (
    <div>
      {/* 로딩끝+인증완료 = 인증끝, 로딩중+인증은모름=>인증기다림, 로딩끝+인증x=인증실패 */}
      {!loading && verify
        ? '인증완료되었습니다'
        : loading && verify === undefined
        ? '인증을 기다리고 있습니다'
        : '인증 실패'}
    </div>
  );
};

export default Verfiy;
