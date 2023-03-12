import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../_actions/user_action';

export default function Auth(SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userinfo, setUserinfo] = useState({});

    ///option null anybody;
    /// false not logged in no use 로그인한 유저가 못들어가는 페이지! register같은
    /// true for login 로그인 유저만 출입가능

    ////////////  A || B는 a가 트루면 a, false면 b
    ////////////// A && B a가 트루면 b, false면 a
    ////////////// A ?? B a가 falsy하면 즉null,undeficned.0,등등 이상한것들 이면 b, 있으면 a

    useEffect(() => {
      dispatch(auth()).then((response) => {
        //userdata가없다? 로그인안함

        if (!response?.payload) {
          if (option) {
            console.log('로그인안한상태지만, 로그인이 필요한것에 접속할경우');
            navigate('/user/login');
          }
        }
        ///logged In
        else {
          console.log(response.payload.isAdmin, '로그인은 완료했다. 관리자입니까???????????');
          if (adminRoute && !response.payload.isAdmin) {
            console.log('로그인은햇지만 관리자가아니다, 관리자화면은ㄷ안됨');

            navigate('/');
          } else if (response.payload.isAdmin) {
            setUserinfo(response.payload);
            console.log('로그인했고, 관리자다');
          } else {
            setUserinfo(response.payload);
            console.log('로그인한 상태?');
            if (option === false) {
              console.log('optionflase');
              navigate('/');
            }
          }
        }
      });
    }, []);
    console.log('여기서부터 props가 바뀌는듯');
    return <SpecificComponent {...userinfo} />; ////여기에 props에 값을넣어서 보낼수있따..개꿀
  }
  return <AuthenticationCheck />;
}
