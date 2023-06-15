import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LeftCom, LatexCom, DotCom, mapColor, mapColorResult } from './item';
import { Toggle } from '@/components/common/toggle';
import { useInteraction } from '@/hooks/use-interaction';
import { findInteract } from '@/service/helper';
import QuesNoti from '@/components/common/ques-noti';
import MathJaxBlock from '@/components/common/mathtype/MaxJax';
import { convertDataToMathchingData, getNextOrderResult, mapData, getNextOrder } from './helper';

// ý tưởng
// lấy bên trái và bên phải,
// sắp xếp bên phải random



function MatchingCom({ statusProps, question, data = [], funcUpdate, setDisable, isReview = true }) {
  if (data?.[0]?.__component !== 'answers-option.matching-line') return null;
  const { interaction } = useInteraction();
  const interact = useMemo(() => findInteract(interaction.data, question.question_uuid), [question.question_uuid]);
  const { resource, count, couple, correct } = useMemo(() => mapData(data), [data]);
  const [answer, setAnswer] = useState(
    (Object.keys(interact?.state || {}).length > 0 ? convertDataToMathchingData(interact?.state, resource) : null) ||
    resource ||
    []
  );

  const [status, setStatus] = useState(interact ? 'answered' : 'pending');
  const [isResult, setResult] = useState(false);
  const getAnswerReview = () => {
    let correctAnwser = JSON.parse(JSON.stringify(answer))
    const answerRight = correctAnwser.map((element) => element?.right);

    correctAnwser = correctAnwser.map(element => ({ ...element, right: { ...element.right, answerIndex: 0 } }))
    correctAnwser.map((element, index) => {
      const indexRight = answerRight.findIndex((e) => e.id === element.left.id);
      if (indexRight === -1) {
        correctAnwser[index].left.answerIndex = 0;
        return;
      }

      if (element.left.text && correctAnwser[indexRight].right.text) {
        if (element.left.answerIndex) correctAnwser[indexRight].right.answerIndex = element.left.answerIndex;
        else {
          const nextIndex = getNextOrderResult(correctAnwser);
          correctAnwser[indexRight].right.answerIndex = nextIndex;
          correctAnwser[index].left.answerIndex = nextIndex;
        }
      }
    });
    return correctAnwser;
  };
  const answerCorrect = useRef(interact ? getAnswerReview() : []);
  const answerIndex = getNextOrder(answer);
  useEffect(() => {
    if (statusProps == 'cancel') {
      setStatus('cancel');
    }
    if (statusProps == 'timeout') {
      setStatus('timeout');
    }
  }, [statusProps]);

  const chooseEvent = (name, index) => {
    return () => {
      if (status === 'answered') return;
      const answerTemp = [...answer];
      if (answerTemp[index][name].answerIndex > 0) {
        answerTemp[index][name].answerIndex = undefined;
      } else {
        if (couple < answerIndex) return;
        let existIndex = answerTemp.findIndex((element) => element[name].answerIndex === answerIndex);
        if (existIndex >= 0) {
          answerTemp[existIndex][name].answerIndex = undefined;
          answerTemp[index][name].answerIndex = answerIndex;
        } else {
          resource[index][name].answerIndex = answerIndex;
        }
      }
      setAnswer(answerTemp);
    };
  };

  const getResult = (data) => {
    const answer = data.filter(element => element)
    const result = {};
    answer.forEach((element) => {
      if (element?.left.answerIndex) {
        if (!result[element.left.answerIndex]) result[element.left.answerIndex] = {};
        result[element.left.answerIndex].left = element.left.id;
      }
      if (element?.right.answerIndex) {
        if (!result[element.right.answerIndex]) result[element.right.answerIndex] = {};
        result[element.right.answerIndex].right = element.right.id;
      }
    });

    Object.keys(result).map((key) => {
      const item = result[key];
      result[key].result = item.left === item.right ? 'correct' : 'fail';
    });
    return result;
  };
  const resultAnswer = getResult(answer);
  const submit = () => {
    setStatus('answered');
    const arrayAnswer = Object.keys(resultAnswer);
    const fail = arrayAnswer.find((key) => {
      const element = resultAnswer[key];
      return element.result === 'fail';
    });
    return [answer, fail ? false : arrayAnswer.length < count ? false : true, correct];
  };
  useEffect(() => {
    setDisable(answerIndex >= count + 1 ? false : true);
  }, [answer]);

  funcUpdate.current = submit;

  const onChange = (value) => {
    answerCorrect.current = getAnswerReview();
    setResult(value);
  };
  const visibleAnswer = isResult ? answerCorrect.current : answer;
  const isStag = process.env.MODE === 'staging' || process.env.MODE === 'development';
  return (
    <div className="bg-smoke min-height-content py-5 md:py-7">
      <div className="flex px-5 md:px-7 flex-wrap items-center justify-between">
        {interact?.is_answer_correct === undefined && (
          <div className="text-caption-1-highlight uppercase text-gray mb-3">HÃY CHỌN CẶP TƯƠNG ỨNG</div>
        )}
        {interact?.is_answer_correct !== undefined && <div className=' mb-3'><QuesNoti status={status} interact={interact} /></div>}
        {status !== 'pending' && isReview && (
          <div className="flex items-center mb-3">
            <Toggle onChange={onChange} /> <span className="ml-3 text-black ">Xem đáp án</span>
          </div>
        )}
      </div>
      <div className="px-5 md:px-7 w-screen md:w-full overflow-x-scroll no-scroll md:overflow-auto">
        <div className='block w-[160vw] md:w-full '>
          {visibleAnswer &&
            visibleAnswer.length > 0 &&
            visibleAnswer.map((element, index) => {
              const borderLeftClass = mapColor[element.left.answerIndex] || 'border-transparent';
              const borderRightClass = mapColor[element.right.answerIndex] || 'border-transparent';
              let stutusLeft = resultAnswer[element.left.answerIndex]?.result || 'default';
              let stutusRight = resultAnswer[element.right.answerIndex]?.result || 'default';
              if (isResult) {
                stutusLeft = element.left.answerIndex ? 'correct' : 'default';
                stutusRight = element.right.answerIndex ? 'correct' : 'default';
              }
              const clxLeft = status == 'pending' ? borderLeftClass : mapColorResult[stutusLeft];
              const clxRight = status == 'pending' ? borderRightClass : mapColorResult[stutusRight];

              return (
                <div className={'flex flex-wrap justify-between mb-[16px]'} key={'right' + (element.left?.id || index)}>
                  <LeftCom onClick={chooseEvent('left', index)} data={element.left} className={clxLeft} isStag={isStag} />
                  {element.right && element.right.text && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, type: 'spring', stiffness: 100 }}
                      onClick={chooseEvent('right', index)}
                      className={
                        'relative p-4 md:p-6 w-[calc(50%-7px)] border-[1px] flex items-center relative rounded-xl bg-white cursor-pointer shadow ' +
                        clxRight
                      }
                    >
                      <div key={'right' + element.right?.id} className={' py-2 w-full flex items-center'}>
                        <DotCom index={element.right.answerIndex} />
                        <div className="block w-full">
                          <MathJaxBlock content={element.right.text} />
                        </div>
                        {isStag && (
                          <div className="absolute top-0 right-0 text-sm rounded-full w-10 h-6 flex items-center justify-center bg-white font-bold opacity-10">
                            {element.right.id}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
      <div className="px-5 md:px-7">
        {status !== 'pending' && isReview && (
          <div className="p-4 bg-green-500text-positive bg-correct rounded-[12px]">
            <b className="text-[#07B04C]">Lời giải</b>
            <p className="text-sm mt-2 text-gray">
              <LatexCom data={question?.detailed_answer} />
            </p>
          </div>
        )}
      </div>


    </div>
  );
}
const Matching = React.memo(MatchingCom);
export default Matching;
