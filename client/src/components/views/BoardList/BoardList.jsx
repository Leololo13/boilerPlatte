import React from 'react';
import './Boardlist.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Pagination, Input, Select } from 'antd';
import { Outlet, Link, useParams, useLocation } from 'react-router-dom';
import { valTotitle } from './category';
import { EditOutlined, LoadingOutlined } from '@ant-design/icons';
import Usermodal from './Usermodal';

function BoardList() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cp = searchParams.get('page');
  const searchtarget = searchParams.get('search');
  const ssoption = searchParams.get('soption');
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
  const topcategory = location.pathname.split('/')[1];
  const [searchOption, setSearchOption] = useState(ssoption);
  const [loading, setLoading] = useState(false);
  const [userModal, setUsermodal] = useState(false);
  const [mPosition, setMposition] = useState([0, 0]);
  const [writer, setWriter] = useState('');

  const optionHandler = (e) => {
    setSearchOption(e);
  };
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

  const selectOption = [
    { label: '제목', value: 'title' },
    { label: '제목+내용', value: 'title,content' },
    { label: '작성자', value: 'nickname' },
    { label: '댓글', value: 'comment' },
  ];

  function levelSystem(exp) {
    let needExp = 0;
    let lv = 0;
    for (let i = 0; i < 99; i++) {
      needExp += 10 * (2 * i);
      if (needExp >= exp) {
        lv = i;
        exp = exp - needExp + 10 * (2 * i);
        needExp = 10 * (2 * i);
        break;
      }
    }
    return [lv, exp, needExp];
  }

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

  /////
  ///topcategory를 뭘로 나눌것인가? pathname?으로 나눈다음에 axio에서 선별해서 보내면 편할거같기는한데..
  //path로 나누고, query로 보내주자
  ///outlet 에 값이 있으면 true 가 나오는듯
  /////////////////////////////
  useEffect(() => {
    setLoading(true);
    const fetchAllLists = async () => {
      console.log('렌더가 두번되나요?');
      try {
        const res = await axios.get(
          `/api/list?page=${page}&category=${
            search ? 'search' : category
          }&limit=${limit}&search=${search}&topc=${topcategory}&soption=${searchOption ?? 'title'}`
        );
        const res2 = await axios.get('/api/comment');
        const res3 = await axios.get(`/api/announce/${category}`);
        console.log(res.data);
        setComments(res2.data.data);
        setLists(res.data.data);
        setTotal(res.data.total);
        setAnnounce(res3.data.data);
        setLoading(false);
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
      <Usermodal writer={writer} position={mPosition} userModal={userModal} setUsermodal={setUsermodal} />
      <header className='boardlist-header'>
        <div className='boardlist-header-left'>
          <h4>
            {/* {topcategory === 'list'
              ? '힐링시간'
              : topcategory === 'comu'
              ? '커뮤니티'
              : topcategory === 'blind'
              ? '블라인드'
              : ''} */}
            <Link to={`/${topcategory}/all`} className='link'>
              {valTotitle[topcategory]}
            </Link>
          </h4>
          <div className='boardlist-header-section'>
            <Link to={`/${topcategory}/${category}`} className='link'>
              {' '}
              {valTotitle[category] ?? 'ALL'}
            </Link>
          </div>
        </div>
        <div className='boardlist-header-right'>
          {' '}
          <div>
            <Input.Group compact style={{ width: '280px' }}>
              <Select
                options={selectOption.map((o) => ({ label: o.label, value: o.value }))}
                defaultValue={searchOption ?? 'title'}
                onChange={optionHandler}
                style={{ width: '100px' }}
              >
                {/* <Select value='title'>제목</Select>
                <Select value='title,content'>제목+내용</Select>
                <Select value='nickname'>작성자</Select>
                <Select value='comment'>댓글</Select> */}
              </Select>
              <Input.Search
                allowClear
                style={{
                  width: '160px',
                  borderStartEndRadius: '0px',
                }}
                maxLength={20}
                size='middle'
                defaultValue=''
                onChange={searchHandler}
                onSearch={searchSubmit}
                value={search}
              />{' '}
            </Input.Group>
          </div>
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
              <td className='boardlist-box-head title' style={{ flex: 16, textAlign: 'center' }}>
                제목
              </td>
              <td className='boardlist-box-head writer' style={{ flex: 2, minWidth: '70px' }}>
                글쓴이
              </td>
              <td className='boardlist-box-head date' style={{ flex: 2, minWidth: '70px' }}>
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
                      to={`/${topcategory}/${search ? 'search' : category}/post/${anc.postnum}?page=${page}&soption=${
                        searchOption ?? 'title'
                      }&search=${search ?? null}`}
                    >
                      {anc.title}
                    </Link>
                  </td>
                </tr>
              );
            })}
            {loading ? (
              <tr
                style={{
                  height: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <td>
                  <LoadingOutlined style={{ fontSize: '40px', color: 'burlywood' }} />
                </td>
              </tr>
            ) : lists?.length === 0 ? (
              <tr>
                <td>
                  <h4
                    style={{
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    찾으시는 데이터가 없습니다.
                  </h4>
                </td>
              </tr>
            ) : null}

            {lists
              ?.filter((list) => (category === 'all' || category === 'search' ? list : list.category === category))
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
                    <span style={{ color: 'orange' }}>{list.like.length}</span>/{' '}
                    <span style={{ color: 'purple' }}>{list.hate.length}</span>
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
                        to={`/${topcategory}/${search ? 'search' : category}/post/${
                          list.postnum
                        }?page=${page}&soption=${searchOption ?? 'title'}&search=${search ?? null}`}
                      >
                        {list.title}
                        <span style={{ color: 'burlywood', fontSize: '1rem' }}>
                          {comments.filter((comment) => comment.postnum === list.postnum).length}
                        </span>
                      </Link>
                    </div>
                    <div className='boardlist-table-repl'>{list.repl}</div>
                  </td>
                  <td
                    style={{
                      flex: 2,
                      textAlign: 'center',
                      display: 'flex',

                      minWidth: '70px',
                      cursor: 'pointer',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={(e) => {
                      setMposition([e.clientX, e.clientY]);
                      setWriter(list.nickname);
                      setUsermodal(!userModal);
                    }}
                  >
                    <div>
                      <span style={{ width: '15px' }}> {levelSystem(list.exp)[0]}</span>
                      <span>{list.nickname}</span>
                    </div>
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

        {topcategory === 'list' ? (
          ''
        ) : (
          <div className='boardlist-footer-write'>
            <Link className='link' to={`/${topcategory}/${category ?? 'all'}/editor`}>
              <div className='write-icon'>
                <EditOutlined />
                글쓰기
              </div>
            </Link>{' '}
          </div>
        )}
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
