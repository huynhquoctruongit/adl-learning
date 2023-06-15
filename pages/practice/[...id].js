import GapFilling from '@/components/dataTypes/gap-filling';
import Matching from '@/components/dataTypes/matching';
import MultileChoice from '@/components/dataTypes/multiple-choice';
import Table from '@/components/dataTypes/table';
import ActionRight from '@/components/layouts/footer-practice';
import ModalTheory from '@/components/modal/modalPractice/theory';
import NavBar from '@/components/partial/navbar';
import { useInteraction } from '@/hooks/use-interaction';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import ModalCancel from '../../components/modal/modalPractice/cancel';
import { Interaction } from '@/api/interaction-api';
import { motion } from 'framer-motion';
import { LatexCom } from '@/components/dataTypes/matching/item';
import { checkArrays, firstLetterCapitalize } from '@/service/helper';
import MathJaxBlock from '@/components/common/mathtype/MaxJax';
import { useKnowledge } from '@/hooks/use-knowledge';
import Head from 'next/head';
import { useAuth } from '@/hooks/use-auth';
import Button from '@/components/common/button/basic';
import useOnClickOutside from '@/hooks/outside';
import WarningUnsave from '@/components/modal/warn';
import { useTracking } from '@/hooks/use-tracking';
import { Tracker } from '@/libs/tracking';
import SkipPractice from '@/components/modal/skip-practice';
import ModalResultDiagnose from '../../components/modal/modalPractice/result-practice';

let timmer = null;

const Practice = ({ data, infomation, activeDefautl, resultDefault, questions, dataQuestionsFilter, countLimit }) => {
  const funcSubmit = useRef();
  const refTimeout = useRef();
  const refTooltip_1 = useRef();
  const refTooltip_2 = useRef();

  const { profile } = useAuth();
  const router = useRouter();
  const { mutate } = useKnowledge();
  const [resultPractice, setResultPractice] = useState({
    isShow: resultDefault,
    isReview: resultDefault,
    status: false,
    isLastQuestion: false,
    level: 'medium'
  });

  const paramsTracking = useRef({
    questionID: '',
    timeStart: 0,
    timeEnd: 0,
    questionType: '',
    questionTypeID: router.query?.id?.[0],
    solutionID: [],
    theoryID: [],
    user_answers: '',
    is_answer_correct: ''
  });

  const [isContinutePractice, setContinutePractice] = useState({
    isShow: false,
    passByRule: false
  });
  const [isOpenCancel, setOpenCancel] = useState(false);
  const [isOpenTooltipUpgrade, setOpenTooltipUpgrade] = useState(false);
  const [isCancel, setCancel] = useState(false);
  const [openTheory, setOpenTheory] = useState(false);
  const [isShowSuggestions, setShowSuggestions] = useState(false);
  const [idPractice, setIdPractice] = useState(0);
  const [src, setSrc] = useState('');
  const [dataTheory, setDataTheory] = useState('');
  const id = router.query?.id?.[0];
  const [status, setStatus] = useState('pending');
  const [isDisable, setDisable] = useState(true);
  const [itemActive, setItemActive] = useState();
  const [answerListState, setAnswerList] = useState([]);
  const [radioSelected, setRadioSelected] = useState([]);
  const [indexHint, setIndexHint] = useState(0);
  const { interaction, pushInteraction, checkPassQT } = useInteraction();
  const [active, setActive] = useState(activeDefautl);

  const question_uuid = (data?.data || [])[active]?.attributes.question_uuid;
  const { lesson_of_question_type, lesson_of_unit, lesson_of_lo, all_lesson_of_lo, question_type } = infomation || {};

  const dataPractice = questions[active];
  const answers = dataPractice?.attributes?.answer || [];
  const question = dataPractice?.attributes || {};
  const answer_option = dataPractice?.attributes.answer_option || {};
  const [dataGapFilling, setDataGapFilling] = useState([answer_option]);

  var answerRight = 0;
  answer_option?.length > 0 &&
    answer_option.map((item) => {
      if (item?.list?.is_correct) {
        answerRight = answerRight + 1;
      }
    });
  useOnClickOutside(refTooltip_1, () => {
    setOpenTooltipUpgrade(false);
  });
  useOnClickOutside(refTooltip_2, () => {
    setOpenTooltipUpgrade(false);
  });
  const timer = 5000;
  useEffect(() => {
    if (isOpenTooltipUpgrade) {
      clearTimeout(refTimeout.current);
      refTimeout.current = setTimeout(() => {
        setOpenTooltipUpgrade(false);
      }, timer);
    } else {
      clearTimeout(refTimeout.current);
    }
  }, [isOpenTooltipUpgrade]);

  useEffect(() => {
    if (interaction.data) {
      const result = checkPassQT(interaction.data);
      if (result === 'pass' && !isContinutePractice.passByRule) {
        setContinutePractice({
          ...isContinutePractice,
          isShow: true,
          passByRule: true
        });
      }
    }
  }, [interaction, isContinutePractice]);
  useEffect(() => {
    if (active && dataQuestionsFilter) {
      if (active == dataQuestionsFilter.length - 1) {
        setResultPractice({ ...resultPractice, isLastQuestion: true });
      } else {
        setResultPractice({ ...resultPractice, isLastQuestion: false });
      }
    }
  }, [active]);

  useEffect(() => {
    if (question_uuid && infomation && interaction) {
      const now = new Date().getTime();
      const solution = lesson_of_question_type?.lesson_uuid;
      const theories = all_lesson_of_lo.map((item) => item.lesson_uuid);

      paramsTracking.current.questionType = dataType.replace('answers-option.', '');
      paramsTracking.current.questionID = question_uuid;
      paramsTracking.current.solutionID = [solution];
      paramsTracking.current.theoryID = theories;
      paramsTracking.current.timeStart = now;
    }
  }, [question_uuid, infomation]);

  useEffect(() => {
    return () => {
      clearTimeout(refTimeout.current);
      clearTimeout(timmer);
      // mutate knowledge to updates knowledge
      mutate();
    };
  }, []);
  const continutePractice = (status) => {
    setContinutePractice({
      ...isContinutePractice,
      isShow: false
    });
  };
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
      category: 'practice',
      event: 'attempt',
      action: 'info',
      params: paramsTracking.current
    });
  };

  const submit = async () => {
    let user_answers = null;
    let correct_answer = null;

    var isFail = false;
    var params = {
      event_type: 'answer_question',
      question_id: dataPractice?.attributes?.question_uuid,
      is_answer_correct: '',
      click_on: Math.floor(Date.now() / 1000),
      answer_id: '',
      question_type: id,
      status_answer: status
    };

    if (dataType == 'answers-option.matching-line') {
      const [answer, result, correct = []] = funcSubmit.current();
      user_answers = answer
        .filter((element) => {
          if (element.left?.id && element.right?.id) return true;
        })
        .map((item) => JSON.stringify([item.left.id, item.right.id]));
      correct_answer = correct.map((item) => JSON.stringify(item));
      params.is_answer_correct = result ? true : false;
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
      if (checkArrays(answerOptionCorrect, answerListState)) {
        setStatus('correct');
      } else {
        isFail = true;
        setStatus('fail');
      }
      // if(answerRight > 1)
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
      const tempAnswer = [];
      const tempUserAnswer = [];

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
      params.is_answer_correct = result ? true : false;

      if (status !== 'cancel') {
        params.state = answer;
      }
      setStatus(result ? 'correct' : 'fail');
    }

    const result = await pushInteraction(params);
    Interaction.send(params);

    sendTrackingEnd(user_answers, correct_answer, params.is_answer_correct);

    if (result === 'pass' && !isContinutePractice) {
      setContinutePractice({
        ...isContinutePractice,
        isShow: true,
        passByRule: true
      });
    }
  };
  const nextQuestion = () => {
    setIndexHint(0);
    if (active === dataQuestionsFilter.length - 1) {
      setResultPractice({ ...resultPractice, isShow: true, isReview: true });
      setActive(countLimit);
    } else {
      if (active + 1 === interaction?.data.length) {
        setStatus('pending');
        setDisable(true);
      } else {
        setStatus('review');
        setDisable(false);
      }
      setShowSuggestions(false);
      setItemActive(null);
      setActive((state) => state + 1);
      setAnswerList([]);
      setRadioSelected([]);
    }
  };
  const cancelQuestion = () => {
    // sendTrackingEnd(null, null, false);
    setAnswerList([]);
    setRadioSelected([]);
    setStatus('cancel');
    setCancel(false);
    setDisable(true);
    var params = {
      event_type: 'answer_question',
      question_id: dataPractice?.attributes?.question_uuid,
      is_answer_correct: false,
      click_on: Math.floor(Date.now() / 1000),
      answer_id: '',
      question_type: id,
      status_answer: 'cancel'
    };
    pushInteraction(params);
    Interaction.send(params);
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
  const dataPopup = (id) => {
    setIdPractice(id);
    if (id === 1) {
      setOpenTheory(true);
      setDataTheory([lesson_of_question_type]);
    } else if (id === 2) {
      setOpenTheory(true);
      setDataTheory(all_lesson_of_lo);
    } else if (id === 3) {
      setOpenTheory(true);
      setDataTheory(lesson_of_unit);
    }
  };

  const openPracticalModal = (id) => {
    // tracking
    const dataTracking = { category: 'practice', action: 'opened' };
    if (id === 1) {
      dataTracking.params = { solutionID: [lesson_of_question_type?.lesson_uuid], time: new Date().getTime() };
      dataTracking.event = 'solution';
      Tracker.send(dataTracking);
    }
    if (id === 2) {
      const theories = all_lesson_of_lo.map((item) => item.lesson_uuid);
      dataTracking.event = 'theory';
      dataTracking.params = { theoryID: theories, time: new Date().getTime() };
      Tracker.send(dataTracking);
    }
    const content_scope = infomation?.chapter?.content_scope?.name;
    if (content_scope === 'trial') {
      if (profile?.role !== 'free') {
        dataPopup(id);
      } else {
        setOpenTooltipUpgrade(id);
      }
    }
    if (content_scope == null || content_scope == undefined || content_scope === 'free') {
      dataPopup(id);
    }
    if (content_scope === 'premium') {
      if (profile?.role === 'premium') {
        dataPopup(id);
      } else {
        setOpenTooltipUpgrade(id);
      }
    }
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

  const listButton = [
    {
      id: 1,
      name: 'Phương pháp giải',
      className:
        'bg-yellow-highlight text-white w-[50%] flex items-center justify-center mr-2 text-caption-1 md:text-caption-1-highlight md:text-body-2-highlight',
      src: '/images/icon/ADT-icon-pen.png',
      param: '&solution_modal=open',
      onClick: () => openPracticalModal(1)
    },
    {
      id: 2,
      name: 'Xem lý thuyết',
      className:
        'bg-highlight-green text-white w-[50%] flex items-center justify-center mr-2 text-caption-1-highlight md:text-body-2-highlight',
      src: '/images/icon/ADT-icon-book.png',
      param: '&theory_modal=open',
      onClick: () => openPracticalModal(2)
    }
  ];

  const dataType = answer_option[0] ? answer_option[0].__component : '';
  const chooseQuestion = (value, index) => {
    setOpenTheory(false);
    if (value === 'result' && interaction?.data && interaction?.data.length == dataQuestionsFilter.length) {
      setIndexHint(0);
      setResultPractice({ ...resultPractice, isShow: true, isReview: true });
      setActive(countLimit);
    } else {
      setIndexHint(0);
      setAnswerList([]);
      if (interaction?.data.length > 0 && value?.attributes) {
        const answerSelected = interaction.data.find((item) => item.question_id == value.attributes.question_uuid);
        if (answerSelected) {
          setContinutePractice({
            ...isContinutePractice,
            isShow: false
          });
          setResultPractice({ ...resultPractice, isShow: false });
          setShowSuggestions(false);
          setStatus('review');
          setActive(index);
          const type = value.attributes.answer_option[0].__component;
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
  };
  const nextHint = () => {
    setIndexHint((index) => (index = index + 1));
  };
  const onShowSuggestions = () => {
    setShowSuggestions(true);
  };
  const ToolTip = ({ refTooltip, item, index }) => {
    return (
      <motion.div
        ref={refTooltip}
        key={item.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: 'easeOut', duration: 0.3 }}
        className="absolute md:w-[363px] rounded-[12px] bg-purple-medium p-[24px] w-[90%] md:left-[unset] translate-y-[170px] m-auto left-0 right-0 md:translate-x-[0px] z-[100]"
      >
        <div className="">
          <div className={`shape-triangle-top md:left-[48px] ${index == 1 ? 'right-[24%]' : 'left-[24%]'}`}></div>
          <div className="flex w-fit items-center border-[1px] border-white rounded-full p-[2px] px-[10px]">
            <img src="/images/lock.png" width="16px" />
            <p className="text-caption-1-highlight">NỘI DUNG TRẢ PHÍ</p>
          </div>
          <p className="text-headline-3 my-2 text-left">{item?.name}</p>
          <p className="text-left">Video và bài đọc giúp bạn nhanh chóng nắm được phương pháp giải dạng bài.</p>
          <div className="flex justify-center">
            <div className="w-full">
              <Button
                onClick={() => {
                  router.push({ pathname: '/account', query: { tab: 'payment' } });
                }}
                type="yellow"
                size="full"
                className="ml-0 mt-4 bg-yellow text-black text-body-2-highlight hover:bg-yellow-medium"
              >
                Nâng cấp ngay
              </Button>
              <p className="text-center mt-3 min-w-[100px] text-white text-caption-2-highlight">
                Chỉ từ 49.000đ/ tháng
              </p>
            </div>
            <p
              onClick={() => {
                refTimeout.current = setTimeout(() => {
                  setOpenTooltipUpgrade(false);
                }, 0);
              }}
              className="text-center mt-6 min-w-[100px] text-yellow text-body-2-highlight cursor-pointer"
            >
              Để sau
            </p>
          </div>
        </div>
      </motion.div>
    );
  };
  if (!interaction && !question_type) return null;
  return (
    <Fragment>
      <Head>
        <title>{question_type?.name}</title>
        <meta name="description" content="ICAN - Học Toán cùng Gia sư AI" />
      </Head>
      <NavBar
        backLink={`/learning-path`}
        limit={countLimit}
        questionsTypeId={id}
        chooseQuestion={chooseQuestion}
        data={dataQuestionsFilter}
        active={active}
        dataQuestionType={question_type}
        showRedirect={true}
        type="practice"
        isResult={resultPractice.isShow}
        infomation_v1={infomation}
      />
      <div className="flex flex-wrap flex-col md:flex-row">
        <div className="bg-white left-practice w-full md:w-2/4 overflow-visible  md:overflow-y-auto height-footer-action">
          <div
            style={{ zIndex: '1' }}
            className="button-group-left flex sticky justify-center items-stretch py-[20px] px-5 md:px-8 bg-white md:backdrop-blur-[50px] top-0"
          >
            {listButton.map((item, index) => (
              <button
                key={'button_key' + index}
                onClick={item.onClick}
                className={` py-1.5 md:py-1 px-2 md:px-4  flex items-center last:mr-0 rounded-[8px] content-center focus:outline-none ${item.className}`}
              >
                {item.src ? (
                  <img src={item.src} alt="Adaptive Learning" className="mr-2 w-4 h-4 md:w-8 md:h-8" />
                ) : null}
                <span>{item.name}</span>
                {isOpenTooltipUpgrade == index + 1 ? (
                  <ToolTip index={index} refTooltip={index == 0 ? refTooltip_1 : refTooltip_2} item={item} />
                ) : (
                  ''
                )}
              </button>
            ))}
          </div>
          <div className="content-question">
            <div
              className={`contentt flex-1 md:w-full pt-0 ${
                question?.hints?.length > 0 ? 'h-auto md:min-h-[calc(100vh-168px)] flex items-center' : 'h-full'
              }`}
            >
              <div className="w-full">
                <div className="flex items-center justify-center h-full px-5 w-screen md:w-full">
                  <div className="w-full">
                    <MathJaxBlock
                      content={question?.content}
                      name="tatex"
                      key={dataPractice?.attributes.question_uuid}
                    />
                  </div>
                </div>
                {question?.hints?.length > 0 && !isShowSuggestions && (
                  <p
                    onClick={onShowSuggestions}
                    className="text-right text-body-2-highlight text-purple p-5 md:m-7 cursor-pointer"
                  >
                    Xem gợi ý giải
                  </p>
                )}
                {isShowSuggestions && (
                  <div className="hints p-5 md:p-7 ">
                    <div className="hint-content border-[#E8E8E8] border-[1px] rounded-[12px] p-[20px] w-full">
                      <p className="text-caption-1-highlight text-gray mb-3">GỢI Ý GIẢI</p>
                      {Array.from(Array(indexHint + 1), (e, i) => {
                        return (
                          <div key={i} className="flex items-center text-opacity">
                            <span className="text-[5px] mr-2 mb-[8px]">⚫️</span>
                            {<LatexCom data={question?.hints?.length && question?.hints[i]?.content} key={i} />}
                          </div>
                        );
                      })}
                      {question?.hints?.length > 0 && question?.hints?.length !== indexHint + 1 && (
                        <p
                          onClick={nextHint}
                          className="mt-4 text-body-2-highlight text-purple text-right flex justify-end items-center cursor-pointer"
                        >
                          Gợi ý tiếp theo <img src="/images/fi_arrow-down.png" className="w-[24px] ml-[8px]"></img>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <motion.div
          key={question.question_uuid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
          className="right-practice  mb-16 md:mb-0 w-full md:w-2/4 bg-smoke overflow-y-auto height-footer-action"
        >
          {dataType === 'answers-option.multi-choice' && (
            <MultileChoice
              isDisable={true}
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
          {answer_option.length > 0 && (
            <ActionRight
              open={isCancel}
              setOpen={setCancel}
              status={status}
              isDisable={isDisable}
              submit={submit}
              cancelQuestion={cancelQuestion}
              nextQuestion={nextQuestion}
              isLastQuestion={resultPractice.isLastQuestion}
              paramsTracking={paramsTracking}
            />
          )}
        </motion.div>
      </div>
      <ModalResultDiagnose
        data={dataQuestionsFilter}
        limit={countLimit}
        interaction={interaction}
        dataQuestionType={question_type}
        open={resultPractice}
        passByRule={isContinutePractice.passByRule}
        setOpen={setResultPractice}
        countLimit={countLimit}
      />
      <motion.div
        key={question.question_uuid}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ModalCancel open={isOpenCancel} setOpen={setOpenCancel} />
        <ModalTheory
          open={openTheory}
          setOpen={setOpenTheory}
          lesson={dataTheory}
          setData={setDataTheory}
          src={src}
          setSrc={setSrc}
          id={idPractice}
        />
      </motion.div>
      {!resultPractice.isShow && isContinutePractice.isShow ? (
        <SkipPractice
          continutePractice={continutePractice}
          setResultPractice={setResultPractice}
          resultPractice={resultPractice}
          qt_id={id}
          interaction={interaction}
          isShow={isContinutePractice.isShow}
          countLimit={countLimit}
        />
      ) : (
        ''
      )}

      <WarningUnsave
        preventDefault={!resultPractice.isReview}
        title="Bạn muốn dừng làm bài?"
        subTitle="Quá trình làm bài của bạn sẽ được lưu."
        type="question"
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

const getQTByLevel = {
  easy: 12,
  medium: 12,
  hard: 10
};

const WrapPractice = () => {
  const router = useRouter();
  const [id, levelUrl] = router.query?.id || [];
  const level = firstLetterCapitalize(levelUrl);
  const url_question = `/questions/?populate=answer_option.list&populate=hints&populate=answer&filters[question_type][question_type_uuid]=${id}&filters[difficulty]=${level}&filters[type]=Practice`;
  const { data } = useSWR(id ? url_question : '');
  const url_lesson = `/question_type_details?question_type_details&populate=chapter&populate=program&question_type_uuid=${id}`;
  const { data: infomation } = useSWR(id ? url_lesson : null);

  const { interaction, firstLoading } = useInteraction();
  if (firstLoading || !data || !infomation) return null;

  let active = 0;
  let isResult = false;

  var limitQT = getQTByLevel[levelUrl];
  const questions = (data?.data || []).sort((a, b) => a.attributes.order - b.attributes.order);
  const dataQuestionsFilter = questions.slice(0, limitQT);
  const countLimit = dataQuestionsFilter?.length;

  if (interaction?.data) {
    if (interaction?.data && interaction?.data?.length == countLimit && countLimit > 0) {
      active = countLimit;
      isResult = true;
    } else {
      active = interaction?.data?.length;
    }
  }

  return (
    <Practice
      dataQuestionsFilter={dataQuestionsFilter}
      countLimit={countLimit}
      questions={questions}
      limitQT={limitQT}
      infomation={infomation}
      data={data}
      activeDefautl={active}
      resultDefault={isResult}
    />
  );
};

export default WrapPractice;
