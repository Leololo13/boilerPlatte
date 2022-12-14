import './App.css';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import Register from './components/views/Register/Register';
import BoardList from './components/views/BoardList/BoardList';
import Write from './components/views/Write/Write';
import Modalpopup from './components/views/Modal/Modalpopup';

////////////  A || B는 a가 트루면 a, false면 b
////////////// A && B a가 트루면 b, false면 a
////////////// A ?? B a가 falsy하면 즉null,undeficned.0,등등 이상한것들 이면 b, 있으면 a
function App() {
  const location = useLocation();
  const background = location.state?.background;

  return (
    <div className='App'>
      <main>
        <aside></aside>
        <div>
          <Routes location={background || location}>
            {console.log(location, background)}
            <Route path='/' element={<LandingPage />}>
              <Route path='/list' element={<BoardList />}>
                <Route path='write' element={<Write />} />
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
          {background && (
            <Routes>
              <Route path='/'>
                {' '}
                <Route path='/user' element={<Modalpopup />}>
                  <Route
                    path='register'
                    pathname={location}
                    element={<Register />}
                  />
                  <Route path='login' element={<LoginPage />} />
                </Route>
              </Route>
            </Routes>
          )}
        </div>
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
