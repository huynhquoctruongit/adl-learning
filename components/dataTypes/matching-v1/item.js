import React from 'react';
import MathJaxBlock from '@/components/common/mathtype/MaxJax';

export function Item({ data, className, ovalClass }) {
  const classCircle = ovalClass ? ovalClass + ' shadow ' : ' shadow-inner bg-smoke ';
  const overlay = ovalClass ? 'bg-[#FFF3F4]' : ' bg-smoke ';
  return (
    <div className={'p-6 w-[50%] border-[1px] flex items-center relative rounded-l-[12px] pr-10 ' + className}>
      <MathJaxBlock content={data?.text} name="hihi" />
      <div
        className={`absolute top-[50%] translate-y-[-50%] translate-x-[calc(20%+1px)] right-0 w-6 h-6  rounded-full  ${classCircle}`}
      ></div>
      <div
        className={`absolute top-[50%] translate-y-[-50%]  translate-x-[calc(100%+1px)] right-0 w-6 h-6  ${overlay}`}
      ></div>
    </div>
  );
}

export const Result = ({ data }) => {
  return (
    <div className="bg-red-400 text-white p-4 rounded-l-2xl shadow-sm flex items-center w-[50%]">
      <MathJaxBlock content={data?.text} />
    </div>
  );
};

export const LatexCom = ({ data, className }) => {
  if (!data) return null;
  const key = data.slice(0, 10);
  return <MathJaxBlock className={'text-black ' + className} key={key} content={data} />;
};
