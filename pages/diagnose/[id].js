import GapFilling from '@/components/dataTypes/gap-filling';
import Matching from '@/components/dataTypes/matching';
import MultileChoice from '@/components/dataTypes/multiple-choice';
import Table from '@/components/dataTypes/table';
import ActionRight from '@/components/layouts/footer-practice';
import NavBar from '@/components/partial/navbar';
import { useInteraction } from '@/hooks/use-interaction';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import CountDown from '../../components/partial/lesson/result/countdown';
import useSWR from 'swr';
import ModalCancel from '../../components/modal/modalPractice/cancel';
import ModalSummary from '../../components/modal/modalPractice/summary';
import { Interaction } from '@/api/interaction-api';
import { motion } from 'framer-motion';
import { LatexCom } from '@/components/dataTypes/matching/item';
import ModalResultDiagnose from '../../components/modal/modalPractice/result-diagnose';
import { useDiagnoseList } from '@/hooks/use-diagnose';
import { useKnowledge } from '@/hooks/use-knowledge';
import Head from 'next/head';
import { Tracker } from '@/libs/tracking';
import WarningUnsave from '@/components/modal/warn';

let prevent = false;

const Diagnose = () => {
  const funcSubmit = useRef();
  const closeWarning = useRef();
  const router = useRouter();

  const paramsTracking = useRef({
    questionID: '',
    timeStart: 0,
    timeEnd: 0,
    questionType: '',
    questionTypeID: router.query?.id?.[0],
    correct_answer: '',
    user_answers: '',
    is_answer_correct: ''
  });

  const { id } = router.query;
  const { isLoaded, question_list: questionDiagnose = {} } = useDiagnoseList(id);
  const { knowledge, getStatus, updateKnowledge } = useKnowledge(id);
  const [resultDiagnose, setResultDiagnose] = useState({
    isShow: false,
    isReview: false,
    status: false,
    level: 'medium',
    next: null
  });
  const [isOpenCancel, setOpenCancel] = useState(false);
  const [isOpenSummary, setOpenSummary] = useState(false);
  const [isCancel, setCancel] = useState(false);
  const [isShowTime, setShowTime] = useState(true);
  const [status, setStatus] = useState('pending');
  const [active, setActive] = useState(0);
  const [isDisable, setDisable] = useState(true);
  const [itemActive, setItemActive] = useState();
  const [answerListState, setAnswerList] = useState([]);
  const [radioSelected, setRadioSelected] = useState([]);
  const { interaction, firstLoading: fisrtInteract, pushInteraction, getInteractionByDiffilcut } = useInteraction();
  const dataDiagnose = questionDiagnose[resultDiagnose.level];

  const url_lesson = `/question_type_detail_v2/${id}`;
  const { data: infomation_v1 } = useSWR(
    id ? `/question_type_details?populate=chapter&populate=program&question_type_uuid=${id}` : null
  );
  const { data: infomation } = useSWR(id ? url_lesson : null);
  const question_type = infomation?.data;

  var listQuestionLevel = [];
  var mergeData = [];
  questionDiagnose &&
    Object.keys(questionDiagnose).map(function (key, index) {
      questionDiagnose[key].map((item) => {
        mergeData.push(item);
      });
    });

  interaction?.data?.filter((data) => {
    mergeData.map((item, index) => {
      if (item?.question_uuid == data?.question_id) {
        listQuestionLevel.push(item);
      }
    });
  });

  const questions = resultDiagnose.isReview ? listQuestionLevel : dataDiagnose || [];
  const dataPractice = questions[active];
  const answers = dataPractice?.answer || [];
  const question = dataPractice || {};
  const answer_option = dataPractice?.answer_option || {};
  const [dataGapFilling, setDataGapFilling] = useState([answer_option]);
  var limit = listQuestionLevel.length;
  var answerRight = 0;
  answer_option?.length > 0 &&
    answer_option.map((item) => {
      if (item?.list?.is_correct) {
        answerRight = answerRight + 1;
      }
    });

  useEffect(() => {
    if (!dataPractice) return;
    const now = new Date().getTime();
    paramsTracking.current.timeStart = now;
    paramsTracking.current.questionID = dataPractice.question_uuid;
    paramsTracking.current.questionType = dataType.replace('answers-option.', '');

  }, [dataPractice]);

  useEffect(() => {
    if (fisrtInteract || !question_type) return;
    const { diagnose } = knowledge || {};
    const item = diagnose?.status?.find((element) => element.question_type === id);
    const stateStatus = getStatus(item, question_type.difficulty_levels);
    if (stateStatus.status === 'pending') {
      const list_answer_by_deffilcut = getInteractionByDiffilcut(stateStatus.level);
      const active = list_answer_by_deffilcut?.length > 0 ? list_answer_by_deffilcut.length : 0;
      setActive(active);
      setResultDiagnose((state) => ({ ...state, level: stateStatus.level }));
    } else {
      setResultDiagnose((state) => ({ ...state, isShow: true, isReview: true, next_is_review: true }));
    }
  }, [fisrtInteract, question_type]);

  const changeAnswer = (event) => {
    const answerList = [...answerListState];
    if (answerList.includes(parseInt(event.currentTarget.value))) {
      const index = answerList.indexOf(parseInt(event.currentTarget.value));
      if (index > -1) {
        answerList.splice(index, 1);
      }
    } else {
      answerList.push(parseInt(event.currentTarget.value));
    }
    if (answerRight > 1) {
      setAnswerList(answerList);
    } else {
      setAnswerList([event.currentTarget.value]);
    }
    setItemActive(event.currentTarget.value);
  };

  const sendTrackingEnd = (user_answers, correct_answer, is_answer_correct) => {
    paramsTracking.current.questionType = dataType.replace('answers-option.', '');
    paramsTracking.current.user_answers = user_answers;
    paramsTracking.current.correct_answer = correct_answer;
    paramsTracking.current.timeEnd = new Date().getTime();
    paramsTracking.current.is_answer_correct = is_answer_correct;

    Tracker.send({
      category: 'diagnose',
      event: 'attempt',
      action: 'info',
      params: paramsTracking.current
    });
  };

  const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const submit = async () => {
    let user_answers = null;
    let correct_answer = null;

    var isFail = false;
    var params = {
      event_type: 'answer_question',
      question_id: dataPractice?.question_uuid,
      is_answer_correct: '',
      click_on: Math.floor(Date.now() / 1000),
      answer_id: '',
      question_type: id,
      current_action: 'diagnose',
      difficulty_level: resultDiagnose.level.toLowerCase(),
      flow: 'diagnose',
      status_answer: status
    };

    if (dataType == 'answers-option.matching-line') {
      const [answer, result, correct = []] = funcSubmit.current();
      params.is_answer_correct = result ? true : false;
      // filter answer user choose
      user_answers = answer.filter(element => {
        if (element.left?.id && element.right?.id) return true
      }).map((item) => JSON.stringify([item.left.id, item.right.id]));
      correct_answer = correct.map((item) => JSON.stringify(item));
      if (status !== 'cancel') {
        params.state = answer;
      }
      setStatus(result ? 'correct' : 'fail');
    }

    if (dataType == 'answers-option.multi-choice') {
      const result = answer_option.filter((item) => item.list.is_correct === true);
      correct_answer = result.map((answer) => answer.list.id + '');
      user_answers = answerListState.map((element) => element + '');
      const answerOptionCorrect = [];
      result.map((value) => answerOptionCorrect.push(value.list.id));
      if (equals(answerOptionCorrect.toString(), answerListState.toString())) {
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
      correct_answer = radioSelected.map((element) => (element.is_correct ? 'true' : 'false'));
      user_answers = radioSelected.map((element) => (element.choice ? 'true' : 'false'));
    }
    if (dataType == 'answers-option.gap-filling') {
      const [answer, result] = funcSubmit.current();
      params.is_answer_correct = result ? true : false;
      let tempUserAnswer = [];
      let tempAnswer = [];
      Object.keys(answer.store)
        .sort()
        .map((item) => {
          const [index] = item.split('-');
          if (!tempUserAnswer[index]) tempUserAnswer[index] = [];
          if (!tempAnswer[index]) tempAnswer[index] = [];
          tempUserAnswer[index].push(answer.store[item] + '' || '');
          tempAnswer[index].push(answer.answers[item] + '' || '');
        });

      user_answers = tempUserAnswer.map((element) => JSON.stringify(element));
      correct_answer = tempAnswer;

      if (status !== 'cancel') {
        params.state = answer;
      }
      setStatus(result ? 'correct' : 'fail');
    }
    sendTrackingEnd(user_answers, correct_answer, params.is_answer_correct);
    setShowTime(false);
    prevent = true;
    await pushInteraction(params);
    await Interaction.send(params);
    checkLevel();
  };

  const checkLevel = async () => {
    const { diagnose } = (await updateKnowledge()) || {};
    const item = diagnose?.status?.find((element) => element.question_type === id);
    const diagnose_status = getStatus(item, question_type.difficulty_levels);
    const isReview = diagnose_status.status === 'pending' ? false : true;

    setResultDiagnose((state) => ({
      ...state,
      level: resultDiagnose.level,
      next_level: diagnose_status.level,
      next: diagnose_status.level !== resultDiagnose.level ? 0 : active + 1,
      next_is_review: isReview
    }));

    // debugger;
    // Vì khi nào user bấm nextquestion thì mới thay đổi nên lưu vào này.
    // next_level: là level tiếp theo sau khi countdown hoặc bấm bài kế tiếp
    // next: là vị trí tiếp theo sau khi countdown hoặc bấm bài kế tiếp
    // next_is_review: isReview là user đó đã làm xong diagnose giờ chỉ xem lại
  };

  const nextQuestion = () => {
    // flow next in review
    // debugger;
    if (prevent) return;
    if (resultDiagnose.isReview) {
      if (active === questions.length - 1) {
        setResultDiagnose((state) => ({ ...state, isShow: true }));
        setShowTime(true);
      } else {
        setActive((active) => {
          return active + 1;
        });
      }
      return;
    }

    // flow in diagnnose
    if (!resultDiagnose.next_is_review) {
      setStatus('pending');
      setActive(resultDiagnose.next);
    }

    setResultDiagnose((state) => ({
      ...state,
      level: state.next_level,
      isShow: state.next_is_review,
      isReview: state.next_is_review
    }));

    // finish flow diagnose, then send event log
    if (resultDiagnose.next_is_review) {
      Tracker.send({ action: 'clicked', event: 'submit', category: 'diagnose' });
    }

    setAnswerList([]);
    setRadioSelected([]);
    setShowTime(true);
  };
  const cancelQuestion = async (getStatus) => {
    const statusParam = getStatus === 'timeout' ? 'timeout' : 'cancel';
    // debugger
    setAnswerList([]);
    setRadioSelected([]);
    setStatus(statusParam);
    setShowTime(false);
    setCancel(false);
    setDisable(true);
    var params = {
      event_type: 'answer_question',
      question_id: dataPractice?.question_uuid,
      is_answer_correct: false,
      click_on: Math.floor(Date.now() / 1000),
      answer_id: '',
      question_type: id,
      current_action: 'diagnose',
      difficulty_level: resultDiagnose.level?.toLowerCase(),
      flow: 'diagnose',
      status_answer: statusParam
    };

    // sendTrackingEnd(null, null, false);
    pushInteraction(params);
    Interaction.send(params);
    checkLevel();
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

  useEffect(() => {
    if (answer_option?.length === radioSelected.length || answerListState?.length > 0) {
      setDisable(false);
    } else {
      setDisable(true);
    }
    if (dataType == 'answers-option.gap-filling') {
      const ckeckData = [];
      if (answer_option.length > 0) {
        answer_option.map((item) => {
          dataGapFilling.filter((data) => {
            ckeckData.push(data?.list?.answer);
          });
        });
      }
      if (ckeckData.includes(undefined) || ckeckData.includes('')) {
        setDisable(true);
      } else {
        setDisable(false);
      }
    }
  }, [radioSelected, answer_option, answerListState, dataGapFilling, dataType]);
  const dataType = answer_option[0] ? answer_option[0].__component : '';
  const chooseQuestion = (value, index) => {
    if (value === 'result') {
      setResultDiagnose((state) => ({ ...state, isShow: true, isReview: true }));
    } else {
      setResultDiagnose((state) => ({ ...state, isShow: false }));
      if (interaction?.data.length > 0 && value) {
        const answerSelected = interaction.data.find((item) => item.question_id == value.question_uuid);
        if (answerSelected) {
          setStatus('review');
          setActive(index);
          const type = value.answer_option[0].__component;
          if (type == 'answers-option.multi-choice' && answerSelected?.state?.length > 0) {
            setAnswerList(answerSelected.state || []);
          }
          if (type == 'answers-option.table' && answerSelected?.state?.length > 0) {
            setRadioSelected(answerSelected.state || []);
          }
        } else {
          if (interaction?.data.length === index) {
            setStatus('pending');
            setActive(index);
          }
        }
      }
    }
    setShowTime(false);
  };

  const onTimeout = () => {
    const { modal, action } = closeWarning.current || {};
    if (modal && action) action();
    cancelQuestion('timeout');

    Tracker.send({
      category: 'diagnose',
      action: 'info',
      event: 'timeUp',
      params: {
        questionID: paramsTracking.current.questionID,
        timeStart: paramsTracking.current.timeStart,
        questionType: dataType.replace('answers-option.', '')
      }
    });
  };
  const returnTime = {
    // easy: 1000000,
    // medium: 1000000,
    // hard: 1000000
    easy: 60,
    medium: 120,
    hard: 480
  };

  useEffect(() => {
    prevent = false;
  }, [resultDiagnose]);
  if (!interaction || !isLoaded || !dataType) return null;
  // nếu isRevew !== nextIsReview thì cũng làm câu cuối

  const isLastQuestion =
    (active === questions.length - 1 || resultDiagnose.next_is_review !== resultDiagnose.isReview) &&
    (resultDiagnose.next_is_review || resultDiagnose.isReview);

  return (
    <Fragment>
      <Head>
        <title>{question_type?.name}</title>
        <meta name="description" content="ICAN - Học Toán cùng Gia sư AI" />
      </Head>
      <NavBar
        backLink={`/learning-path`}
        limit={limit}
        questionsTypeId={id}
        chooseQuestion={chooseQuestion}
        active={resultDiagnose.isShow ? -1 : active}
        dataQuestionType={question_type}
        type="diagnose"
        name={question_type?.name}
        data={listQuestionLevel}
        showRedirect={resultDiagnose.isReview}
        showReviewResult={true}
        level={resultDiagnose.level}
        isResult={resultDiagnose.isShow}
        infomation_v1={infomation_v1}
      />
      {!resultDiagnose.isShow && (
        <div className="flex flex-wrap pb-16 md:pb-0">
          <div className="bg-white left-practice w-full md:w-2/4 overflow-y-auto height-footer-action ">
            <div className="button-group-left sticky items-stretch bg-yellow-medium top-0 ">
              {!resultDiagnose.isShow && !resultDiagnose.isReview && (
                <CountDown
                  key="pending"
                  stop={resultDiagnose.isShow}
                  time={isShowTime ? returnTime[resultDiagnose.level] : 10}
                  active={status === 'pending'}
                  onTimeout={isShowTime ? onTimeout : nextQuestion}
                  className="font-semibold text-blue-500"
                />
              )}
            </div>
            <div className="">
              <div
                className={`content p-5 md:p-7 ${question?.hints?.length > 0 ? 'md:h-[75%]' : 'h-full'
                  } flex items-center justify-center`}
              >
                <motion.div
                  key={question.question_uuid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center justify-center">
                    <LatexCom data={question?.content} key={dataPractice?.question_uuid} />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          <motion.div
            key={question.question_uuid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="right-practice w-full md:w-2/4 bg-smoke overflow-y-auto height-footer-action"
          >
            {dataType === 'answers-option.multi-choice' && (
              <MultileChoice
                isDisable={isDisable}
                submit={submit}
                cancelQuestion={cancelQuestion}
                answer_option={answer_option}
                answers={answers}
                answerRight={answerRight}
                answerListState={answerListState}
                itemActive={itemActive}
                question={question}
                changeAnswer={changeAnswer}
                status={status}
                isReview={resultDiagnose.isReview}
              />
            )}
            {dataType === 'answers-option.table' && (
              <Table
                isDisable={isDisable}
                submit={submit}
                cancelQuestion={cancelQuestion}
                selectRadio={selectRadio}
                radioSelected={radioSelected}
                answer_option={answer_option}
                answers={answers}
                answerRight={answerRight}
                answerListState={answerListState}
                itemActive={itemActive}
                question={question}
                status={status}
                isReview={resultDiagnose.isReview}
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
                isReview={resultDiagnose.isReview}
              />
            )}
            {dataType === 'answers-option.matching-line' && (
              <Matching
                isDisable={isDisable}
                setDisable={setDisable}
                statusProps={status}
                question={question}
                data={answer_option}
                funcUpdate={funcSubmit}
                isReview={resultDiagnose.isReview}
              />
            )}
            {answer_option.length > 0 && (
              <ActionRight
                open={isCancel}
                setOpen={setCancel}
                status={status}
                isDisable={isDisable}
                submit={submit}
                cancelQuestion={cancelQuestion}
                nextQuestion={nextQuestion}
                isReview={!resultDiagnose.isReview}
                isLastQuestion={isLastQuestion}
                paramsTracking={paramsTracking}
              />
            )}
          </motion.div>
        </div>
      )}
      <ModalResultDiagnose interaction={interaction} dataQuestionType={question_type} open={resultDiagnose} />
      <ModalCancel open={isOpenCancel} setOpen={setOpenCancel} />
      <ModalSummary interaction={interaction} limit={limit} open={isOpenSummary} setOpen={setOpenSummary} />
      {/* <ModalTheory
        open={openTheory}
        setOpen={setOpenTheory}
        lesson={dataTheory}
        setData={setDataTheory}
        src={src}
        setSrc={setSrc}
        id={idPractice}
      /> */}
      <WarningUnsave
        preventDefault={!resultDiagnose.isReview}
        title="Bạn muốn dừng làm bài?"
        subTitle="Quá trình làm bài của bạn sẽ được lưu."
        type="question"
        closeWarning={closeWarning}
        buttonCancel={{ text: 'Ở lại', action: null }}
        buttonConfirm={{
          text: 'Dừng',
          forceChange: true,
          action: (url) => {
            router.push(url);
          }
        }}
      />
    </Fragment>
  );
};
export default Diagnose;
