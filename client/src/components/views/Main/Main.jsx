import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Main.css';
function Main() {
  const category = ['healing', 'humor', 'info', 'enter'];
  const categorycomu = ['lunch', 'AI', 'comic'];
  const valTotitle = {
    healing: '힐링',
    humor: '유머',
    info: '정보글',
    enter: '연예 및 가십',
    lunch: '점심자랑',
    AI: 'AI그림 게시판',
    comic: '만화추천',
  };

  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchAllLists = async () => {
      try {
        const res = await axios.get('/api/list');
        console.log(res);
        setLists(res.data.map((dt) => dt));
      } catch (err) {
        alert(err);
      }
    };
    fetchAllLists();
  }, []);
  console.log(lists.map((lst) => lst.map((list) => list.title)));
  return (
    <div className='mainbox'>
      <div className='mainbox-divider'>
        {' '}
        {category.map((cat, idx) => {
          return (
            <div key={idx} className='mainCategory'>
              <h3 className='mainCategory-cat'>
                <Link state={cat} className='link' to={`/list/${cat}`}>
                  {valTotitle[cat]}
                </Link>
              </h3>
              {lists.map((list) =>
                list.reverse().map((lst) => {
                  return lst.category === cat ? (
                    <div key={lst._id} className='mainCategory-post'>
                      {' '}
                      <Link
                        to={`/list/${cat}/post/${lst.postnum}`}
                        className='link'
                      >
                        {lst.title}
                      </Link>
                    </div>
                  ) : null;
                })
              )}
            </div>
          );
        })}
      </div>
      <div className='mainbox-divider'>
        {' '}
        {categorycomu.map((cat, idx) => {
          return (
            <div key={idx} className='mainCategory'>
              <h4 className='mainCategory-cat'>
                <Link state={cat} className='link' to={`/comu/${cat}`}>
                  {valTotitle[cat]}
                </Link>
              </h4>
              {lists.map((list) =>
                list.reverse().map((lst) => {
                  return lst.category === cat ? (
                    <div key={lst._id} className='mainCategory-post'>
                      {' '}
                      <Link
                        to={`/comu/${cat}/post/${lst.postnum}`}
                        className='link'
                      >
                        {lst.title}
                      </Link>
                    </div>
                  ) : null;
                })
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Main;
