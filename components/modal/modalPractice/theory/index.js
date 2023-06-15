import React, { useState, useRef, useEffect } from 'react';
import ButtonPractice from '@/components/common/button/buttonPractice';
import { convertTime } from '@/service/helper';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
import ContentBlock from '@/components/common/mathtype';
import { variantsScale } from '@/service/config';
import { Tracker } from '@/libs/tracking';
import { useRouter } from 'next/router';
import Slider from 'react-slick';
import useOnClickOutside from '@/hooks/outside';
import { isTablet, isMobile } from 'react-device-detect';

function ModalTheory({ param, open, setOpen, setSrc, id, lesson, setData }) {
  const [tab, setTab] = useState(0);
  const refTimeTab = useRef();
  const [expendTimeTab, setExpendTimeTab] = useState(true);
  const [firstTime, setFirstTime] = useState(null);
  const paramsTracking = useRef({ timeStart: null, timeEnd: null, listLession: [] });

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    const disable = lessonContent.length - 1 <= tab;
    return (
      <div
        onClick={() => {
          onClick && onClick(), lessonContent.length - 1 > tab && chooseTab(tab + 1);
        }}
        className={`${disable ? 'disable-slick-wrap' : ''} button-slick`}
      >
        <img
          className={`bg-purple ${disable ? ' disable-slick cursor-not-allowed ' : ''}` + className}
          style={{ ...style, display: 'block' }}
          src="/images/chevron-right.png"
        />
      </div>
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    const disable = tab <= 0;
    return (
      <div
        onClick={() => {
          onClick && onClick(), tab > 0 && chooseTab(tab - 1);
        }}
        className={`${disable ? 'disable-slick-wrap' : ''} button-slick`}
      >
        <img
          className={`available-slick ${disable && ' bg-purple disable-slick cursor-not-allowed '}` + className}
          style={{ ...style, display: 'block' }}
          src="/images/chevron-left.png"
        />
      </div>
    );
  }

  var settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const lessonContent = lesson;
  const [activeTime, setActiveTime] = useState({
    index: 0,
    item: {
      content: '',
      id: 0,
      time: '00:00'
    }
  });
  const name = id === 1 ? 'solution' : 'theory';

  const playerRef = useRef(null);
  const lesson_uuid = lessonContent[tab]?.lesson_uuid;
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  const checkUI = (src, data) => {
    if (src && data) {
      return '2UI';
    } else if (src && !data) {
      return 'hideData';
    } else if (!src && data) {
      return 'hideSrc';
    } else {
      return '0UI';
    }
  };
  useEffect(() => {
    window.history.pushState({}, null, param);
    return () => {
      window.history.pushState({}, null, location.pathname);
    };
  }, [param]);
  const chooseTab = (index) => {
    setTab(index);
  };
  useEffect(() => {
    const now = new Date().getTime();
    if (open) {
      paramsTracking.current = {};
      paramsTracking.current.timeStart = now;

      if (name === 'solution') paramsTracking.current.solutionID = lesson_uuid;
      if (name === 'theory') paramsTracking.current.theoryID = lesson_uuid;
    }
    if (!open) {
      if (paramsTracking.current.timeStart) {
        paramsTracking.current.time = now;
        Tracker.send({ category: 'practice', action: 'closed', event: name, params: paramsTracking.current });
      }
      setTab(0);
    }
  }, [open]);

  const funcSort = (a, b) => {
    return a.order - b.order;
  };
  const onExpendTimeTab = () => {
    if (isMobile) {
      setExpendTimeTab(!expendTimeTab);
    }
  };
  useOnClickOutside(refTimeTab, () => {
    if (isMobile) {
      onExpendTimeTab();
    }
  });
  useEffect(() => {
    if (lessonContent) {
      const item = lessonContent[tab];
      const timeList = item?.custom_view && item.custom_view[0] ? item.custom_view[0]?.makers : [];
      setActiveTime({
        index: 0,
        item: timeList[0]
      });
    }
  }, [lessonContent, tab]);
  useEffect(() => {
    if (isMobile) {
      setExpendTimeTab(false);
    }
  }, [isMobile]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={variantsScale}
          animate={'visible'}
          exit="exit"
          transition={{ duration: 0.15, type: 'spring', bounce: 0.25 }}
          className="fixed z-50 inset-0 overflow-y-auto flex w-full md:h-[calc(100vh-87px)] mt-0 md:mt-[87px] text-center"
        >
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full">
            <div className="bg-white">
              <div className="h-[64px] flex justify-between items-center border-b-2 border-t-2 border-smoke md:px-9 md:p-0 p-[20px]">
                <ButtonPractice
                  isClearParam={true}
                  className={
                    id === 1
                      ? 'text-critical text-body-2-highlight'
                      : id === 2
                      ? 'text-positive text-body-2-highlight'
                      : id === 3
                      ? 'text-information text-body-2-highlight'
                      : '' + 'hover:cursor-pointer outline-none border-none'
                  }
                  source={
                    id === 1
                      ? '/images/icon/ADT-icon-pen.png'
                      : id === 2
                      ? '/images/icon/ADT-icon-book.png'
                      : id === 3
                      ? '/images/icon/ADT-icon-play.png'
                      : ''
                  }
                  title={id === 1 ? 'Phương pháp giải' : id === 2 ? 'Lý thuyết' : id === 3 ? 'Ứng dụng thực tế' : ''}
                />
                <div className="flex w-[80%] md:block hidden">
                  <Slider style={{ width: '100%', display: 'flex' }} {...settings}>
                    {lessonContent.map((item, index) => (
                      <div key={index} className="h-[68px]" onClick={() => chooseTab(index)}>
                        <div
                          key={index}
                          className={`flex justify-center items-center text-body-2-highlight h-full relative text-center
                          ${
                            index === tab
                              ? `${id === 2 ? 'text-positive active-tab-theory' : 'text-critical active-tab-solution'}`
                              : 'text-gray'
                          }`}
                        >
                          <span>{item.name}</span>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>

                <svg
                  className="cursor-pointer w-10 h-10 px-2 text-right text-gray-600"
                  onClick={() => {
                    setOpen(false),
                      setSrc(''),
                      setData(''),
                      setActiveTime({
                        ...activeTime,
                        id: 0
                      });
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>

            {lessonContent.sort(funcSort).map((item, index) => {
              const data = item?.content;
              const srcLow = item?.custom_view ? item?.custom_view[0]?.video_url_low : '';
              const srcHigh = item?.custom_view ? item?.custom_view[0]?.video_url_high : '';
              const src = srcHigh;
              const rsl = checkUI(src, data);
              const timeList = item?.custom_view && item.custom_view[0] ? item.custom_view[0]?.makers : [];
              if (index === tab) {
                return (
                  <motion.div
                    animate={'visible'}
                    exit="exit"
                    transition={{ duration: 0.15, type: 'spring', bounce: 0.25 }}
                  >
                    <div
                      className={
                        rsl === '2UI'
                          ? 'block md:grid grid-cols-1 xl:grid-cols-2 md:p-8 p-[20px] overflow-auto popup-practice-left popup-practice-left-mb'
                          : rsl === 'hideData' || rsl === 'hideSrc'
                          ? 'flex justify-center md:p-8 px-[20px] overflow-auto popup-practice-left popup-practice-left-mb'
                          : ''
                      }
                    >
                      <div
                        className={
                          'relative md:overflow-x-scroll ' +
                          (rsl === '2UI'
                            ? 'md:mr-8 md:h-full'
                            : rsl === 'hideData'
                            ? 'w-full'
                            : rsl === 'hideSrc'
                            ? 'hidden'
                            : '')
                        }
                      >
                        <div
                          className={`h-full w-full max-h-full md:overflow-y-scroll hidden-scrollbar t-0 l-0 flex justify-center ${
                            rsl === '2UI' ? '' : 'w-full'
                          }`}
                        >
                          <div className={rsl === 'hideData' ? 'w-1/2' : 'w-full'}>
                            <WrapVideo
                              lesson_uuid={lesson_uuid}
                              src={src}
                              name={name}
                              activeId={activeTime?.item?.id}
                              playerRef={playerRef}
                            />
                            <span className="hidden md:block mt-[24px] mb-4 text-headline-3 inline-block text-black">
                              Danh sách các phần
                            </span>
                            <div className="mt-[16px] md:mt-0 border-[1px] md:border-0 border-silver rounded-[12px] p-[10px] md:p-0">
                              {expendTimeTab ? (
                                <div ref={refTimeTab}>
                                  {timeList?.map((item, index) => {
                                    if (!item.time) return null;
                                    return (
                                      <div
                                        key={index}
                                        className={`${
                                          index !== 0 && 'mt-4 '
                                        } whitespace-nowrap overflow-hidden text-ellipsis rounded-lg transition-all hover:cursor-pointer hover:opacity-80`}
                                        onClick={() => {
                                          setActiveTime({
                                            item,
                                            index: index
                                          }),
                                            onExpendTimeTab(),
                                            playerRef.current?.seekTo(convertTime(item.time), 'seconds');
                                        }}
                                      >
                                        <span
                                          className={
                                            activeTime?.index === index
                                              ? 'w-[70px] text-center inline-block text-purple border-purple bg-purple-light border-[1px] text-caption-1-highlight rounded-full mr-3 px-3 py-[2px]'
                                              : 'w-[70px] text-center inline-block text-[#000] border-silver border-[1px] text-caption-1-highlight rounded-full text-sm mr-3 px-3 py-[2px]'
                                          }
                                        >
                                          {item.time}
                                        </span>
                                        <span
                                          className={
                                            activeTime?.index === index
                                              ? 'text-[#000] text-body-1-highlight text-caption-1-highlight'
                                              : 'text-gray text-body-1 text-caption-1'
                                          }
                                        >
                                          {item.content}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div
                                  onClick={onExpendTimeTab}
                                  className={`flex justify-between items-center rounded-lg transition-all hover:cursor-pointer hover:opacity-80`}
                                >
                                  <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                                    <span
                                      className={`w-[70px] text-center inline-block text-purple border-purple bg-purple-light border-[1px] text-caption-1-highlight rounded-full mr-3 px-3 py-[2px]`}
                                    >
                                      {activeTime?.item?.time}
                                    </span>
                                    <span className={`text-black text-body-1-highlight text-caption-1-highlight`}>
                                      {activeTime?.item?.content}
                                    </span>
                                  </div>
                                  <img width="20px" src="/images/chevron-black-down.png" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          'relative md:overflow-x-scroll md:h-full' +
                          (rsl === '2UI' ? '' : rsl === 'hideSrc' ? 'w-full' : rsl === 'hideData' ? 'hidden' : '')
                        }
                      >
                        <div
                          className={`h-full max-h-full md:overflow-y-scroll hidden-scrollbar md:flex justify-center ${
                            rsl === '2UI' ? '' : 'w-full'
                          }`}
                        >
                          <div id="latex-popup" className={rsl === 'hideSrc' ? 'md:w-1/2 w-full' : '' + ''}>
                            <ContentBlock className="content-session md:p-4 mt-[20px] md:mt-0" content={data} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              }
            })}
            <div className="z-[500000] flex justify-center items-center h-[64px] bg-white absolute bottom-0 w-[100%] m-auto p-[20px] border-t-2 border-smoke slick-mb md:hidden block">
              <Slider style={{ width: '100%', display: 'flex' }} {...settings}>
                {lessonContent.map((item, index) => (
                  <div
                    className="h-[40px] flex justify-center items-center item-slick-mb"
                    key={index}
                    onClick={() => chooseTab(index)}
                  >
                    <div
                      key={index}
                      className={`h-fit mx-[30px] text-body-2-highlight h-full relative text-center text-black overflow-hidden whitespace-nowrap text-ellipsis`}
                    >
                      <span>{item.name}</span>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

let time = 0;
let timeStart = 0;
const WrapVideo = ({ playerRef, src, activeId, name, lesson_uuid }) => {
  const handleOnPlay = () => {
    const now = new Date().getTime();
    if (timeStart === 0) timeStart = now;
    const params = { timeStart, videoDuration: 0 };
    if (name === 'solution') params.solutionID = lesson_uuid;
    if (name === 'theory') params.theoryID = lesson_uuid;
    Tracker.send({ category: name, event: 'video', action: 'played', params: params });
  };

  const onPause = () => {};

  useEffect(() => {
    time = 0;
    timeStart = 0;
  }, []);
  return (
    <ReactPlayer
      width={'100%'}
      height="auto"
      url={src}
      playing={activeId !== -1 ? true : false}
      controls
      ref={playerRef}
      onPause={onPause}
      onPlay={handleOnPlay}
      config={{ file: { attributes: { controlsList: 'nodownload' } } }}
      onContextMenu={(e) => e.preventDefault()}
      onProgress={(data) => {
        const seconds = Math.floor(data.playedSeconds);
        if (seconds >= time + 5) {
          const params = { timeStart, videoDuration: seconds };
          if (name === 'solution') params.solutionID = lesson_uuid;
          if (name === 'theory') params.theoryID = lesson_uuid;
          time = seconds;
          Tracker.send({ category: name, action: 'played', event: 'video', params: params });
        }
      }}
    />
  );
};

export default React.memo(ModalTheory);
