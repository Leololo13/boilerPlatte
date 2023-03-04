import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Main.css';
import { listCategories, comuCategories, blindCategories, valTotitle } from '../BoardList/category';
import { LoadingOutlined } from '@ant-design/icons';

function Main() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchAllLists = async () => {
      try {
        const res = await axios.get('/api/list');
        console.log(res.data, 'qwopkdqwokdd');
        setLists(res.data.map((dt) => dt));
        setLoading(false);
      } catch (err) {
        alert(err);
      }
    };
    fetchAllLists();
  }, []);

  console.log(lists.map((lst) => lst.map((list) => list.title)));
  return (
    <>
      {loading ? (
        <div
          style={{
            height: '360px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LoadingOutlined style={{ fontSize: '40px', color: 'burlywood' }} />
        </div>
      ) : (
        <div className='mainbox'>
          <div className='mainbox-divider'>
            {listCategories.map((cat, idx) => {
              return (
                <div key={idx} className='mainCategory'>
                  <h3 className='mainCategory-cat'>
                    <Link state={cat} className='link' to={`/list/${cat}`}>
                      {valTotitle[cat]}
                    </Link>
                  </h3>
                  {lists.map((list) =>
                    list.map((lst) => {
                      return lst.category === cat ? (
                        <div key={lst._id} className='mainCategory-post'>
                          <Link to={`/list/${cat}/post/${lst.postnum}`} className='link'>
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
            {comuCategories.map((cat, idx) => {
              return (
                <div key={idx} className='mainCategory'>
                  <h4 className='mainCategory-cat'>
                    <Link state={cat} className='link' to={`/comu/${cat}`}>
                      {valTotitle[cat]}
                    </Link>
                  </h4>
                  {lists.map((list) =>
                    list.map((lst) => {
                      return lst.category === cat ? (
                        <div key={lst._id} className='mainCategory-post'>
                          {' '}
                          <Link to={`/comu/${cat}/post/${lst.postnum}`} className='link'>
                            {lst.title}
                          </Link>
                        </div>
                      ) : null;
                    })
                  )}
                </div>
              );
            })}{' '}
            {blindCategories.map((cat, idx) => {
              return (
                <div key={idx} className='mainCategory'>
                  <h3 className='mainCategory-cat'>
                    <Link state={cat} className='link' to={`/blind/${cat}`}>
                      {valTotitle[cat]}
                    </Link>
                  </h3>
                  {lists.map((list) =>
                    list.map((lst) => {
                      return lst.category === cat ? (
                        <div key={lst._id} className='mainCategory-post'>
                          <Link to={`/blind/${cat}/post/${lst.postnum}`} className='link'>
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
      )}
    </>
  );
}

export default Main;
