import { BadgeCheckIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';

const Result = ({ count = 5, status = 'pending', onFinish = () => {} }) => {
  const [number, setNumber] = useState(count);
  useEffect(() => {
    if (number > 0)
      setTimeout(() => {
        setNumber((number) => number - 1);
      }, 1000);

    if (number === 0 && status !== 'pending') {
      onFinish();
    }
  }, [number]);
  if (status === 'correct')
    return (
      <div>
        <div className="mt-4 text-right">Chuyển câu hỏi tiếp theo sau {number} giây</div>
        <div className="text-center m-6">
          <div className="flex justify-center">
            <BadgeCheckIcon stroke="green" width={50} height={50} />
          </div>
          <div className="text-green-900">Chính xác</div>
        </div>
      </div>
    );
  else
    return (
      <div>
        <div className="mt-4 text-right">Chuyển câu hỏi tiếp theo sau {number} giây</div>
        <div className="text-center m-6">
          <div className="flex justify-center">
            <BadgeCheckIcon stroke="green" width={50} height={50} />
          </div>
          <div className="text-green-900">Không chính xác</div>
        </div>
      </div>
    );
};

export default Result;
