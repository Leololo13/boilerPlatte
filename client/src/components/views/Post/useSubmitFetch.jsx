import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useSubmitFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const formsubmitHandler = async (url, body) => {
    setLoading(true);

    await axios
      .post(url, body)
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        setError(err?.message);
      });
  };

  return { loading, error, formsubmitHandler };
};

export default useSubmitFetch;
