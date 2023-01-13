import React from 'react';
import './Boardlist.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Pagination } from 'antd';
import { Outlet, Link, useParams } from 'react-router-dom';

function BoardLists() {
  const { category } = useParams();
  const [lists, setLists] = useState([]);
  const [comments, setComments] = useState([]);
  const [limit, setLimit] = useState(20);
  const [prevpage, setPrevpage] = useState(1);
  const [page, setPage] = useState(prevpage);

  const offset = (page - 1) * limit;
  const startPage = lists.length - offset - limit;

  ////시간 함수 ~~전으로 표현하기
  function elapsedTime(date) {
    const start = new Date(date);
    const end = new Date();

    const diff = (end - start) / 1000;

    const times = [
      { name: '년', milliSeconds: 60 * 60 * 24 * 365 },
      { name: '개월', milliSeconds: 60 * 60 * 24 * 30 },
      { name: '일', milliSeconds: 60 * 60 * 24 },
      { name: '시간', milliSeconds: 60 * 60 },
      { name: '분', milliSeconds: 60 },
    ];

    for (const value of times) {
      const betweenTime = Math.floor(diff / value.milliSeconds);

      if (betweenTime > 0) {
        return `${betweenTime}${value.name} 전`;
      }
    }
    return '방금 전';
  }

  ///outlet 에 값이 있으면 true 가 나오는듯

  /////////////////////////////
  useEffect(() => {
    const fetchAllLists = async () => {
      try {
        const res = await axios.get('/api/list', category);
        const res2 = await axios.get('/api/comment');
        setComments(res2.data.data);
        setLists(res.data.data);
      } catch (err) {
        alert(err);
      }
    };
    console.log('useeffect render');
    fetchAllLists();
  }, []);
  console.log(page, prevpage, 'page');
  return (
    <div className='boardlist'>
      <header className='boardlist-header'>
        <h3>{category}</h3>
        <section className='boardlist-header-section'>
          {' '}
          section list <div> option</div>
        </section>
        <div>search</div>
      </header>
      <main className='boardlist-main'>
        <Outlet></Outlet>

        <table className='boardlist-box'>
          <thead
            style={{
              display: 'flex',
              borderBottom: '1px solid lightgray',
              padding: '5px 0',
              gap: '5px',
            }}
          >
            <tr
              style={{
                display: 'flex',
                width: '100%',
                padding: '5px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
              }}
            >
              <td
                className='boardlist-box-head like'
                style={{ flex: 2, textAlign: 'center' }}
              >
                👍/🤢
              </td>
              <td
                className='boardlist-box-head title'
                style={{ flex: 16, textAlign: 'center' }}
              >
                제목
              </td>
              <td className='boardlist-box-head writer' style={{ flex: 2 }}>
                글쓴이
              </td>
              <td className='boardlist-box-head date' style={{ flex: 2 }}>
                날짜
              </td>
            </tr>
          </thead>
          <tbody>
            {lists
              .slice(startPage < 0 ? 0 : startPage, lists.length - offset)
              .reverse()
              .filter((list) =>
                category === 'all' ? list : list.category === category
              )
              .map((list) => (
                <tr className='boardlist-table' key={list._id}>
                  <td
                    className='likehate'
                    style={{
                      paddingLeft: '0',
                      marginLeft: '0',
                      display: 'flex',
                      gap: '2px',
                      alignContent: 'center',
                      flex: 2,
                    }}
                  >
                    {list.like.length}/{list.hate.length}
                  </td>
                  <td style={{ flex: 16 }}>
                    <div className='boardlist-table-title'>
                      <Link
                        className='link'
                        to={`/list/${category}/post/${list.postnum}`}
                      >
                        {list.title}
                        <span style={{ color: 'burlywood', fontSize: '1rem' }}>
                          {
                            comments.filter(
                              (comment) => comment.postnum === list.postnum
                            ).length
                          }
                        </span>
                      </Link>
                    </div>
                    <div className='boardlist-table-repl'>{list.repl}</div>
                  </td>
                  <td style={{ flex: 2, textAlign: 'center' }}>{list.id}</td>
                  <td
                    style={{ flex: 2, fontSize: '0.8rem', textAlign: 'center' }}
                  >
                    {elapsedTime(list.date)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </main>
      <footer className='boardlist-footer'>
        <Pagination
          showQuickJumper
          showTotal={(total) => `Total ${total} Lists`}
          defaultPageSize={limit}
          size={'small'}
          defaultCurrent={1}
          total={
            lists.filter((list) =>
              category === 'all' ? list : list.category === category
            ).length
          }
          current={page}
          onChange={(page) => {
            setPage(page);
          }}
        />
      </footer>
    </div>
  );
}

export default BoardLists;
