import './App.css';
import { Routes, Route, Link, useLocation, useMatch } from 'react-router-dom';
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import Register from './components/views/Register/Register';
import BoardList from './components/views/BoardList/BoardList';
import Write from './components/views/Write/Write';
import Modalpopup from './components/views/Modal/Modalpopup';
import Post from './components/views/Post/Post';

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

  return (
    <div className='App'>
      <main>
        <div>
          <Routes location={matchUser ? background : location}>
            <Route path='/' element={<LandingPage />}>
              <Route path='list' element={<BoardList />}>
                <Route path='write' element={<Write />} />
                <Route path='post/:id' element={<Post />} />
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
                <Route path='/user' element={<Modalpopup />}>
                  <Route path='register' element={<Register />} />
                  <Route path='login' element={<LoginPage />} />
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
