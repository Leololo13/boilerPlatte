import React from 'react';
import './Boardlist.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Pagination } from 'antd';
import { Link, Outlet, useOutlet } from 'react-router-dom';

function BoardList() {
  const outlet = useOutlet();
  const [lists, setLists] = useState([]);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;
  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };
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
      <header className='boardlist-header'>
        <h3>Header=big title</h3>
        <section className='boardlist-header-section'>
          {' '}
          section list <div> option</div>
        </section>
        <div>search</div>
      </header>
      <main className='boardlist-main'>
        {outlet ? (
          <Outlet></Outlet>
        ) : (
          <table className='boardlist-box'>
            <thead
              style={{
                display: 'flex',
                borderBottom: '1px solid lightgray',
                padding: '5px 0',
                gap: '5px',
              }}
            >
              <tr>
                <td style={{ flex: 2, textAlign: 'center' }}>👍/🤢</td>
                <td style={{ flex: 16, textAlign: 'center' }}> title</td>
                <td style={{ flex: 2 }}>writer</td>
                <td style={{ flex: 1 }}>date</td>
              </tr>
            </thead>
            <tbody>
              {lists
                .slice(offset, offset + limit)
                .reverse()
                .map((list) => (
                  <tr className='list' key={list._id}>
                    <td
                      className='likehate'
                      style={{
                        display: 'flex',
                        gap: '2px',
                        alignContent: 'center',
                      }}
                    >
                      {list.like}/{list.hate}
                    </td>

                    <td>
                      <Link to={`/list/post/${list._id}`} className='link'>
                        {list.title}
                      </Link>
                    </td>

                    <td>{list.date}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </main>
      <footer className='boardlist-footer'>
        <Pagination
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          defaultCurrent={1}
          total={lists.length >= 10 ? lists.length : 20}
          current={page}
          onChange={(page) => {
            setPage(page);
          }}
        />
      </footer>
    </div>
  );
}

export default BoardList;
