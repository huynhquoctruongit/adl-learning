import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
const toHHMMSS = function (time) {
  var sec_num = parseInt(time, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return minutes + ':' + seconds;
};

let timmer = null;
let timeout = null;
const CountDown = ({ time, onTimeout, className, stop }) => {
  const callback = useRef();
  callback.current = onTimeout;
  var timeLocal = localStorage?.getItem('timeout');
  const [count, setCount] = useState(timeLocal ? timeLocal : time);

  useEffect(() => {
    clearInterval(timmer);
    clearTimeout(timeout);
    localStorage.removeItem('timeout');
    setCount(time - 1);
    timmer = setInterval(() => {
      setCount((count) => {
        localStorage.setItem('timeout', count - 1);
        return count - 1;
      });
    }, 1000);
  }, [time]);

  useEffect(() => {
    if (count === 0) {
      clearInterval(timmer);
      clearTimeout(timeout);

      localStorage.removeItem('timeout');
      timeout = setTimeout(() => {
        onTimeout();
      }, 1000);
    }
  }, [count]);

  useEffect(() => {
    return () => {
      localStorage.removeItem('timeout');
      clearInterval(timmer);
      clearTimeout(timeout);
    };
  }, []);

  const stringCount = toHHMMSS(count + 1);
  const duration = time - 1;
  const witdh = ((duration - count) / duration) * 100;

  return (
    <div className={`relative flex justify-center items-center py-[5px] px-[30px] overflow-hidden`}>
      <div
        className="absolute h-full w-full left-0  z-[-1] bg-yellow"
        style={{ transform: `translateX(${witdh}%)`, transition: witdh === 0 ? '' : 'transform 1s linear' }}
      ></div>
      <p className="mr-1"> {time === 10 ? 'Chuyển câu hỏi tiếp theo sau' : 'Thời gian cho câu này còn'} </p>
      <span className={className}>{stringCount}</span>
    </div>
  );
};

export default CountDown;
