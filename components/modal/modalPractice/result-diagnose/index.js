import React, { useRef, Fragment, useEffect, useState } from 'react';
import Button from '@/components/common/button/basic';
import { useRouter } from 'next/router';
import StepBarCustom from '@/components/partial/levelBarCustom';
import axiosInteraction from '@/api/base/axios-interaction';
import FlowTag from '@/components/common/flow-tag';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useKnowledge } from '@/hooks/use-knowledge';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { variantsHidden } from '@/service/config';
import axiosClient from '@/api/base/axios-cms';
import { Transition } from '@headlessui/react';

export default function ModalResultDiagnose({ dataQuestionType, open, interaction }) {
  const router = useRouter();
  const { id, level } = router.query;
  const { knowledge, getStatus } = useKnowledge(id);
  const [isNext, setNextAction] = useState(null);
  const [dataNext, setDataNext] = useState(null);
  const [showNext, setShowNext] = useState(null);
  const { profile } = useAuth({
    revalidateOnMount: false
  });

  const url_lesson = `/question_type_detail_v2/${id}?populate=background`;
  const { data: dataDetail } = useSWR(id ? url_lesson : null);
  const detail_v2 = dataDetail?.data;
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
        return 1;
        break;
    }
  };

  const returnLevelTitle = {
    easy: '<span> Dễ</span>',
    medium: '<span> Vừa</span>',
    hard: '<span> Khó</span>',
    veryhard: '<span> Siêu khó</span>'
  };
  const { diagnose } = knowledge || {};
  const item = diagnose?.status?.find((element) => element.question_type === id);
  const state = item ? getStatus(item, detail_v2?.difficulty_levels) : null;

  const currentState = state?.knowledge || open.level;
  const nextState = state?.level;

  const mapIndex = ['easy', 'medium', 'hard', 'veryhard'];
  const getLevelHight = mapIndex[detail_v2?.difficulty_levels.length - 1];
  const lastLevel = getLevelHight === state?.knowledge || state?.knowledge === 'hard';

  var isNextUI = null;

  useEffect(() => {
    if (state && open.isShow) {
      if (lastLevel) {
        setNextAction(true);
      } else {
        setNextAction(false);
      }
    }
  }, [open.isShow, state, lastLevel]);
  useEffect(() => {
    if (isNext) {
      axiosInteraction.get(`/knowledge_state/next_qt_force?current_qt=${id}`).then((data) => {
        if (data.question_type) {
          axiosClient.get(`/question_type_details?question_type_uuid=${data.question_type}`).then((detail) => {
            setDataNext(detail.question_type);
            setShowNext(true);
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
        style={{ background: detail_v2?.background ? 'url(' + detail_v2?.background + ')' : '/images/bg-result.png' }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-1000"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-1000"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div className="inline-block align-bottom rounded-lg text-left overflow-hidden transform transition-all w-full h-full">
            <div className="md:flex block items-center justify-center m-auto md:w-[736px] w-full h-full rounded-lg">
              <div className="p-[20px] md:p-[24px] xl:grid-cols-2  bg-white items-center rounded-[12px] mt-[130px] md:mt-[87px] mx-[20px]">
                <div className="md:flex block items-center justify-center">
                  {isNext && dataNext !== null ? (
                    <>
                      {dataNext?.question_type_uuid && (
                        <div className="mr-[12px]">
                          <div className="flex items-center justify-left mb-[12px]">
                            <img
                              width="80px"
                              height="80px"
                              className="mr-[16px]"
                              src="/icons/smiling-face-with-sunglasses.png"
                            ></img>
                            <div className="flex items-center justify-center">
                              <div>
                                <span className="text-headline-1">Bạn là nhất</span>
                                <p className="text-body-2-highlight text-gray">
                                  Đúng {interaction?.data.filter((el) => el.is_answer_correct === true).length}/
                                  {interaction?.data.length} câu
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <span>Bạn đã vượt qua mức độ </span>
                            <span dangerouslySetInnerHTML={{ __html: returnLevelTitle[currentState] }}></span>
                            {Array.apply(null, { length: returnLevel(currentState) }).map(function (item, index) {
                              return (
                                <img className="ml-[2px] inline align-text-bottom" src="/icons/fire.png" width="24px" />
                              );
                            })}
                            <p>Cùng Gia sư AI chinh phục dạng bài mới nhé!</p>
                          </div>
                        </div>
                      )}

                      {showNext && (
                        <div className="md:w-[50%] w-full md:mt-0 mt-[16px]">
                          <div className="tag-best-fit">Phù hợp nhất</div>
                          <div className="w-full card-practice border-yellow-highlight border-[2px] rounded-b-[12px] p-[12px] md:p-5 relative">
                            <div className="flex justify-between items-center mb-3">
                              <FlowTag type="diagnose"></FlowTag>
                            </div>
                            <p className="text-body-1-highlight text-left">{dataNext?.name}</p>
                            <Link
                              prefetch
                              href={{ pathname: `/diagnose/overview/${dataNext?.question_type_uuid}` }}
                              as={`/diagnose/overview/${dataNext?.question_type_uuid}`}
                            >
                              <Button className="mr-3 bg-purple text-white py-2 px-4 w-full text-center mt-4 ml-0">
                                Thử sức dạng bài này
                              </Button>
                            </Link>
                          </div>
                          <Link href={`/practice/overview/${id}/${currentState}`}>
                            <p className="text-center mt-[16px] size-[16px] font-[600] leading-[24px] underline decoration-solid cursor-pointer text-purple">
                              Tiếp tục luyện tập dạng bài này
                            </p>
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    dataNext !== null && (
                      <>
                        {state?.knowledge == '' ? (
                          <div className="md:w-[50%] w-full md:mt-0 mt-[16px]">
                            <div className="flex mb-[12px]">
                              <img width="80px" className="mr-[16px]" src="/icons/crying-face.png"></img>
                              <div className="flex items-center justify-center">
                                <div>
                                  <span className="text-headline-1">Tiếc ghê</span>
                                  <p className="text-body-2-highlight text-gray">
                                    Đúng {interaction?.data.filter((el) => el.is_answer_correct === true).length}/
                                    {interaction?.data.length} câu
                                  </p>
                                </div>
                              </div>
                            </div>
                            <span>Bạn chưa vượt qua mức độ </span>
                            <span dangerouslySetInnerHTML={{ __html: returnLevelTitle[currentState] }}></span>
                            {Array.apply(null, { length: returnLevel(currentState) }).map(function (item, index) {
                              return (
                                <img className="ml-[2px] inline align-text-bottom" src="/icons/fire.png" width="24px" />
                              );
                            })}
                            <p>Cùng Gia sư AI luyện tập thêm nhé!</p>
                          </div>
                        ) : (
                          <div>
                            <div>
                              <div className="flex mb-[12px] items-center">
                                <img width="80px" className="mr-[16px]" src="/icons/partying-face.png"></img>
                                <div className="flex items-center justify-center">
                                  <div>
                                    <span className="text-headline-1">Sắp đạt rồi</span>
                                    <p className="text-body-2-highlight text-gray">
                                      Đúng {interaction?.data.filter((el) => el.is_answer_correct === true).length}/
                                      {interaction?.data.length} câu
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span>Bạn đã vượt qua mức độ </span>
                                <span dangerouslySetInnerHTML={{ __html: returnLevelTitle[currentState] }}></span>
                                {Array.apply(null, { length: returnLevel(currentState) }).map(function (item, index) {
                                  return (
                                    <img
                                      className="ml-[2px] inline align-text-bottom"
                                      src="/icons/fire.png"
                                      width="24px"
                                    />
                                  );
                                })}
                                <p>Cùng Gia sư AI luyện tập độ khó cao hơn nhé!</p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="md:ml-[14px] ml-0 md:w-[50%] w-full md:mt-0 mt-[16px]">
                          <div className="tag-best-fit">Phù hợp nhất</div>
                          <div className="card-practice border-yellow-highlight border-[2px] rounded-b-[12px] md:p-5 p-[12px] relative">
                            <div className="flex justify-between items-center mb-3">
                              <FlowTag type="practice"></FlowTag>
                              <StepBarCustom
                                lastLevel={lastLevel}
                                step={detail_v2?.difficulty_levels?.length}
                                active={returnLevel(nextState)}
                              />
                            </div>
                            <p className="text-body-1-highlight text-left">{detail_v2?.name}</p>
                            <Link
                              prefetch
                              href={{ pathname: `/practice/overview/${id}/${nextState}` }}
                              as={`/practice/overview/${id}/${nextState}`}
                            >
                              <Button className="mr-3 bg-purple text-white py-2 px-4 w-full text-center mt-5 ml-0">
                                {state?.knowledge == '' ? 'Luyện tập ngay' : 'Luyện tập độ khó cao hơn'}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </Transition.Child>
      </motion.div>
    </Transition.Root>
  );
}
