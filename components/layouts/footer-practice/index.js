import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import ButtonPractice from '@/components/common/button/buttonPractice';
import useOnClickOutside from '@/hooks/outside';
import { useRouter } from 'next/router';
import { Tracker } from '@/libs/tracking';
const Footer = ({
  open,
  setOpen,
  isDisable,
  status,
  submit,
  cancelQuestion,
  nextQuestion,
  isLastQuestion,
  paramsTracking
}) => {
  const refTooltip_2 = useRef();
  const setDisale = () => {
    cancelQuestion();
  };
  useOnClickOutside(refTooltip_2, () => {
    setOpen(false);
  });
  const router = useRouter();
  const pathname = router.pathname;

  const sendTracking = () => {
    const category = pathname.includes('practice') ? 'practice' : 'diagnose';
    const { questionID, timeStart, questionType } = paramsTracking?.current || {};
    Tracker.send({
      category,
      action: 'clicked',
      event: 'giveUp',
      params: { questionID, timeStart, questionType, timeEnd: new Date().getTime() }
    });
  };

  const isDisableGiveUp = status !== 'pending' && status !== 'choosing';
  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto popup-modal-practice" onClose={() => {}}>
          <div className="flex w-full text-center">
            <Transition.Child
              as={Fragment}
              enter="blowUpModal .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="opacity-bg fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <span className=" sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="absolute h-full inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full">
                <div className="flex items-center justify-center m-auto h-full rounded-lg">
                  <div
                    ref={refTooltip_2}
                    className="p-[24px] md:p-8 xl:grid-cols-2 w-[400px] text-center md:mx-0 mx-[20px] bg-white rounded-lg"
                  >
                    <div className="mt-[10px]">
                      <img className="m-auto" width="40px" src="/images/sad.png"></img>
                      <div className="text-headline-3 mb-6 mt-3">Bạn muốn chịu thua?</div>
                      <div className="text-body-2 mb-6 text-gray ">Câu hỏi này sẽ không được tính điểm.</div>
                      <div className="flex items-center justify-center">
                        <ButtonPractice
                          onClick={() => setOpen(false)}
                          className="mr-3 border-solid border-2 border-purple text-purple py-2 px-4"
                          title="Suy nghĩ thêm"
                        />
                        <ButtonPractice
                          onClick={() => {
                            sendTracking();
                            setDisale();
                          }}
                          className="mr-3 border-solid border-2 bg-purple border-purple text-white py-2 px-4"
                          title="Chịu thua"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="border-t-[1px] border-silver bg-white fixed bottom-0 left-0 md:static  w-full px-5 py-3 md:px-8 md:py-8 flex md:sticky bottom-0 backdrop-blur-[50px] justify-between">
        <ButtonPractice
          disabled={isDisableGiveUp}
          onClick={() => setOpen(true)}
          className={`mr-3 border-solid border-2  py-[8px] px-[18px] ${
            isDisableGiveUp ? 'text-disable hidden md:block' : 'border-purple text-purple'
          }`}
          title="Chịu thua"
        />
        {status == 'pending' || status == 'choosing' ? (
          <ButtonPractice
            type="button"
            onClick={submit}
            disabled={isDisable}
            className={`bg-purple text-body-2-highlight text-[#fff] py-[8px] px-[18px] ${isDisable ? 'opacity-50' : 'opacity-100'}`}
            title="Kiểm tra đáp án"
          />
        ) : (
          <ButtonPractice
            title={isLastQuestion ? 'Xem kết quả' : 'Bài kế tiếp'}
            onClick={() => {
              queueMicrotask(nextQuestion);
            }}
            type="button"
            className={` bg-purple text-[#fff] py-[8px] px-[18px] ` + (isDisableGiveUp ? ' w-full md:w-auto justify-center ' : '')}
          />
        )}
      </div>
    </>
  );
};
export default Footer;
