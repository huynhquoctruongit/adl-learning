import React, { useRef, Fragment, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import Button from '@/components/common/button/basic';
import { useRouter } from 'next/router';
import StepBarCustom from '@/components/partial/levelBarCustom';
import axiosInteraction from '@/api/base/axios-interaction';
import FlowTag from '@/components/common/flow-tag';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useKnowledge } from '@/hooks/use-knowledge';
import useSWR from 'swr';
import axiosClient from '@/api/base/axios-cms';
import { motion } from 'framer-motion';
import { variantsHidden } from '@/service/config';

export default function ModalResultPractice({
  countLimit,
  dataQuestionType,
  data,
  open,
  setOpen,
  interaction,
  passByRule
}) {
  const router = useRouter();
  const [isNext, setNextAction] = useState(null);
  const [dataNext, setDataNext] = useState(null);
  const { id } = router.query;
  const getLevel = id && id[1];
  const getQuestionType = id && id[0];
  const url_lesson = `/question_type_detail_v2/${getQuestionType}`;
  const { data: dataDetail } = useSWR(id ? url_lesson : null);
  const detail_v2 = dataDetail?.data;
  const { knowledge, getStatus } = useKnowledge(getQuestionType);
  const [isPassedSummary, setPassedSummary] = useState(false);
  const [number, setNumber] = useState(0);
  const { profile } = useAuth({
    revalidateOnMount: false
  });

  const returnNextLevel = (key) => {
    switch (key) {
      case 'medium':
        return 'hard';
      case 'easy':
        return 'medium';
      default:
        return 'medium';
        break;
    }
  };

  useEffect(() => {
    if (open.isShow) {
      if (interaction?.data) {
        interaction?.data.filter((item) => {
          if (item.is_answer_correct) {
            setNumber((number) => number + 1);
          }
        });
      }
    } else {
      setNumber(0);
    }
  }, [open.isShow]);
  const mapIndex = ['easy', 'medium', 'hard', 'veryhard'];
  const getLevelHight = mapIndex[detail_v2?.difficulty_levels.length - 1];
  const lastLevel = (getLevelHight && getLevelHight == getLevel) || getLevel == 'hard';
  var isPass = null;
  useEffect(() => {
    if (open.isShow) {
      if (passByRule || Math.ceil((2 / 3) * data?.length <= number)) {
        setPassedSummary(true);
      }
      if (lastLevel || !passByRule) {
        setNextAction(true);
      } else {
        setNextAction(false);
      }
    }
  }, [open.isShow, number, passByRule, getLevelHight]);
  const returnLevel = (level) => {
    switch (level) {
      case 'easy':
        return 1;
        break;
      case 'medium':
        return 2;
        break;
      case 'hard':
        return 3;
        break;
      default:
        return 'Vừa';
        break;
    }
  };
  const returnLevelTitle = {
    easy: 'Dễ',
    medium: 'Vừa',
    hard: 'Khó',
    veryhard: 'Siêu khó'
  };
  const { practice } = knowledge || {};
  const item = practice?.status?.find((element) => element.question_type === id);
  const state = item ? getStatus(item, detail_v2?.difficulty_levels) : null;

  const currentState = state?.knowledge;
  const nextState = state?.level;

  useEffect(() => {
    if (isNext) {
      axiosInteraction.get(`/knowledge_state/next_qt_force?current_qt=${getQuestionType}`).then((data) => {
        if (data.question_type) {
          axiosClient.get(`/question_type_details?question_type_uuid=${data.question_type}`).then((detail) => {
            setDataNext(detail.question_type);
          });
        } else {
          setDataNext('empty');
        }
      });
    } else {
      if (isNext === false) {
        setDataNext('empty');
      }
    }
  }, [isNext]);
  if (!open.isShow) return null;
  return (
    <Transition.Root show={open.isShow} as={Fragment}>
      <motion.div
        variants={variantsHidden}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.5 }}
        className="fixed z-10 inset-0 overflow-y-auto popup-modal-practice popup-result-diagnose"
        style={{
          backgroundImage: detail_v2?.background ? 'url(' + detail_v2?.background + ')' : '/images/bg-result.png'
        }}
      >
        <div className="flex w-full text-center">
          <span className=" sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

          <div className="inline-block align-bottom rounded-lg text-left overflow-hidden transform transition-all w-full">
            <div className="flex items-center justify-center m-auto  h-full rounded-lg">
              {!isPassedSummary && dataNext !== null ? (
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-1000"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-1000"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <div className="inline-block align-bottom rounded-lg text-left overflow-hidden transform transition-all w-full">
                    <div className="items-center justify-center m-auto h-full w-fit md:mt-[87px] mt-[128px] rounded-lg">
                      <div className="p-[24px] xl:grid-cols-2 bg-white rounded-lg shadow-box max-w-[736px] md:mx-0 mx-[20px]">
                        <div className="block md:flex items-center justify-center">
                          <div className="items-center justify-center md:mb-0">
                            <div className="flex items-center mb-[12px]">
                              <img width="80px" className="mr-[16px]" src="/icons/loudly-crying.png"></img>
                              <div className="flex items-center justify-center">
                                <div>
                                  <span className="text-headline-1">Huhu</span>
                                  <p className="text-body-2-highlight text-gray">
                                    Đúng {interaction?.data.filter((el) => el.is_answer_correct === true).length}/
                                    {countLimit} câu
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <p>
                                Bạn chưa hoàn thành mức độ{' '}
                                <span
                                  className="ml-[2px]"
                                  dangerouslySetInnerHTML={{ __html: returnLevelTitle[getLevel] }}
                                ></span>
                                {Array.apply(null, { length: returnLevel(getLevel) }).map(function (item, index) {
                                  return (
                                    <img
                                      key={'ressult' + index}
                                      className="ml-[2px] inline align-text-bottom"
                                      src="/icons/fire.png"
                                      width="24px"
                                    />
                                  );
                                })}
                              </p>
                              <p>Cùng Gia sư AI chinh phục dạng bài mới nhé!</p>
                            </div>
                          </div>
                          <div className="md:w-[50%] w-full md:mt-0 mt-[16px]">
                            {isNext ? (
                              dataNext?.question_type_uuid && (
                                <div className="ml-0 md:ml-[14px] mt-[16px] md:mt-0">
                                  <div className="tag-best-fit">Phù hợp nhất</div>
                                  <div className="card-practice border-yellow-highlight border-[2px] rounded-b-[12px] md:p-5 p-[12px] relative">
                                    <div className="flex justify-between items-center mb-3">
                                      <FlowTag type="diagnose"></FlowTag>
                                    </div>
                                    <p className="text-body-1-highlight text-left">{dataNext?.name}</p>
                                    <Link
                                      prefetch
                                      href={{ pathname: `/diagnose/overview/${dataNext?.question_type_uuid}` }}
                                    >
                                      <Button
                                        type="default"
                                        disabled={dataNext?.question_type_uuid ? false : true}
                                        className="mr-3 text-white w-full text-center mt-4 mx-[0px] py-2 px-4"
                                      >
                                        Thử sức dạng bài này
                                      </Button>
                                    </Link>
                                  </div>
                                  <Link href={`/practice/overview/${getQuestionType}/${getLevel}`}>
                                    <p className="text-center mt-[16px] size-[16px] font-[600] leading-[24px] underline decoration-solid cursor-pointer text-purple">
                                      Tiếp tục luyện tập dạng bài này
                                    </p>
                                  </Link>
                                </div>
                              )
                            ) : (
                              <div className="ml-0 md:ml-[14px] mt-[16px] md:mt-0">
                                <div className="tag-best-fit">Phù hợp nhất</div>
                                <div className="card-practice border-yellow-highlight border-[2px] rounded-b-[12px] md:p-5 p-[12px] relative">
                                  <div className="flex justify-between items-center mb-3">
                                    <FlowTag type="practice"></FlowTag>
                                    <StepBarCustom
                                      step={detail_v2?.difficulty_levels?.length}
                                      lastLevel={lastLevel}
                                      active={returnLevel(getLevel) + 1}
                                    />
                                  </div>
                                  <p className="text-body-1-highlight">{detail_v2?.name}</p>
                                  <Link
                                    prefetch
                                    href={{
                                      pathname: `/practice/overview/${getQuestionType}/${returnNextLevel(getLevel)}`
                                    }}
                                  >
                                    <Button className="mr-3 text-white bg-purple py-2 px-4 w-full text-center mt-5 ml-0">
                                      Luyện tập độ khó cao hơn
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              ) : (
                dataNext !== null && (
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-1000"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-1000"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <div className="inline-block align-bottom rounded-lg text-left overflow-hidden transform transition-all w-full">
                      <div className="items-center justify-center m-auto w-fit md:mt-[87px] mt-[129px] h-full rounded-lg">
                        <div className="p-[20px] md:p-[24px] xl:grid-cols-2 bg-white rounded-lg shadow-box max-w-[736px] md:mx-0 mx-[20px]">
                          <div
                            className={`block md:flex items-center ${
                              dataNext?.question_type_uuid ? 'justify-between' : 'justify-center'
                            }`}
                          >
                            <div className="items-center justify-center">
                              <div className="flex items-center mb-[12px]">
                                {isNext ? (
                                  <img width="80px" className="mr-[16px]" src="/icons/party-popper.png"></img>
                                ) : (
                                  <img
                                    width="80px"
                                    className="mr-[16px]"
                                    src="/icons/smiling-face-with-hearts.png"
                                  ></img>
                                )}

                                <div className="flex items-center justify-center">
                                  <div>
                                    <span className="text-headline-1">{isNext ? 'Tuyệt vời' : 'Khá lắm'}</span>
                                    <p className="text-body-2-highlight text-gray">
                                      Đúng {interaction?.data.filter((el) => el.is_answer_correct === true).length}/
                                      {countLimit} câu
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span>Bạn đã hoàn thành mức độ</span>
                                <span
                                  className="ml-[4px]"
                                  dangerouslySetInnerHTML={{ __html: returnLevelTitle[getLevel] }}
                                ></span>
                                {Array.apply(null, { length: returnLevel(getLevel) }).map(function (item, index) {
                                  return (
                                    <img
                                      className="ml-[2px] inline align-text-bottom"
                                      src="/icons/fire.png"
                                      width="24px"
                                    />
                                  );
                                })}
                                {isNext ? (
                                  <p>Cùng Gia sư AI chinh phục dạng bài mới nhé!</p>
                                ) : (
                                  <p>Cùng Gia sư AI luyện tập độ khó cao hơn nhé!</p>
                                )}
                              </div>
                            </div>
                            {isNext ? (
                              dataNext?.question_type_uuid && (
                                <div className="md:w-[50%] w-full md:mt-0 mt-[16px]">
                                  <div className="ml-0 md:ml-[14px] mt-[16px] md:mt-0">
                                    <div className="tag-best-fit">Phù hợp nhất</div>
                                    <div className="card-practice border-yellow-highlight border-[2px] rounded-b-[12px] md:p-5 p-[12px] relative">
                                      <div className="flex justify-between items-center mb-3">
                                        <FlowTag type="diagnose"></FlowTag>
                                      </div>
                                      <p className="text-body-1-highlight text-left">{dataNext?.name}</p>
                                      <Link
                                        prefetch
                                        href={{ pathname: `/diagnose/overview/${dataNext?.question_type_uuid}` }}
                                      >
                                        <Button
                                          type="default"
                                          disabled={dataNext?.question_type_uuid ? false : true}
                                          className="text-white mx-[0px] w-full text-center mt-4 py-2 px-4"
                                        >
                                          Thử sức dạng bài này
                                        </Button>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              )
                            ) : (
                              <div className="md:w-[50%] w-full md:ml-[14px] md:mt-0 mt-[16px]">
                                <div className="tag-best-fit">Phù hợp nhất</div>
                                <div className="card-practice border-yellow-highlight border-[2px] rounded-b-[12px] md:p-5 p-[12px] relative">
                                  <div className="flex justify-between items-center mb-3">
                                    <FlowTag type="practice"></FlowTag>
                                    <StepBarCustom
                                      step={detail_v2?.difficulty_levels?.length}
                                      lastLevel={lastLevel}
                                      active={returnLevel(getLevel) + 1}
                                    />
                                  </div>
                                  <p className="text-body-1-highlight">{detail_v2?.name}</p>
                                  <Link
                                    prefetch
                                    href={{
                                      pathname: `/practice/overview/${getQuestionType}/${returnNextLevel(getLevel)}`
                                    }}
                                  >
                                    <Button className="mr-3 text-white bg-purple py-2 px-4 w-full text-center mt-5 ml-0">
                                      Luyện tập độ khó cao hơn
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Transition.Child>
                )
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Transition.Root>
  );
}
