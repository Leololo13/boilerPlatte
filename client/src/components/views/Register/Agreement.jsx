import React from 'react';
import Privacy from '../LandingPage/Privacy';
import Policy from '../LandingPage/Policy';
import { Checkbox, Divider } from 'antd';
import { useState, useEffect } from 'react';

const Agreement = (props) => {
  const [checkedList, setCheckedList] = useState([props.check, props.check]);

  const onChange = (e) => {
    console.log(e.target.name, e.target.name === 'ag1');
    if (e.target.name === 'ag1') {
      setCheckedList((prev) => [e.target.checked, prev[1]]);
    } else {
      setCheckedList((prev) => [prev[0], e.target.checked]);
    }

    // checkedList[0] === true && checkedList[1] === true ? props.setCheck(true) : props.setCheck(false);
    // setCheckedList(list);
    // setIndeterminate(!!list.length && list.length < 2);
    // setCheckAll(list.length === 2);
  };

  useEffect(() => {
    console.log(checkedList);
    if (checkedList[0] && checkedList[1]) {
      props.setCheck(true);
    } else {
      props.setCheck(false);
    }
  }, [checkedList]);

  return (
    <div
      style={{
        width: '100%',
        height: '90%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '0px',
        margin: '0',
      }}
    >
      <div
        style={{
          width: '95%',
          height: '50%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '10px' }}>
          <span style={{ color: 'red' }}>*</span> 개인정보 수집 및 이용에 대한 동의 (필수)
        </div>
        <div
          style={{
            height: '100%',
            overflowY: 'scroll',
            padding: '0px 15px',
            border: '1px solid lightgray',
          }}
          className='policy'
        >
          <Privacy></Privacy>{' '}
        </div>{' '}
        <Checkbox
          name='ag1'
          className='agreement-checkbox-modal'
          checked={checkedList[0]}
          defaultChecked={props.check}
          onChange={onChange}
        >
          위의 내용을 모두 읽었으며
          <span className='agreement-check'>
            {'  '}동의{'  '}
          </span>
          합니다
        </Checkbox>{' '}
      </div>

      <div
        style={{
          width: '95%',
          height: '50%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '10px' }}>
          <span style={{ color: 'red' }}>*</span>이용약관(필수사항)
        </div>
        <div
          style={{
            height: '100%',
            overflowY: 'scroll',
            padding: '0px 15px',
            border: '1px solid lightgray',
          }}
          className='policy'
        >
          <Policy></Policy>
        </div>{' '}
        <Checkbox
          name='ag2'
          className='agreement-checkbox-modal'
          checked={checkedList[1]}
          defaultChecked={props.check}
          onChange={onChange}
        >
          위의 내용을 모두 읽었으며
          <span className='agreement-check'>
            {'  '}동의{'  '}
          </span>
          합니다
        </Checkbox>{' '}
      </div>
    </div>
  );
};

export default Agreement;
