import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavBar from '@/components/partial/navbar';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import StepBar from '@/components/partial/levelBar';
import ProgressBar from '@/components/common/progressBar';
import FlowTag from '@/components/common/flow-tag';
import { useKnowledge } from '@/hooks/use-knowledge';
import { useAuth } from '@/hooks/use-auth';
import Head from 'next/head';
import { Tracker } from '@/libs/tracking';
import Button from '@/components/common/button/basic';

function Overview() {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useSWR(id ? '/question_type_detail_v2/' + id + '?populate=background' : null);
  const { data: infomation_v1 } = useSWR(
    id ? `/question_type_details?populate=chapter&populate=program&question_type_uuid=${id}&populate=background` : null
  );
  const question_type = data?.data;
  const question_type_v1 = infomation_v1?.question_type;
  const { diagnose: qt_diagnose } = question_type || {};
  const { diagnose, getStatus } = useKnowledge();
  if (!question_type || !question_type_v1) return null;

  const status = getStatus(diagnose[question_type_v1?.question_type_uuid]);
  return (
    <div className="overview mx-auto">
      <Head>
        <title>{question_type_v1?.name}</title>
        <meta name="description" content="ICAN - Học Toán cùng Gia sư AI" />
      </Head>
      <NavBar
        infomation_v1={infomation_v1}
        type="diagnose"
        dataQuestionType={id}
        questionsTypeId={id}
        data={question_type}
        name={question_type?.name}
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
            <div className="tab-view-main-content mr-3">
              <div className="flex justify-between items-center">
                <FlowTag type={'diagnose'}></FlowTag>
                <StepBar
                  listLevels={question_type?.difficulty_levels}
                  question_type={id}
                  className="md:mt-3 mt-0 flex md:hidden"
                  data={qt_diagnose}
                />
              </div>

              <div className="mb-6 mt-3">
                <span className="text-xl font-semibold mb-4">{question_type?.name}</span>
              </div>
            </div>
          </div>
          <div className="justify-between hidden md:flex">
            <StepBar
              listLevels={question_type?.difficulty_levels}
              question_type={id}
              className="mt-3"
              data={qt_diagnose}
            />
            <Link href={`/diagnose/${id}`}>
              <Button
                onClick={() => Tracker.send({ action: 'clicked', event: 'start', category: 'diagnose' })}
                className="bg-purple text-white hover:opacity-70 rounded-lg font-semibold mb-2 whitespace-nowrap"
              >
                {status.start ? 'Bắt đầu thử sức' : 'Tiếp tục thử sức'}
              </Button>
            </Link>
          </div>
          <ProgressBar
            listLevels={question_type?.difficulty_levels}
            className="rounded-[2px]"
            question_type={id}
            data={qt_diagnose}
            step={4}
          />

          <div className="rounded-lg mt-4">
            <div className="flex mb-3">
              <img src="/images/icon/idea.png" width="24px" />
              <p className="title text-body-2-highlight ml-2">Chế độ Thử sức là gì?</p>
            </div>
            <p className="des mb-1 text-body-2">
              <span className="text-[12px] mr-[4px] inline-block translate-y-[-2px]">●</span> Trả lời các câu hỏi trong thời gian giới hạn
            </p>
            <p className="des mb-1 text-body-2">
              <span className="text-[12px] mr-[4px] inline-block translate-y-[-2px]">●</span> Xác định mức độ thành thạo với dạng bài này
            </p>
            <div className="des text-body-2 items-center">
              <div className="inline-block items-center">
                <span className="text-[12px] mr-[4px] inline-block translate-y-[-2px]">●</span>
                Sau khi hoàn tất, bạn sẽ được
                <FlowTag className="mx-2 inline-flex align-bottom" type={'practice'}></FlowTag>ở độ khó phù hợp nhất
              </div>
            </div>
          </div>
          <div className="left-0 block md:hidden fixed bg-white w-full bottom-0 px-[20px] py-[12px]">
            <Link href={`/diagnose/${id}`}>
              <Button
                onClick={() => Tracker.send({ action: 'clicked', event: 'start', category: 'diagnose' })}
                className="w-full bg-purple text-white hover:opacity-70 rounded-lg font-semibold md:mb-2 mb-0 whitespace-nowrap"
              >
                {status.start ? 'Bắt đầu thử sức' : 'Tiếp tục thử sức'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
