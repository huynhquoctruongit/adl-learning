import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '@/api/base/axios-cms';
import Matching from '../components/dataTypes/matching';

export default function Home() {
  const [data, setData] = useState();
  const refFunc = useRef();
  useEffect(() => {
    axiosClient.get('/questions/?populate=answer_option.list&filters[question_uuid]=test-matching').then((data) => {
      const answers = data.data[0]?.attributes?.answer_option;
      setData(answers);
    });
  }, []);
  const updateFunc = (func) => {
    refFunc.current = func;
  };
  if (!data) return null;
  return (
    <div className="h-[80vh] bg-slate-50 p-10 ">
      <div className="max-w-[1000px]">
        <Matching data={data} updateFunc={updateFunc} />
        <button
          className="p-4 rounded"
          onClick={() => {
            refFunc.current();
          }}
        >
          Bấm kiểm tra
        </button>
      </div>
    </div>
  );
}

Home.permission = 'public';
