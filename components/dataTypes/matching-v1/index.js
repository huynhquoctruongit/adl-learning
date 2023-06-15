import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Item, LatexCom } from './item';
import { Toggle } from '@/components/common/toggle';
import { useInteraction } from '@/hooks/use-interaction';
import { findInteract } from '@/service/helper';
import QuesNoti from '@/components/common/ques-noti';
import MathJaxBlock from '@/components/common/mathtype/MaxJax';
import { useRouter } from 'next/router';

const parseStatus = (status, element) => {
  const isCorrected = element?.left?.id === element?.right?.id || !element?.correct;
  const active = element.right;
  if (status === 'choosing' && !active) return 'choosing';
  if (status === 'choosing' && active) return 'active';
  if (status === 'cancel') return 'cancel';
  if (status === 'timeout') return 'timeout';
  if (isCorrected && (status !== 'cancel' || status !== 'timeout')) return 'corrected';
  if (!isCorrected && (status !== 'cancel' || status !== 'timeout')) return 'failed';
};

const classItem = {
  choosing: 'border-dashed bg-transparent border-silver ',
  active: 'bg-purple-light border-purple shadow',
  cancel: 'bg-[#FFF3F4] border-[#F45255] shadow',
  timeout: 'bg-[#FFF3F4] border-[#F45255] shadow',
  failed: 'bg-[#FFF3F4] border-[#F45255] shadow',
  corrected: 'bg-[#EDF9EF] border-[#07B04C] shadow'
};

const classLeftSide = {
  choosing: 'shadow bg-white border-transparent',
  active: 'shadow bg-purple-light border-purple border-r-[0px] border-[1px]',
  cancel: 'shadow bg-[#FFF3F4] border-[#F45255] border-r-[0px] border-[1px]',
  timeout: 'shadow bg-[#FFF3F4] border-[#F45255] border-r-[0px] border-[1px]',
  failed: 'shadow bg-[#FFF3F4] border-[#F45255] border-r-[0px] border-[1px]',
  corrected: 'shadow bg-[#EDF9EF] border-r-[0px] border-[1px] border-[#07B04C] '
};

const boxtemp = {
  choosing: 'bg-white',
  active: 'bg-[#ECECFE]',
  cancel: 'bg-[#FFF3F4]',
  timeout: 'bg-[#FFF3F4]',
  failed: 'bg-[#FFF3F4]',
  corrected: 'bg-[#EDF9EF]'
};

const circleDefault = {
  failed: 'bg-[#FFF3F4] border-[1px] border-[#F45255]',
  cancel: 'bg-[#FFF3F4] border-[1px] border-[#F45255]'
};

const mapData = (answers) => {
  const result = [];
  const drag = [];
  answers.map((element, index) => {
    const item = element.list;
    if (item.question)
      result.push({
        left: { text: item.question, id: item.id },
        correct: { text: item.answer, id: item.id, order: index },
        right: null
      });
    if (item.answer) drag.push({ text: item.answer, id: item.id, order: index });
  });
  return { result, drag: drag.sort(() => Math.random() - 0.5) };
};

function MatchingCom({ statusProps, question, data = [], funcUpdate, setDisable, isReview = true }) {
  if (data?.[0]?.__component !== 'answers-option.matching-line') return null;
  const router = useRouter();
  const { interaction } = useInteraction();
  const interact = findInteract(interaction.data, question.question_uuid);
  const { result, drag } = useMemo(() => mapData(data), [data]);
  const [answer, setAnswer] = useState(
    (Object.keys(interact?.state || {}).length > 0 ? interact?.state : null) || result || []
  );

  const [draf, setDraf] = useState(interact ? [] : drag);
  const [temp, setTemp] = useState();
  const [status, setStatus] = useState(interact ? 'answered' : 'choosing');
  const [isResult, setResult] = useState(false);
  useEffect(() => {
    if (statusProps && statusProps == 'cancel') {
      setStatus('cancel');
    }
    if (statusProps && statusProps == 'timeout') {
      setStatus('timeout');
    }
  }, [statusProps]);

  const rollBack = (element, index) => {
    if (status === 'answered') return;
    const temps = [...draf];
    temps.push(element.right);
    setDraf(temps);
    const temp_answer = [...answer];
    temp_answer[index].right = null;
    setAnswer(temp_answer);
  };
  const autoFill = (active) => {
    if (status === 'answered') return;
    const fillAnswer = (answer || []).filter((element) => element.right);
    if (fillAnswer.length === answer.length) return;
    const temp_answer = [...answer];
    const temp_draft = [...draf];
    for (let index = 0; index < temp_answer.length; index++) {
      const element = temp_answer[index];
      if (!element.right) {
        temp_answer[index].right = temp_draft[active];
        break;
      }
    }
    temp_draft.splice(active, 1);
    setDraf(temp_draft);
    setAnswer(temp_answer);
  };

  const updateAnswer = (index, payload) => {
    if (status === 'answered') return;
    if (index === payload.index && payload.overwrite) return;

    const temp_answer = [...answer];
    const temp_draft = [...draf];

    if (!payload.overwrite) {
      if (temp_answer[index].right) {
        temp_draft.push(temp_answer[index].right);
      }
      temp_draft.splice(payload.index, 1);
    } else {
      temp_answer[payload.index].right = temp_answer[index].right;
    }

    temp_answer[index].right = payload.value;
    setDraf(temp_draft);
    setAnswer(temp_answer);
  };
  const submit = () => {
    setStatus('answered');
    const fail = answer.find((element) => element.left.text && element.left?.id !== element.right?.id);
    return [answer, fail ? false : true];
  };
  useEffect(() => {
    const fail = answer.find((element) => {
      return !element.right?.id;
    });
    setDisable(fail ? true : false);
  }, [answer]);

  useEffect(() => {
    const isStag = window.location.href.includes('stag') || window.location.href.includes('localhost');
    if (!isStag) return;
    const logs = data.map((item) => {
      const reuslt = item.list;
      console.log(
        '%cquestion: ' + reuslt.question + '\nanswer : ' + reuslt.answer,
        'background: #07B04C; color: white'
      );
      console.log('                                                                     ');
    });
    console.log(logs);
  }, []);

  funcUpdate.current = submit;
  const onChange = (value) => {
    setResult(value);
  };

  return (
    <div className="p-7 bg-smoke min-height-content">
      <div className="flex mb-3">
        {interact?.is_answer_correct === undefined && (
          <div className="text-caption-1-highlight uppercase text-gray mb-[16px]">HÃY KÉO THẢ ĐÁP ÁN TƯƠNG ỨNG</div>
        )}
        {interact?.is_answer_correct !== undefined && <QuesNoti status={status} interact={interact} />}
        {status !== 'choosing' && isReview && (
          <div className="ml-auto flex items-center">
            <Toggle onChange={onChange} /> <span className="ml-3 text-black">Xem đáp án</span>
          </div>
        )}
      </div>

      {answer &&
        answer.length > 0 &&
        answer.map((element, index) => {
          const statusItem = isResult ? 'corrected' : parseStatus(status, element);
          var dataRight = isResult || status === 'cancel' || status === 'timeout' ? element.correct : element.right;
          return (
            <div className="flex mb-[16px] flex-wrap" key={'right' + element.left?.id}>
              <Item data={element.left} className={classLeftSide[statusItem]} ovalClass={circleDefault[statusItem]} />
              <motion.div
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={'flex border-[1px] items-center h-auto rounded-r-2xl w-[50%] ' + classItem[statusItem]}
                onDrop={(ev) => {
                  ev.preventDefault();
                  updateAnswer(index, temp);
                }}
                onDragOver={(ev) => {
                  ev.preventDefault();
                }}
              >
                {dataRight && (
                  <motion.div
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    key={'right' + dataRight?.id}
                    draggable={status !== 'answered' ? true : false}
                    onDragStart={function (ev) {
                      ev.dataTransfer.effectAllowed = 'copy';
                      setTemp({ value: dataRight, index, overwrite: true });
                    }}
                    className={'px-10 py-2 w-full relative'}
                    onClick={() => {
                      if (isResult || status !== 'choosing') return;
                      rollBack(element, index);
                    }}
                  >
                    <div
                      className={
                        'absolute top-[50%] translate-y-[-50%] translate-x-[-80%] left-0 w-6 h-6 rounded-full border-[1px] ' +
                        classItem[statusItem]
                      }
                    ></div>
                    <div
                      className={'absolute top-[50%] translate-y-[-50%] left-0 w-6 h-10 ' + boxtemp[statusItem]}
                    ></div>
                    <div className="block cursor-pointer w-full">
                      <MathJaxBlock content={dataRight.text} />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          );
        })}
      {draf.map((element, index) => {
        return (
          <motion.div
            className="inline-block mr-2 mb-2 mt-[16px]"
            key={element?.id}
            draggable={status !== 'answered' && isResult === false ? true : false}
            onDragStart={(ev) => {
              setTemp({ value: element, index });
            }}
            onClick={() => {
              if (status !== 'cancel' || status !== 'timeout') {
                autoFill(index);
              }
            }}
          >
            <div className="w-fit p-6 cursor-move shadow bg-white hover:bg-blue-300 duration-300 transition-colors inline-block rounded-xl shadow-xs">
              <LatexCom data={element?.text} />
            </div>
          </motion.div>
        );
      })}
      {status !== 'pending' && status !== 'choosing' && isReview && (
        <div className="p-4 bg-green-500text-positive bg-correct rounded-[12px]">
          <b className="text-[#07B04C]">Lời giải</b>
          <p className="text-sm mt-2 text-gray">
            <LatexCom data={question?.detailed_answer} />
          </p>
        </div>
      )}
    </div>
  );
}
const Matching = React.memo(MatchingCom);
export default Matching;
