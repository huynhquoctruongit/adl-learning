import React, { useEffect, useRef } from 'react';
import ItemGap from './item';
import { useInteraction } from '@/hooks/use-interaction';
import QuesNoti from '@/components/common/ques-noti';
import MathJaxBlock from '@/components/common/mathtype/MaxJax';

const GapFilling = ({ isReview = true, answer_option, question, status, funcUpdate, setDisable, isDisable }) => {
  if (answer_option?.[0]?.__component !== 'answers-option.gap-filling') return null;
  const { findInteraction } = useInteraction();
  const interact = findInteraction(question.question_uuid);
  const { state } = interact || {};
  const gapFilling = useRef({
    store: state?.store || {},
    answers: state?.answers || {},
    func: [],
    count: [],
    result: state?.result || [],
    interact: interact || null,
    forceUpdate: () => { }
  });
  useEffect(() => {
    // show awser
    const isStag = window.location.href.includes('stag') || window.location.href.includes('localhost');
    if (!isStag) return;
    answer_option.map((item) => {
      console.log(item);
      const reuslt = item.list;
      console.log('%cquestion: ' + reuslt.question + '\nvalue : ' + reuslt.values, 'background: red; color: white');
      console.log('                                                                     ');
    });
  }, []);

  const submit = () => {
    const { store, func, answers } = gapFilling.current;
    const result = Object.keys(store).map((key) => {
      const answser = (answers[key] || '').split('||');
      const value = answser.find((item) => item.trim() === store[key].trim());
      const check = value ? true : false;
      func[key](check);
      return { key, result: check };
    });
    func.map((element) => element());
    const check = result.findIndex((element) => element.result === false);
    const group = { result, store, answers };
    return [group, check === -1 ? true : false];
  };

  funcUpdate.current = submit;
  gapFilling.current.forceUpdate = () => {
    const { store, count } = gapFilling.current;
    const answers = Object.keys(store).filter(key => {
      const value = store[key];
      if (value) return true;
    })
    setDisable(answers.length === count.length ? false : true);
  };

  return (
    <>
      <div className="p-5 md:p-8 min-height-content pb-3">
        <div className='mb-3'>
          {interact?.is_answer_correct === undefined && (
            <div className="flex text-caption-1-highlight uppercase text-gray mb-[16px]">HÃY ĐIỀN VÀO CHỖ TRỐNG</div>
          )}
          {interact?.is_answer_correct !== undefined && <QuesNoti status={status} interact={interact} />}
        </div>
        {answer_option.map((data, index) => {
          return (
            <ItemGap
              isReview={isReview}
              isDisable={isDisable}
              gapFilling={gapFilling}
              key={index}
              data={data}
              index={index}
              status={status}
            />
          );
        })}
        <div
          className="p-4 bg-green-500text-positive bg-correct rounded-[12px]"
          style={{ display: status !== 'pending' && isReview ? 'block' : 'none' }}
        >
          <div className="uppercase text-caption-1-highlight">Lời giải</div>
          <div className="text-black text-caption-1 md:ext-sm mt-2">
            <div className='w-full'>
              <MathJaxBlock content={question?.detailed_answer} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default GapFilling;
