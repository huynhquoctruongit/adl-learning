import React from 'react';

const RadioAnswer = ({ answers = [], onChange, value }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 lg:gap-5 gap-3">
      {answers.map((item) => {
        const active = Number(value) === item.id
            ? 'bg-yellow-200 text-[#a16207] border-yellow-500 font-bold'
            : 'border-blue-300 text-blue-500';
        const content = item?.content.replace('<p>', '').replace('</p>', '');
        return (
          <div key={item.id}>
            <input
              type="radio"
              className="hidden"
              id={item.id}
              name="answer"
              value={item.id}
              defaultChecked={Number(value) === item.id}
              onChange={onChange}
            />
            <label
              htmlFor={item.id}
              className={`flex justify-center cursor-pointer border-2  py-3 px-3 rounded-md transition-all ease-in-out duration-300 w-full ${active}`}
            >
              {content}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default RadioAnswer;
