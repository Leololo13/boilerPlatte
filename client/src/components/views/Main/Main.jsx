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
        setLists(res.data.data);
      } catch (err) {
        alert(err);
      }
    };
    fetchAllLists();
  }, []);
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

            {lists
              .filter((lst) => lst.category === cat)
              .slice(-15)
              .reverse()
              .map((list) => {
                return (
                  <div key={list._id} className='mainCategory-post'>
                    <Link to={`/list/post/${list.postnum}`} className='link'>
                      {' '}
                      {list.title}
                    </Link>
                  </div>
                );
              })}
          </div>
        );
      })}
    </>
  );
}

export default Main;
