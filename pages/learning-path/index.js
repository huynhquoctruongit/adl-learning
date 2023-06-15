import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StepBar from '@/components/partial/levelBar';
import ProgressBar from '@/components/common/progressBar';
import useSWR from 'swr';
import Image from 'next/image';
import FlowTag from '@/components/common/flow-tag';
import axiosInteraction from '@/api/base/axios-interaction';
import ModalView from '@/components/common/modal/template';
import ContentPopupPackage from '@/components/modal/popup-package';
import CommingSoonPopup from '@/components/modal/popup-comingsoon';
import { motion } from 'framer-motion';
import { unique, uniqueChapter } from '@/service/helper';
import { variants } from '@/service/config';
import { useKnowledge, useStatusLearning, useAuth, useModal, useLocalStorage } from '@/hooks/index';
import { usePayment } from '@/context/subscription';
import moment from 'moment';
import axiosSubscription from '@/api/base/axios-supscription';
import Router, { useRouter } from 'next/router';
import Button from '@/components/common/button/basic';
import { Tracker } from '@/libs/tracking';
import { BrowserView, MobileView, isMobile } from 'react-device-detect';

const LearningPath = () => {
  const router = useRouter();
  const { firstLoading, diagnose, getStatus } = useKnowledge({ revalidateIfStale: true });
  const { subscription, typeUser, mutateSub } = usePayment();
  const [open, setOpen, toggle] = useModal();
  const [openComing, setOpenComing, toggleComing] = useModal();
  const [nextAction, setNextAction] = useState(null);
  const [typePopup, setTypePopup] = useState(null);
  const { statusLearning, mutate } = useStatusLearning();
  const overviewStatus = statusLearning?.overview;
  const totalStatus = overviewStatus?.pass
    ? Math.ceil((overviewStatus?.pass / overviewStatus?.all_levels) * 100 * 10) / 10
    : 0;
  const { profile, getProfile } = useAuth();
  const duration = profile?.estimated_date ? profile?.estimated_date - Math.floor(new Date().getTime() / 1000) : 0;
  const month = duration > 0 ? Math.floor(duration / 2628000) : 0;
  const day = duration > 0 ? Math.ceil((duration % 2628000) / 86400) : 0;
  const [onTab, setOnTab] = useState({});
  const uuid = profile?.program?.uuid;
  const { data, error } = useSWR(
    '/units?populate=learning_outcomes.question_types&populate=thumbnail&populate=difficulty_levels&populate=questions&program_uuid=' +
    uuid
  );
  const units = data?.data || [];
  const list_unit = units.sort((a, b) => a.attributes.order - b.attributes.order);

  const getLessonsByUnit = (learningOutcome) => {
    const listLearning = learningOutcome.data;
    let question_types = [];
    listLearning.forEach((element) => {
      const q_t = element.attributes?.question_types?.data || [];
      question_types = [...question_types, ...q_t];
    });
    return unique(question_types);
  };
  const { local, setLocal, fisrtLoadStorage } = useLocalStorage();
  useEffect(() => {
    if (statusLearning) {
      mutate();
    }
  }, []);
  useEffect(() => {
    if (fisrtLoadStorage) return;
    const date = moment().format('YYYYMMDD');
    if (local.popup_date === date + typeUser) return;
    if (typeUser === 'new-user' && !window.location.href.includes('localhost')) {
      const codeActive = window.location.href.includes('study') ? 'ADL7DTRIAL-1314863E32' : 'ADL7DTRIALS';
      axiosSubscription
        .post('/active-code', { active_code: codeActive })
        .then(async (data) => {
          setLocal('popup_date', date + typeUser);
          setTypePopup('trial');
          setTimeout(() => {
            getProfile();
            mutateSub();
          }, 3000);
          toggle(true);
          return;
        })
        .catch((data) => {
          console.log(data);
        });
    }
    if (profile.role === 'trial' && typeUser === 'active-user') {
      setTypePopup('upgrade');
      setLocal('popup_date', date + typeUser);
      toggle(true);
      return;
    }
    if (subscription && typeUser === 'expired-user') {
      setTypePopup('expires');
      setLocal('popup_date', date + typeUser);
      toggle(true);
      return;
    }
  }, [fisrtLoadStorage]);

  useEffect(() => {
    if (data) {
      axiosInteraction.get(`/knowledge_state/next_qt_force`).then((qt_id) => {
        list_unit.map((value, index) => {
          const question_type = getLessonsByUnit(value.attributes.learning_outcomes);
          const get_qt = question_type.find((item) => item?.attributes?.question_type_uuid == qt_id.question_type);
          if (get_qt) {
            setNextAction(get_qt?.attributes);
          }
        });
      });
    }
  }, [data]);

  const extendTab = (id) => {
    if (onTab[id] !== undefined) {
      setOnTab({
        ...onTab,
        [id]: !onTab[id],
        tab: id
      });
    } else {
      setOnTab({
        ...onTab,
        [id]: true,
        tab: id
      });
    }
  };
  useEffect(() => {
    const ele = document.getElementById(onTab.tab);
    if (ele) {
      if (!onTab[onTab.tab]) {
        ele.classList.add('learning-path-extendtab');
        ele.classList.add('learning-path-offtab');
      } else {
        ele.classList.remove('learning-path-extendtab');
        ele.classList.add('learning-path-offtab');
      }
    }
  }, [onTab]);
  const fistLoadingData = !data && error;
  if (firstLoading || fistLoadingData) return null;
  var urlNext = null;
  var qt_diagnose_next = null;
  var checkType = null;
  var listLevel = null;
  var thumbnailBg = null;
  var statusQT = null;
  var release_dateQT = null;
  if (nextAction) {
    const {
      status,
      release_date,
      thumbnail,
      difficulty_levels,
      question_type_uuid,
      diagnose: qt_diagnose,
      practice: qt_practice
    } = nextAction;
    const diagnose_knowladge = diagnose[question_type_uuid];
    const status_diagnose = getStatus(diagnose_knowladge, nextAction?.difficulty_levels);
    const linkDiagnose = `/diagnose/overview/${question_type_uuid}/`;
    const passHard = status_diagnose.level === 'hard' && status_diagnose.status === 'pass';
    const linkPractice = `/practice/overview/${question_type_uuid}/` + status_diagnose.level;
    qt_diagnose_next = qt_diagnose || qt_practice;
    listLevel = difficulty_levels;
    thumbnailBg = thumbnail;
    statusQT = status;
    release_dateQT = release_date;
    urlNext = passHard ? linkPractice : status_diagnose.status !== 'pending' ? linkPractice : linkDiagnose;
    checkType = passHard ? 'practice' : status_diagnose.status !== 'pending' ? 'practice' : 'diagnose';
  }
  const funcSort = (a, b) => {
    return a.attributes.order - b.attributes.order;
  };

  const clickQT = (url, question_type_uuid) => {
    Tracker.send({ action: 'clicked', event: 'page', params: { unitID: question_type_uuid } });
    router.push(url);
  };
  console.log(nextAction, 'nextAction');
  return (
    <motion.div
      className="container-account"
      variants={variants}
      animate="enter"
      exit="exit"
      init="hidden"
      transition={{ duration: 4, type: 'spring', stiffness: 100 }}
    >
      <div className="account-body flex w-full mx-auto md:mt-2 md:mt-6 md:container flex-col-reverse md:flex-row">
        <div className="learning-left w-full md:w-[70%] px-5 md:px-3   pt-4 md:pt-3 mb-3 ">
          {nextAction !== null && !nextAction?.question_type_uuid == null && (
            <div className="text-headline-2 mb-5 md:hidden">Lộ trình học tập</div>
          )}
          {nextAction?.question_type_uuid && (
            <div className="next-question-type shadow-box bg-white rounded-[8px] mb-8 md:mb-12 overflow-hidden">
              <div className="flex">
                <div className="w-[40%] min-h-52">
                  <div className="tag-fit absolute bg-negative text-white px-[8px] py-[3px] rounded-tl-lg rounded-br-lg z-10">
                    <p className="text-caption-1-highlight md:text-headline-3">Phù hợp nhất</p>
                  </div>
                  <div className="w-full relative h-[calc(100%-8px)]">
                    {statusQT === 'unreleased' && (
                      <div className="overlay-comming-soon text-center flex items-center justify-center text-white">
                        <div>
                          <p className="text-caption-2-highlight md:text-headline-3">Dự kiến phát hành</p>
                          {release_dateQT && (
                            <p className=" border-[2px] md:border-[4px] text-caption-1-highlight md:text-headline-2 border-white mt-1.5 md:mt-[4px] rounded-[4px] md:rounded-[8px]">
                              {moment(release_dateQT, 'YYYY/MM/DD').format('DD/MM/YYYY')}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {/* //43,5 */}
                    <div className=" w-full relative h-full">
                      <div className="w-full h-full">
                        <Image
                          src={thumbnailBg?.attributes?.url || '/images/thumbnail-bg.png'}
                          width={'100%'}
                          height={isMobile ? '100%' : '58%'}
                          layout="responsive"
                          objectFit="cover"
                        />
                      </div>
                    </div>
                  </div>
                  <ProgressBar
                    listLevels={listLevel}
                    question_type={nextAction?.question_type_uuid}
                    data={qt_diagnose_next || {}}
                    step={4}
                  />
                </div>
                <div className="w-[60%] p-3 md:p-6 min-h-52 flex flex-col">
                  <div className="flex justify-between">
                    <FlowTag type={checkType}></FlowTag>
                    {isMobile && (
                      <StepBar
                        listLevels={listLevel}
                        question_type={nextAction?.question_type_uuid}
                        data={qt_diagnose_next || {}}
                        step={4}
                      />
                    )}
                  </div>

                  <p className="text-caption-1-highlight md:text-headline-3 my-2 md:my-4">{nextAction?.name}</p>
                  <div className="flex justify-between mt-auto items-center">
                    {!isMobile && (
                      <StepBar
                        listLevels={listLevel}
                        question_type={nextAction?.question_type_uuid}
                        data={qt_diagnose_next || {}}
                        step={4}
                      />
                    )}
                    <div
                      className="w-full md:w-auto ml-auto"
                      onClick={statusQT === 'unreleased' ? setOpenComing : () => router.push(urlNext)}
                    >
                      <Button size="full" className="md:w-[220px] text-center ml-0 mr-0">
                        {checkType === 'diagnose' ? 'Bắt đầu thử sức' : 'Bắt đầu luyện tập'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {nextAction !== null && !nextAction?.question_type_uuid == null && (
            <div className="next-question-type shadow-box bg-white rounded-[8px] mb-12 overflow-hidden h-52 w-full"></div>
          )}
          <div className="item-chapter">
            <div className="learning-path-extendtab">
              {uniqueChapter(list_unit)?.map((item, index) => {
                const chapter = item.chapter?.data?.attributes;
                const unit = item.unit;
                return (
                  <div className="wrap-card" key={index}>
                    <div
                      title={chapter?.title}
                      className="chapter my-4 cursor-pointer block md:flex"
                      onClick={() => extendTab(`chapter${index}`)}
                    >
                      <span className="tag-chapter bg-yellow p-[3px] px-3 text-headline-3 h-fit whitespace-nowrap">
                        {chapter?.name}
                      </span>{' '}
                      <div className="flex items-start md:items-center md:ml-4 mt-2 md:mt-0 ">
                        <span className="font-bold  mr-3 md:mr-0 text-headline-3 md:text-headline-2 block">
                          {chapter?.title}
                        </span>
                        <div>
                          <div className="w-7 h-7 md:w-[32px] md:h-[32px] down-icon flex items-center p-1 bg-white rounded-full md:ml-3 shadow-box">
                            <img
                              src="/images/chevron-black-down.png"
                              className={` ${onTab['chapter' + index] ? 'focus-up-icon ' : 'focus-down-icon'}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="chapter-tab pb-4" id={`chapter${index}`}>
                      {unit?.map((data, index) => {
                        const question_type = getLessonsByUnit(data.attributes.learning_outcomes);
                        return (
                          <div className="ml-[-0.5rem] md:ml-0 question-type-card mb-8" key={'ll-' + index}>
                            <div className="flex mt-6 mb-2 md:mt-6 md:mb-6 items-start md:items-center relative left-0">
                              <div>
                                <p className="dots-qt bg-black">{index + 1}</p>
                              </div>
                              <p className="text-headline-4 md:text-headline-3 ml-2.5 md:ml-4">
                                {data.attributes?.title}
                              </p>
                            </div>
                            <div className="ml-5 md:ml-10 md:pl-1">
                              <div className="flex flex-wrap ml-1.5 md:m-[-12px] space-left-between mb-[2px] w-full">
                                {question_type.sort(funcSort).map((item, index) => {
                                  const {
                                    name,
                                    thumbnail,
                                    difficulty_levels,
                                    question_type_uuid,
                                    diagnose: qt_diagnose,
                                    practice: qt_practice,
                                    status,
                                    release_date
                                  } = item.attributes;

                                  const diagnose_knowladge = diagnose[question_type_uuid];
                                  const status_diagnose = getStatus(diagnose_knowladge, difficulty_levels);
                                  const linkDiagnose = `/diagnose/overview/${question_type_uuid}/`;
                                  const passHard =
                                    status_diagnose.level === 'hard' && status_diagnose.status === 'pass';
                                  const linkPractice =
                                    `/practice/overview/${question_type_uuid}/` + status_diagnose.level;
                                  const url = passHard
                                    ? linkPractice
                                    : status_diagnose.status !== 'pending'
                                      ? linkPractice
                                      : linkDiagnose;
                                  return (
                                    <div
                                      key={'learning' + index}
                                      onClick={
                                        status === 'unreleased' ? setOpenComing : () => clickQT(url, question_type_uuid)
                                      }
                                      className="card bg-white overflow-hidden w-[calc(50%-1rem)] w-full md:min-w-[240px] md:w-[calc((100%-72px)/3)] flex flex-col cursor-pointer rounded-[8px] shadow-box m-2 md:m-3"
                                    >
                                      <div className="w-full relative">
                                        {status === 'unreleased' && (
                                          <div className="overlay-comming-soon text-center flex items-center justify-center text-white">
                                            <div>
                                              <p className="text-caption-2-highlight md:text-headline-3">
                                                Dự kiến phát hành
                                              </p>
                                              {release_date && (
                                                <p className="border-[2px] md:border-[4px] text-caption-1-highlight md:text-headline-2 border-white mt-[4px] rounded-[4px] md:rounded-[8px]">
                                                  {moment(release_date, 'YYYY/MM/DD').format('DD/MM/YYYY')}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                        <Image
                                          src={thumbnail?.attributes?.url || '/images/thumbnail-bg.png'}
                                          width={'100%'}
                                          height="52%"
                                          layout="responsive"
                                        />
                                      </div>
                                      <ProgressBar
                                        question_type={question_type_uuid}
                                        data={qt_diagnose}
                                        step={4}
                                        listLevels={difficulty_levels}
                                      />
                                      <div className="p-3 md:p-4 flex-1 flex flex-col">
                                        <div className="info text-md md:text-body-2-highlight text-caption-1-highlight">
                                          {name}
                                        </div>
                                        <div className="mt-auto">
                                          <StepBar
                                            question_type={question_type_uuid}
                                            className="mt-1.5 md:mt-3"
                                            data={qt_diagnose}
                                            listLevels={difficulty_levels}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="learning-right w-full md:w-[30%] md:px-3 py-4 px-5 md:py-3 md:ml-[1.125rem]">
          <div className="flex flex-row md:flex-col status-learning bg-white shadow-box rounded-[12px] p-6">
            <p className="text-headline-4 md:text-headline-3 md:text-center">
              Tiến trình học tập <span className="text-negative">{totalStatus}% </span>
            </p>
            <div className="mt-3 flex justify-center items-center w-full">
              <div className="w-full md:w-[calc(100%-32px)] bg-smoke rounded-full relative">
                <div style={{ width: totalStatus + '%' }} className={`progressbar-bg h-[20px] rounded-l-full mr-2`}>
                  <div className="absolute" style={{ left: `${totalStatus - 5}%`, top: '-5px' }}>
                    <img className="max-w-[unset]" src="/images/you-icon.png" width="32px" />
                  </div>
                </div>
              </div>
              <img src="/images/trophy.png" width="28px" className="ml-[10px] " />
            </div>
          </div>
          <div>
            <div className="flex md:block mt-5 md:mt-8 bg-white shadow-box md:p-6 p-5 rounded-[12px] items-center">
              <h3 className="text-headline-4 md:text-xl font-bold md:text-center mr-1 md:mr-0 pr-2">
                <span className="whitespace-wrap block">Mục tiêu đạt</span>
                <span className="text-highlight-red">{profile.target_score} điểm</span>
              </h3>
              <div className="date-target flex justify-between md:mt-5 ml-auto">
                <div className="date-month flex h-fit items-center md:flex-col px-2.5 py-2 md:p-3 bg-purple-light flex-grow md:mr-2 rounded-xl">
                  <p className="text-headline-2 md:text-6xl text-black font-bold md:font-semibold">{month}</p>
                  <p className="text-caption-1-highlight md:text-xl text-gray ml-1 md:ml-0 font-semibold">tháng</p>
                </div>
                <div className="date-month flex h-fit items-center md:flex-col px-2.5 py-2 p-3 bg-purple-light flex-grow ml-2 rounded-xl">
                  <p className="text-headline-2 md:text-6xl text-black font-bold md:font-semibold">{day}</p>
                  <p className="text-caption-1-highlight md:text-xl text-gray ml-1 md:ml-0 font-semibold">ngày</p>
                </div>
              </div>
              {month == 0 && day == 0 ? (
                <div className="flex items-center justify-center">
                  <p className=" text-headline-3 mt-4 text-purple mr-2">Chúc bạn thi tốt nhé</p>
                  <img width="35px" src="/icons/party-popper.png" />
                </div>
              ) : (
                ''
              )}
            </div>
            {profile?.role !== 'premium' && (
              <Link href="/account?tab=payment">
                <>
                  <BrowserView>
                    <img className="cursor-pointer mt-8 shadow-box rounded-[12px]" src="/images/banner-ads.png" />
                  </BrowserView>
                  <MobileView>
                    <img className="cursor-pointer mt-5 rounded-[12px] shadow-box" src="/images/banner-mobile.jpg" />
                  </MobileView>
                </>
              </Link>
            )}
          </div>
        </div>
      </div>

      <ModalView
        open={open}
        toggle={() => {
          toggle(false);
        }}
      >
        <ContentPopupPackage setOpen={setOpen} toggle={toggle} type={typePopup || 'trial'} />
      </ModalView>
      <ModalView
        open={openComing}
        toggle={() => {
          toggleComing(false);
        }}
      >
        <CommingSoonPopup setOpen={setOpenComing} toggle={toggleComing} type={typePopup || 'trial'} />
      </ModalView>
    </motion.div>
  );
};
export default LearningPath;
LearningPath.isHeader = true;
