// import Link from 'next/link';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { ChevronDoubleRightIcon, TerminalIcon, XIcon, CheckIcon } from '@heroicons/react/outline';
import { mapDifficulty } from '@/service/map';
import { useInteraction } from '@/hooks/use-interaction';

const Slide = ({ data, questionid, selectQuestion, isResetData }) => {
  const [isShow, setShow] = useState(false);
  const toggle = () => {
    setShow((isShow) => {
      if (!isShow === true) document.body.style.overflow = 'hidden';
      else document.body.style.overflow = 'auto';
      return !isShow;
    });
  };

  const { interaction, mutate } = useInteraction();
  const objectInteraction = useMemo(() => {
    var objectInteraction = {};
    if (!isResetData) {
      interaction.data.forEach((element) => {
        objectInteraction[element.question_id] = element;
      });
    } else {
      mutate();
      interaction.data.forEach((element) => {
        objectInteraction[element.question_id] = element;
      });
    }

    return objectInteraction;
  }, [interaction.data, isResetData]);

  const getLogInteract = (uuid) => {
    return objectInteraction[uuid];
  };

  const listdata = data || [];
  return (
    <div>
      <div
        className="px-4 shadow-md py-5 bg-white lg:hidden flex items-center justify-between relative z-20 rounded-md"
        onClick={toggle}
      >
        <div className="flex items-center font-bold">Bài luyện tập</div>
        <ChevronDoubleRightIcon
          className={`w-5 h-5 transition-transform duration-200 ease-in-out ${isShow ? 'rotate-90' : ''}`}
        />
      </div>
      <div className="hidden lg:block">
        <Menu
          toggle={toggle}
          data={listdata}
          questionid={questionid}
          getLogInteract={getLogInteract}
          selectQuestion={selectQuestion}
        />
      </div>
    </div>
  );
};

const funcSort = (a, b) => {
  return a.attributes.order - b.attributes.order;
};

const mappColor = {
  Easy: 'bg-emerald-500 text-white',
  Medium: 'bg-green-600 text-white',
  Hard: 'bg-orange-600 text-white',
  VeryHard: 'bg-red-700 text-white'
};

export default React.memo(Slide);

const Menu = ({ data, questionid: active, getLogInteract, selectQuestion }) => {
  return (
    <div className="h-[calc(100vh-104px)] min-w-[14rem] lg:min-w-[20rem] px-4 py-4 w-full absolute lg:relative top-0  bg-white  z-1 overflow-y-scroll">
      {data.sort(funcSort).map((value, index) => {
        const { difficulty, question_uuid } = value.attributes;
        const log = getLogInteract(question_uuid);
        const classname = active == index ? 'custom-button text-white font-[600] opacity-100' : 'font-light';
        return (
          <div key={index} onClick={() => selectQuestion(value, index)}>
            <div
              className={`text-md text-sm transition-all font-[500] rounded-md ease-in-out opacity-70 first:mt-0 w-full px-3 py-1.5 flex items-center cursor-pointer ${classname}`}
            >
              <TerminalIcon className="w-4 h-4 inline mr-3 stroke-2	" />
              <span className="inline-block w-20 ">Câu {index + 1}</span>
              <span className={`font-[600] py-1 px-2 rounded-sm ${active != index ? mappColor[difficulty] : ''} `}>
                {mapDifficulty[difficulty]}
              </span>
              <div className="ml-auto">
                {log &&
                  (log.is_answer_correct ? (
                    <CheckIcon className="w-5 h-5 text-green-500 " />
                  ) : (
                    <XIcon className="w-5 h-5 text-red-500 " />
                  ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
