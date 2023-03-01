import React from 'react';
import { useState, useRef, useEffect } from 'react';

const Authtimer = (props) => {
  console.log(props);
  const [time, setTime] = useState(props.sec);
  const [timeron, setTimeron] = useState(props.timeon);
  const count = useRef(time);
  const interval = useRef(null);
  useEffect(() => {
    console.log('된긴함?');

    console.log('들어옴');
    interval.current = setInterval(() => {
      count.current -= 1;
      setTime(count.current);
    }, 1000);
  }, []);

  useEffect(() => {
    if (count.current <= 0) {
      clearInterval(interval.current);
    }
  }, [time]);

  return <>{time}</>;
};

export default Authtimer;
