import axios from 'axios';
import React, { useState } from 'react';

const useFetch = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleGoogle = async (res) => {
    setLoading(true);
    let body = JSON.stringify({ credential: res.credential });
    await axios
      .post(url, body)
      .then((res) => {
        setLoading(false);
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          console.log(data.user);
        }
      })
      .catch((err) => setError(err?.message));
    console.log(res);
  };
  return { loading, error, handleGoogle };
};

export default useFetch;
