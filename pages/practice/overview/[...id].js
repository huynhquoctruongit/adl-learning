import React, { useState, useEffect, Fragment, useRef } from 'react';
import Link from 'next/link';
import NavBar from '@/components/partial/navbar';
import { useRouter } from 'next/router';
import ModalTheory from '@/components/modal/modalPractice/theory';
import ModalChooseLevel from '@/components/modal/modalPractice/choose-level';
import useSWR from 'swr';
import FlowTag from '@/components/common/flow-tag';
import StepBar from '@/components/partial/levelBar';
import ProgressBar from '@/components/common/progressBar';
import { useModal } from '@/hooks/use-modal';
import { useKnowledge } from '@/hooks/use-knowledge';
import Button from '@/components/common/button/basic';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import Head from 'next/head';
import useOnClickOutside from '@/hooks/outside';

function Overview() {
  const { profile } = useAuth({
    revalidateOnMount: false
  });
  const router = useRouter();
  const refTimeout = useRef();
  const refTooltip_1 = useRef();
  const refTooltip_2 = useRef();
  const [open, setOpen, toggle] = useModal();
  const id = router.query?.id?.[0];
  const [openTheory, setOpenTheory] = useState(false);
  const [isOpenTooltipUpgrade, setOpenTooltipUpgrade] = useState(false);
  const [chooseLevel, setOpenChooseLevel] = useState(false);
  const [idPractice, setIdPractice] = useState(0);
  const [paramUrl, setParamUrl] = useState('');
  const [src, setSrc] = useState('');
  const [dataTheory, setDataTheory] = useState('');
  const { data: infomation } = useSWR(id ? '/question_type_detail_v2/' + id + '?populate=background' : null);
  const { data: infomation_v1 } = useSWR(
    id ? `/question_type_details?populate=chapter&populate=program&question_type_uuid=${id}&populate=background` : null
  );
  const data_question = infomation?.data?.practice || infomation?.data?.diagnose;
  const { name } = infomation?.data || {};
  const { lesson_of_question_type, all_lesson_of_lo } = infomation_v1 || {};
  const question_type_v1 = infomation_v1?.question_type;
  useOnClickOutside(refTooltip_1, () => {
    setOpenTooltipUpgrade(false);
  });
  useOnClickOutside(refTooltip_2, () => {
    setOpenTooltipUpgrade(false);
  });
  useEffect(() => {
    toggle();
  }, []);
  const timer = 5000;
  useEffect(() => {
    if (isOpenTooltipUpgrade) {
      refTimeout.current = setTimeout(() => {
        setOpenTooltipUpgrade(false);
      }, timer);
    } else {
      clearTimeout(refTimeout.current);
    }
  }, [isOpenTooltipUpgrade]);
  if (!infomation_v1 || !infomation) return null;
  const dataPopup = (id, param) => {
    setIdPractice(id);
    setParamUrl(param);
    if (id === 1) {
      setOpenTheory(true);
      setDataTheory([lesson_of_question_type]);
    } else if (id === 2) {
      setOpenTheory(true);
      setDataTheory(all_lesson_of_lo);
    }
  };
  const openPracticalModal = (id, param) => {
    const content_scope = infomation_v1?.chapter?.content_scope?.name;
    if (content_scope === 'trial') {
      if (profile?.role !== 'free') {
        dataPopup(id, param);
      } else {
        setOpenTooltipUpgrade(id);
      }
    }
    if (content_scope == null || content_scope == undefined || content_scope === 'free') {
      dataPopup(id, param);
    }
    if (content_scope === 'premium') {
      if (profile?.role === 'premium') {
        dataPopup(id, param);
      } else {
        setOpenTooltipUpgrade(id);
      }
    }
  };

  const chooseLevelPopup = () => {
    setOpenChooseLevel(true);
  };

  const listButton = [
    {
      id: 1,
      name: 'Xem phương pháp giải',
      className: 'bg-yellow-highlight text-white text-body-2-highlight',
      src: '/images/icon/ADT-icon-pen.png',
      onClick: () => openPracticalModal(1, '?solution_modal=open')
    },
    {
      id: 2,
      name: 'Xem lý thuyết',
      className: 'bg-highlight-green text-white text-body-2-highlight',
      src: '/images/icon/ADT-icon-book.png',
      onClick: () => openPracticalModal(2, '?theory_modal=open')
    }
  ];

  const ToolTip = ({ refTooltip, item }) => {
    return (
      <motion.div
        ref={refTooltip}
        key={item.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: 'easeOut', duration: 0.3 }}
        className="absolute md:w-[363px] w-full rounded-[8px] bg-purple-medium p-[24px] translate-y-[165px] md:translate-y-[0px] translate-x-[0px] md:translate-x-[320px] z-50"
      >
        <div className="">
          <div className="shape-triangle-left shape-triangle-top-mb"></div>
          <div className="flex w-fit items-center border-[1px] border-white rounded-full p-[2px] px-[10px]">
            <img src="/images/lock.png" width="16px" />
            <p className="text-caption-1-highlight">NỘI DUNG TRẢ PHÍ</p>
          </div>
          <p className="text-headline-3 my-2">{item?.name}</p>
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
              onClick={() =>
                setTimeout(() => {
                  setOpenTooltipUpgrade(false);
                }, 0)
              }
              className="text-center mt-6 min-w-[100px] text-yellow text-body-2-highlight cursor-pointer"
            >
              Để sau
            </p>
          </div>
        </div>
      </motion.div>
    );
  };
  return (
    <Fragment>
      <Head>
        <title>{question_type_v1?.name}</title>
        <meta name="description" content="ICAN - Học Toán cùng Gia sư AI" />
      </Head>
      <div className="overview mx-auto">
        <NavBar
          type="practice"
          infomation_v1={infomation_v1}
          dataQuestionType={id}
          questionsTypeId={id}
          name={name}
          backLink={`/learning-path`}
        />
        <img
          width="100%"
          className="object-cover bg-question-type bg-question-type-mobile absolute"
          src={question_type_v1?.background || '/images/bg-result.png'}
        />
        <div className="overview-content overview-content-mobile bg-white body-content flex items-center justify-center">
          <div className="shadow-box main w-[736px] bg-white p-6 rounded-[12px] z-10 md:mx-0 mx-[20px] mt-[20px] md:mt-0">
            <div className="tab-view justify-between items-center rounded-lg">
              <div className="tab-view-main-content">
                <div className="flex justify-between items-center">
                  <FlowTag type={'practice'}></FlowTag>
                  <StepBar
                    listLevels={infomation?.data?.difficulty_levels}
                    question_type={id}
                    className="md:mt-3 mt-0 flex md:hidden"
                    data={data_question}
                    step={4}
                  />
                </div>
                <div className="mb-6 mt-3">
                  <span className="text-xl font-semibold mb-4">{name}</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex justify-between mb-4">
              <StepBar
                listLevels={infomation?.data?.difficulty_levels}
                question_type={id}
                className="mt-3"
                data={data_question}
                step={4}
              />
              <Button
                onClick={chooseLevelPopup}
                className="bg-purple text-white hover:opacity-70 rounded-lg font-semibold mb-2"
              >
                Bắt đầu luyện tập
              </Button>
            </div>
            <ProgressBar
              listLevels={infomation?.data?.difficulty_levels}
              className="rounded-[2px]"
              question_type={id}
              data={data_question}
              step={4}
            />
            <div className="main-example md:flex block mt-[16px] mb-[24px]">
              {listButton.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => item.onClick()}
                  className={`${item.className} ${
                    index === 0 ? ' md:mr-2 mb-[12px] md:mb-0' : ' md:ml-2'
                  } py-[6px] example-child relative md:w-2/4 w-full first:ml-0 flex justify-center items-center text-glx-critical hover:cursor-pointer rounded-lg`}
                >
                  <div>
                    <img src={item?.src} alt="Adaptive Learning" className="w-[25px] mr-2" />
                  </div>
                  <p className="text-lg">{item?.name}</p>
                  <div className="absolute right-[40px] bg-urple-medium rounded "></div>
                  {isOpenTooltipUpgrade == index + 1 ? (
                    <ToolTip refTooltip={index == 0 ? refTooltip_1 : refTooltip_2} item={item} />
                  ) : (
                    ''
                  )}
                </div>
              ))}
            </div>
            <div className="rounded-lg mt-4">
              <div className="flex mb-3">
                <img src="/images/icon/idea.png" width="24px" />
                <p className="title text-body-2-highlight ml-2">Chế độ Luyện tập là gì?</p>
              </div>
              <p className="des mb-1 text-body-2 flex">• Trả lời các câu hỏi không giới hạn thời gian</p>
              <p className="des mb-1 text-body-2 flex">
                • Luyện tập ở độ khó phù hợp để chinh phục dạng bài & tăng điểm
              </p>
            </div>
          </div>
        </div>
        <div className="block md:hidden fixed bg-white w-full bottom-0 px-[20px] py-[12px]">
          <Button
            onClick={chooseLevelPopup}
            className="ml-0 bg-purple w-full text-white hover:opacity-70 rounded-lg font-semibold"
          >
            Bắt đầu luyện tập
          </Button>
        </div>
        <ModalChooseLevel
          data={data_question}
          open={chooseLevel}
          setOpen={setOpenChooseLevel}
          difficulty_levels={infomation.data?.difficulty_levels}
        />
        <ModalTheory
          isClearParam={true}
          param={paramUrl}
          open={openTheory}
          setOpen={setOpenTheory}
          lesson={dataTheory}
          setData={setDataTheory}
          src={src}
          setSrc={setSrc}
          id={idPractice}
        />
      </div>
    </Fragment>
  );
}

export default Overview;
