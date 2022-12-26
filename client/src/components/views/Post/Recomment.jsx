import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

function Recomment(props) {
  const onCloseHandler = () => {
    props.setModalVisibleId('');
  };

  console.log(props);

  return (
    <div>
      {props.modalVisibleId === props.id ? (
        <div>
          <form action=''>
            <input type='text' />
          </form>
          <button onClick={onCloseHandler}>닫아버리기</button>
        </div>
      ) : null}
    </div>
  );
}

export default Recomment;
