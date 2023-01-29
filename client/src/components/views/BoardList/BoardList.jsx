import React from 'react';
import './Boardlist.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Pagination, Input } from 'antd';
import { Outlet, Link, useParams, useLocation } from 'react-router-dom';

function BoardList() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cp = searchParams.get('page');
  const searchtarget = searchParams.get('search');
  const { category } = useParams();
  const [lists, setLists] = useState([]);
  const [comments, setComments] = useState([]);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(cp ?? 1);
  const [total, setTotal] = useState(20);
  const [search, setSearch] = useState(searchtarget ?? '');
  const [searchOn, setSearchon] = useState(false);
  const [searchModal, setSearchModal] = useState(true);
  const [announce, setAnnounce] = useState([]);

  const searchHandler = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };
  const searchSubmit = async () => {
    console.log(searchOn);
    setSearchon(!searchOn);
    setSearchModal(false);
  };
  const offset = (page - 1) * limit;
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
        const res = await axios.get(
          `/api/list?page=${page}&category=${
            search ? 'search' : category
          }&limit=${limit}&search=${search}`,
          category
        );
        const res2 = await axios.get('/api/comment');
        const res3 = await axios.get(`/api/announce/${category}`);

        setComments(res2.data.data);
        setLists(res.data.data);
        setTotal(res.data.total);
        setAnnounce(res3.data.data);
      } catch (err) {
        console.log(err);
        alert(err);
      }
    };
    console.log('useeffect render');
    fetchAllLists();
  }, [page, searchOn]);

  return (
    <div className='boardlist'>
      <header className='boardlist-header'>
        <h3>{category}</h3>
        <section className='boardlist-header-section'>
          {' '}
          section list <div> option</div>
        </section>
        <div>
          <Input.Search
            allowClear
            style={{
              width: '120px',
            }}
            maxLength={20}
            size='middle'
            defaultValue=''
            onChange={searchHandler}
            onSearch={searchSubmit}
            value={search}
          />
        </div>
      </header>
      <main className='boardlist-main'>
        {searchModal ? <Outlet></Outlet> : null}

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
                style={{
                  flex: 2,
                  textAlign: 'center',
                  minWidth: '50px',
                  margin: '0',
                  padding: '0',
                }}
              >
                👍/🤢
              </td>
              <td
                className='boardlist-box-head title'
                style={{ flex: 16, textAlign: 'center' }}
              >
                제목
              </td>
              <td
                className='boardlist-box-head writer'
                style={{ flex: 2, minWidth: '70px' }}
              >
                글쓴이
              </td>
              <td
                className='boardlist-box-head date'
                style={{ flex: 2, minWidth: '70px' }}
              >
                날짜
              </td>
            </tr>
          </thead>

          <tbody>
            {announce.map((anc, idx) => {
              return (
                <tr className='important-post' key={idx}>
                  <td className='ip-post-title'>
                    <Link
                      className='link'
                      to={`/list/${category}/post/${anc.postnum}`}
                    >
                      {anc.title}
                    </Link>
                  </td>
                </tr>
              );
            })}

            {lists
              .filter((list) =>
                category === 'all' || category === 'search'
                  ? list
                  : list.category === category
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
                      justifyContent: 'center',
                      flex: 2,
                      minWidth: '45px',
                    }}
                  >
                    {list.like.length}/{list.hate.length}
                  </td>
                  <td
                    style={{
                      flex: 16,
                      width: '100%',
                      maxHeight: '3.5rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <div className='boardlist-table-title'>
                      <Link
                        className='link'
                        to={`/list/${search ? 'search' : category}/post/${
                          list.postnum
                        }?page=${page}&search=${search ?? null}`}
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
                  <td
                    style={{
                      flex: 2,
                      textAlign: 'center',
                      minWidth: '70px',
                    }}
                  >
                    {list.nickname ?? list.id}
                  </td>
                  <td
                    style={{
                      flex: 2,
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      minWidth: '70px',
                    }}
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
          showTotal={(total) => `총 ${total} 게시물`}
          defaultPageSize={limit}
          size={'small'}
          defaultCurrent={1}
          showSizeChanger={false}
          total={total}
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
