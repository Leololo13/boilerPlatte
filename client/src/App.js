import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/register' element={<RegisterPage />}></Route>
        <Route path='/' element={<LandingPage />}></Route>
        <Route path='/login' element={<LoginPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
