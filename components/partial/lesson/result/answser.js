import { BadgeCheckIcon, ClockIcon, XCircleIcon } from '@heroicons/react/outline';
import React, { useEffect, useState, useRef } from 'react';

const Result = ({ isShowTime, count = 5, status, onFinish = () => {} }) => {
  const [number, setNumber] = useState(0);
  let refTime = null;
  useEffect(() => {
    if (number > 0)
      refTime = setTimeout(() => {
        setNumber((number) => number - 1);
      }, 1000);
    if (number === 0 && status !== 'pending') {
      setTimeout(() => {
        onFinish();
      }, 1300);
    } else {
      if (status === 'review') {
        clearInterval(refTime);
      }
    }
  }, [number]);
  useEffect(() => {
    if (status !== 'pending') {
      setNumber(count);
    } else {
      clearInterval(refTime);
    }
  }, [status]);
  useEffect(() => {
    if (isShowTime) {
      clearInterval(refTime);
    }
  }, [isShowTime]);
  const witdh = ((5 - parseInt(number)) / 5) * 100;
  if (status !== 'pending' && status !== 'review')
    return (
      <div className="flex justify-center items-center py-[5px] px-[30px]">
        <div
          className="absolute h-full w-full left-0  z-[-1] bg-yellow"
          style={{ transform: `translateX(${witdh}%)`, transition: 'transform 1.3s ease' }}
        ></div>
        <p>
          Chuyển câu hỏi tiếp theo sau <span className="font-semibold text-blue-500">{number}</span> giây
        </p>
      </div>
    );
  else {
    return null;
  }
};

export default Result;
