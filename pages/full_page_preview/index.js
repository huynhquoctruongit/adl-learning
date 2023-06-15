import GapFilling from '@/components/dataTypes/gap-filling';
import Matching from '@/components/dataTypes/matching';
import MultileChoice from '@/components/dataTypes/multiple-choice';
import Table from '@/components/dataTypes/table';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LatexCom } from '@/components/dataTypes/matching/item';
import { checkArrays } from '@/service/helper';
import axios from 'axios';

const Practice = () => {
  const funcSubmit = useRef();
  const router = useRouter();
  const [isCancel, setCancel] = useState(false);
  const [data, setData] = useState();
  const [isShowSuggestions, setShowSuggestions] = useState(false);
  const id = router.query?.id?.[0];
  const [status, setStatus] = useState('cancel');
  const [isDisable, setDisable] = useState(true);
  const [itemActive, setItemActive] = useState();
  const [answerListState, setAnswerList] = useState([]);
  const [radioSelected, setRadioSelected] = useState([]);
  const [indexHint, setIndexHint] = useState(0);
  let query = {};
  if (router.query.payload) {
    const payload = router.query.payload;
    try {
      const actual = window.atob ? window.atob(payload) : '';
      query = JSON.parse(actual);
      // query.id = 921;
      if (window) {
        window.localStorage.setItem('token_admin', query.token);
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (!router.query.payload) return;
    axios.get(query.source, { headers: { Authorization: 'Bearer ' + query.token } }).then((data) => {
      setData(data);
      console.log(data);
    });
  }, [router.query]);

  if (!data) return null;
  const dataPractice = data;
  const answers = dataPractice?.answer || [];
  const question = dataPractice || {};
  const answer_option = dataPractice?.answer_option || {};
  const dataGapFilling = [answer_option];
  var answerRight = 0;
  answer_option?.length > 0 &&
    answer_option.map((item) => {
      if (item?.list?.is_correct) {
        answerRight = answerRight + 1;
      }
    });
  const submit = () => {
    var isFail = false;
    var params = {
      event_type: 'answer_question',
      question_id: dataPractice?.question_uuid,
      is_answer_correct: '',
      click_on: Math.floor(Date.now() / 1000),
      answer_id: '',
      question_type: id,
      status_answer: status
    };

    if (dataType == 'answers-option.matching-line') {
      const [answer, result] = funcSubmit.current();
      params.is_answer_correct = result ? true : false;
      if (status !== 'cancel') {
        params.state = answer;
      }

      setStatus(result ? 'correct' : 'fail');
    }

    if (dataType == 'answers-option.multi-choice') {
      const result = answer_option.filter((item) => item.list.is_correct === true);
      const answerOptionCorrect = [];
      result.map((value) => answerOptionCorrect.push(value.list.id));
      if (checkArrays(answerOptionCorrect, answerListState)) {
        setStatus('correct');
      } else {
        isFail = true;
        setStatus('fail');
      }
      params.state = answerListState;
      params.is_answer_correct = isFail ? false : true;
    }
    if (dataType == 'answers-option.table') {
      radioSelected.map((item) => {
        if (item.choice == item.is_correct) {
          setStatus('correct');
        } else {
          isFail = true;
          setStatus('fail');
        }
      });
      params.is_answer_correct = isFail ? false : true;
      params.state = radioSelected;
    }
    if (dataType == 'answers-option.gap-filling') {
      const [answer, result] = funcSubmit.current();
      params.is_answer_correct = result ? true : false;
      if (status !== 'cancel') {
        params.state = answer;
      }
      setStatus(result ? 'correct' : 'fail');
    }
  };
  const nextQuestion = () => {
    setStatus('review');
    setDisable(true);
    setShowSuggestions(false);
    setItemActive(null);
    setAnswerList([]);
    setRadioSelected([]);
  };
  const cancelQuestion = () => {
    setStatus('cancel');
    setCancel(false);
    setDisable(true);
  };
  const selectRadio = (value, choice) => {
    const arrSelected = [...(radioSelected || [])];
    if (arrSelected.includes(value)) {
      const index = arrSelected.indexOf(value);
      arrSelected[index] = value;
      arrSelected[index]['choice'] = choice === 'right' ? true : false;
    } else {
      arrSelected.push(value);
      const index = arrSelected.indexOf(value);
      arrSelected[index]['choice'] = choice === 'right' ? true : false;
    }
    setRadioSelected(arrSelected);
  };

  const dataType = answer_option[0] ? answer_option[0].__component : '';
  const changeAnswer = () => {};
  return (
    <Fragment>
      <div className="flex flex-wrap">
        <div className="bg-white left-practice w-2/4 overflow-y-auto">
          <div className="content-question">
            <div className={`contentt p-5 md:p-7 ${question?.hints?.length > 0 ? 'min-h-[75%]' : 'h-full'}`}>
              <div>
                <div className="flex items-center justify-center">
                  <LatexCom data={question?.content} key={dataPractice?.question_uuid} />
                </div>
                <div className="hints">
                  <div className="hint-content mt-[24px] border-[#E8E8E8] border-[1px] rounded-[12px] p-[20px] w-full">
                    <p className="text-caption-1-highlight text-gray mb-3">GỢI Ý GIẢI</p>
                    {Array.from(Array(question?.hints?.length || 0), (e, i) => {
                      return (
                        <div key={i} className="flex items-center text-opacity">
                          <span className="text-[5px] mr-2 mb-[8px]">⚫️</span>
                          {<LatexCom data={question?.hints?.length && question?.hints[i]?.content} key={i} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <motion.div
          key={question.question_uuid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
          className="right-practice w-full md:w-2/4 bg-smoke overflow-y-auto height-footer-action"
        >
          {dataType === 'answers-option.multi-choice' && (
            <MultileChoice
              isDisable={isDisable}
              submit={submit}
              cancelQuestion={cancelQuestion}
              nextQuestion={nextQuestion}
              answer_option={answer_option}
              answers={answers}
              answerRight={answerRight}
              answerListState={answerListState}
              itemActive={itemActive}
              question={question}
              changeAnswer={changeAnswer}
              status={status}
              isReview={true}
            />
          )}
          {dataType === 'answers-option.table' && (
            <Table
              isDisable={isDisable}
              submit={submit}
              cancelQuestion={cancelQuestion}
              nextQuestion={nextQuestion}
              selectRadio={selectRadio}
              radioSelected={radioSelected}
              answer_option={answer_option}
              answers={answers}
              answerRight={answerRight}
              answerListState={answerListState}
              itemActive={itemActive}
              question={question}
              status={status}
              isReview={true}
            />
          )}
          {dataType === 'answers-option.gap-filling' && (
            <GapFilling
              funcUpdate={funcSubmit}
              answer_option={answer_option}
              answers={answers}
              question={question}
              status={status}
              isDisable={isDisable}
              setDisable={setDisable}
              isReview={true}
            />
          )}
          {dataType === 'answers-option.matching-line' && (
            <Matching
              status={status}
              isDisable={isDisable}
              submitProp={submit}
              cancelQuestion={cancelQuestion}
              nextQuestion={nextQuestion}
              statusProps={status}
              question={question}
              data={answer_option}
              funcUpdate={funcSubmit}
              setDisable={setDisable}
              isReview={true}
            />
          )}
        </motion.div>
      </div>
      {/* <ModalTheory
        open={openTheory}
        setOpen={setOpenTheory}
        lesson={dataTheory}
        setData={setDataTheory}
        src={src}
        setSrc={setSrc}
        id={idPractice}
      /> */}
    </Fragment>
  );
};
export default Practice;
Practice.permission = 'public';
