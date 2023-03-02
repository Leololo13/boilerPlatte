import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useFetch = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleGoogle = async (res) => {
    setLoading(true);
    let body = { credential: res.credential };

    await axios
      .post(url, body)
      .then((res) => {
        setLoading(false);
        console.log(res);
        if (res?.data) {
          console.log(res?.data);
          localStorage.setItem('user', JSON.stringify(res?.data.userID));
          navigate('/');
        }
        throw new Error(res?.data.message || res.data);
      })
      .catch((err) => {
        alert(err?.message);
        setError(err?.message);
      });
  };

  return { loading, error, handleGoogle };
};

export default useFetch;
