import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import RedirectComp from './redirect';
import FlowTag from '@/components/common/flow-tag';
import useOnClickOutside from '@/hooks/outside';

const NavBar = ({
  type,
  dataQuestionType,
  backLink,
  questionsTypeId,
  limit,
  data = [],
  active,
  chooseQuestion,
  showRedirect = false,
  showReviewResult,
  name,
  level,
  isResult,
  infomation_v1
}) => {
  const router = useRouter();
  const refDetailTab = useRef();
  const [isDetail, setDetails] = useState(false);
  const item = data[active];
  const url_listing = `units?populate=learning_outcomes.question_types&populate=chapter&populate=questions&question_type_uuid=${questionsTypeId}`;
  const infoQuestion = infomation_v1;
  const chapter = infomation_v1?.chapter;
  const onDetails = () => {
    setDetails(!isDetail);
  };
  useEffect(() => {
    router.prefetch(backLink);
  }, []);
  useOnClickOutside(refDetailTab, () => {
    setDetails(false);
  });
  return (
    <div className="md:flex bg-white border-b-[1px] border-[#E8E8E8] md:h-[88px] sticky top-0 z-20  px-0 md:px-8">
      <div className="w-[50%] hidden md:block">
        <div className="header-content py-[16px]">
          <div className="contents-tag flex items-center">
            <img
              className="h-[18px] hover:cursor-pointer"
              src="/images/icon/ADT-icon-back.png"
              alt="Adaptive Learning"
              onClick={() => router.push(backLink)}
            />
            <div className="ml-7 flex-1 min-w-[0px]">
              <div className="flex">
                <div className="w-fit bg-smoke rounded-xl py-[2px] px-[10px] text-sm flex items-center mr-[12px]">
                  {chapter?.name} - {infoQuestion?.unit?.name}
                  <div className="relative flex  items-center group ml-2">
                    <img src="/images/icon/info.png" className="w-[14px]" alt="Adaptive Learning" />
                    <div className="absolute bottom-0 hidden items-center top-1/2 left-1/2 -translate-y-1/2 -mb-2 ml-5 group-hover:flex min-w-[300px] z-50">
                      <div className="w-fit z-10 mt-12 p-4 text-xs leading-none text-white bg-gray shadow-lg rounded-md">
                        <p>
                          {chapter?.name} : {chapter?.title}
                        </p>
                        <p className="mt-2">
                          {infoQuestion?.unit?.name} : {infoQuestion?.unit?.title}
                        </p>
                        {level && <p className="mt-2">Level : {level}</p>}
                      </div>
                    </div>
                  </div>
                </div>
                <FlowTag type={type}></FlowTag>
              </div>
              <p
                title={name || dataQuestionType?.name}
                className="mt-[6px] font-semibold text-lg overflow-hidden whitespace-nowrap text-ellipsis"
              >
                {name || dataQuestionType?.name}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[50%] md:flex items-center justify-end mr-4 hidden">
        <div className="flex">
          {showRedirect && (
            <RedirectComp
              isResult={isResult}
              showReviewResult={showReviewResult}
              limit={limit}
              data={data}
              active={active}
              chooseQuestion={chooseQuestion}
            ></RedirectComp>
          )}
        </div>
      </div>
      <div className="md:hidden w-full sticky h-[64px] w-full">
        {isDetail ? (
          <div ref={refDetailTab} className="bg-white detail-nav-mb">
            <div className="p-[20px] flex justify-center items-center">
              <FlowTag type={type}></FlowTag>
              <div className="ml-auto" onClick={onDetails}>
                <img src="/images/x.png" width="22px" alt="Adaptive Learning" />
              </div>
            </div>
            <div className="text-caption-2-highlight text-gray p-[20px] pt-0">
              <div className="bg-smoke px-[8px] py-[6px] rounded-[8px]">
                <p className="mb-[4px]">
                  <span className="font-bold">{chapter?.name}</span> : {chapter?.title}
                </p>
                <p>
                  <span className="font-bold">{infoQuestion?.unit?.name}</span> : {infoQuestion?.unit?.title}
                </p>
              </div>
              <div className="pt-[12px]">
                <p className="text-body-2-highlight text-black" title={name || dataQuestionType?.name}>
                  {name || dataQuestionType?.name}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center py-[8px] px-[20px] min-h-[64px]">
            <div>
              <div className="w-6">
                <img
                  className="h-4 hover:cursor-pointer"
                  src="/images/icon/ADT-icon-back.png"
                  alt="Adaptive Learning"
                  onClick={() => router.push(backLink)}
                />
              </div>
            </div>
            <div className="text-body-2-highlight mr-2 line-2">
              {infoQuestion?.unit?.name} : {infoQuestion?.unit?.title}
            </div>
            <div className="ml-auto" onClick={onDetails}>
              <div className='w-[22px]'>
                <img src="/images/icon/info.png" width="22px" alt="Adaptive Learning" />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-full md:hidden md:w-[50%] flex items-center justify-end border-t-[1px] md:border-t-[0px] border-silver">
        <div className="flex w-screen overflow-x-scroll no-scroll">
          {showRedirect && (
            <RedirectComp
              isResult={isResult}
              showReviewResult={showReviewResult}
              limit={limit}
              data={data}
              active={active}
              chooseQuestion={chooseQuestion}
              className="w-fit"
            ></RedirectComp>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(NavBar);
