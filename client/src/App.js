import './App.css';
import { Routes, Route, Link, useLocation, matchPath } from 'react-router-dom';
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import Register from './components/views/Register/Register';
import BoardList from './components/views/BoardList/BoardList';
import Write from './components/views/Write/Write';
import Modalpopup from './components/views/Modal/Modalpopup';
import { Editor } from './components/Editor/Editor';
import PostContent from './components/views/PostContent/PostContent';

function App() {
  const location = useLocation();
  const isUserpath = matchPath('/user/*', location.pathname);
  const background = location.state?.background;

  //// ?. optional chaning
  ////////////  A || B는 a가 트루면 a, false면 b
  ////////////// A && B a가 트루면 b, false면 a
  ////////////// A ?? B a가 falsy하면 즉null,undeficned.0
  return (
    <div className='App'>
      <main>
        <div>
          {' '}
          <Routes location={!isUserpath ? location : background}>
            <Route path='/' element={<LandingPage />}>
              <Route path='list' element={<BoardList />}>
                <Route path='write' element={<Write />} />
                <Route path='editor' element={<Editor />} />
                <Route path='post/:id' element={<PostContent />} />
              </Route>

              <Route
                path='*'
                element={
                  <div>
                    page not found <br /> 404 Error
                  </div>
                }
              />
            </Route>
          </Routes>
          {isUserpath && (
            <Routes>
              {' '}
              <Route path='/user' element={<Modalpopup />}>
                <Route path='/user/register' element={<Register />} />
                <Route path='/user/login' element={<LoginPage />} />{' '}
              </Route>
            </Routes>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
