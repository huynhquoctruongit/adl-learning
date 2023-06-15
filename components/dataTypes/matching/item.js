import React from 'react';
import MathJaxBlock from '@/components/common/mathtype/MaxJax';
import { AnimatePresence, motion } from 'framer-motion';
import { variantsScale } from '@/service/config';

const mapIconByIndex = {
  1: '/images/icon/Indicator-0.svg',
  2: '/images/icon/Indicator-1.svg',
  3: '/images/icon/Indicator-2.svg',
  4: '/images/icon/Indicator-3.svg',
  5: '/images/icon/Indicator-4.svg',
  6: '/images/icon/Indicator-6.svg'
};

export const mapColor = {
  1: 'border-yellow ',
  2: 'border-pink ',
  3: 'border-highlight-blue ',
  4: 'border-highlight-green ',
  5: 'border-highlight-purple ',
  6: 'border-gray '
};
export const mapColorResult = {
  correct: 'border-positive bg-positive-light ',
  fail: 'border-negative bg-negative-light',
  default: 'border-transparent'
};

export const DotCom = ({ index }) => {
  return (
    <div className="mr-4 md:mr-6">
      <div className="flex w-8 h-8 rounded-full bg-purple-light">
        {
          index > 0 && <motion.img
            variants={variantsScale}
            initial="hidden"
            animate={index ? "visible" : 'exit'}
            transition={{ duration: 0.25, type: 'spring', stiffness: 300 }}
            src={mapIconByIndex[index]}
            alt=""
            className="w-full h-full object-cover"
          ></motion.img>}

      </div>
    </div>
  );
};

export function LeftCom({ data, className, isStag, ...rest }) {
  if (!data?.text) return <div></div>;
  const border = mapColor[data.answerIndex] || 'border-transparent';
  return (
    <div
      {...rest}
      className={
        'relative p-4 md:p-6 w-[calc(50%-7px)] cursor-pointer shadow border-[1px]  flex items-center relative rounded-xl bg-white shadow ' +
        className
      }
    >
      <DotCom index={data.answerIndex} />
      <MathJaxBlock content={data?.text} />
      {isStag && (
        <div className="absolute top-0 right-0 text-sm rounded-full w-10 h-6 flex items-center justify-center bg-white font-bold opacity-10">
          {data.id}
        </div>
      )}
    </div>
  );
}

export const Result = ({ data }) => {
  return (
    <div className="bg-red-400 text-white p-4 rounded-l-2xl shadow-sm flex items-center w-[calc(50%-7px)]">
      <MathJaxBlock content={data?.text} />
    </div>
  );
};

export const LatexCom = ({ data, className }) => {
  if (!data) return null;
  const key = data.slice(0, 10);
  return <MathJaxBlock className={'text-black ' + className} key={key} content={data} />;
};
