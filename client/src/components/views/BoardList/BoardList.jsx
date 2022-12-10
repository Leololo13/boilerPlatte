import React from 'react';
import './Boardlist.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';

function BoardList() {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchAllLists = async () => {
      try {
        const res = await axios.get('/api/list');
        setLists(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllLists();
  }, []);
  return (
    <div className='boardlist'>
      <header>
        <div>
          {' '}
          <h3>Header=big title</h3>
          <section> section list</section>
          <div> option</div>
          <div>search</div>
        </div>
      </header>
      <main>
        <div className='boardlist-box'>
          {' '}
          {lists.map((list) => (
            <div className='list' key={list._id}>
              <h2>{list.title}</h2>
              <p>{list.content}</p>
              <p>{list.date}</p>
            </div>
          ))}
        </div>
      </main>
      <footer>
        {' '}
        <div className='pagenum'>paaagenum</div>
      </footer>
    </div>
  );
}

export default BoardList;
