import './App.css';
import { Routes, Route, Link, useLocation, useMatch } from 'react-router-dom';
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import Register from './components/views/Register/Register';
import BoardList from './components/views/BoardList/BoardList';
import Write from './components/views/Write/Write';
import Modalpopup from './components/views/Modal/Modalpopup';
import Post from './components/views/Post/Post';
import Logex from './components/views/LoginPage/Logex';
import Auth from './hoc/auth';
import Editor from './components/views/Write/Editor';
import Mypage from './components/views/Mypage/Mypage';

////////////  A || B는 a가 트루면 a, false면 b
////////////// A && B a가 트루면 b, false면 a
////////////// A ?? B a가 falsy하면 즉null,undeficned.0,등등 이상한것들 이면 b, 있으면 a

function App() {
  const location = useLocation();
  let background = location.state?.background;
  if (!background) {
    background = '/';
  }
  const matchUser = useMatch('/user/*');
  ///option null anybody;
  /// false not logged in no use 로그인한 유저가 못들어가는 페이지! register같은
  /// true for login 로그인 유저만 출입가능
  return (
    <div className='App'>
      <main>
        <div>
          <Routes location={matchUser ? background : location}>
            <Route path='/' element={Auth(LandingPage, null)}>
              <Route path='list' element={Auth(BoardList, null)}>
                <Route path='write' element={Auth(Write, true)} />
                <Route path='post/:id' element={Auth(Post, null)} />
                <Route path='editor' element={<Editor />} />
              </Route>
              <Route>
                <Route></Route>
              </Route>
            </Route>

            <Route
              path='*'
              element={
                <div>
                  page not found <br /> 404 Error
                </div>
              }
            />
          </Routes>
          {matchUser && (
            <Routes>
              <Route path='/'>
                {' '}
                <Route path='/user' element={Auth(Modalpopup, null)}>
                  <Route path='register' element={Auth(Register, false)} />
                  <Route path='login' element={Auth(LoginPage, null)} />
                  <Route path='mypage' element={Auth(Mypage, true)} />
                  <Route path='log' element={<Logex />}></Route>
                </Route>
              </Route>
            </Routes>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
