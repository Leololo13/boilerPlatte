import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Main.css';
function Main() {
  const category = ['humor', 'politic', 'healing'];
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchAllLists = async () => {
      try {
        const res = await axios.get('/api/list');
        setLists(res.data.map((dt) => dt));
      } catch (err) {
        alert(err);
      }
    };
    fetchAllLists();
  }, []);
  console.log(lists.map((lst) => lst.map((list) => list.title)));
  return (
    <>
      {category.map((cat, idx) => {
        return (
          <div key={idx} className='mainCategory'>
            <h3 className='mainCategory-cat'>
              <Link state={cat} className='link' to={`/list/${cat}`}>
                {cat}
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
            {/* {lists
              .filter((lst) => lst.category === cat)
              .reverse()
              .map((list) => {
                return (
                  <div key={list._id} className='mainCategory-post'>
                    <Link
                      to={`/list/${cat}/post/${list.postnum}`}
                      className='link'
                    >
                      {' '}
                      {list.title}
                    </Link>
                  </div>
                );
              })} */}
          </div>
        );
      })}
    </>
  );
}

export default Main;
