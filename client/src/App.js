import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import Register from './components/views/Register/Register';
import BoardList from './components/views/BoardList/BoardList';
import Write from './components/views/Write/Write';

function App() {
  return (
    <div className='App'>
      <main>
        <aside></aside>
        <div>
          {' '}
          <Routes>
            <Route path='/' element={<LandingPage />}>
              <Route path='/user'>
                <Route path='/user/register' element={<Register />} />
                <Route path='/user/login' element={<LoginPage />} />
              </Route>
              <Route path='/list' element={<BoardList />} />
              <Route path='/list/write' element={<Write />} />
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
        </div>
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
