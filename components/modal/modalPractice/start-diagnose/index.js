import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import ButtonPractice from '@/components/common/button/buttonPractice';
import { useRouter } from 'next/router';
const Popup = ({ question_id, open, setOpen }) => {
  const router = useRouter();
  const returnListing = () => {
    setOpen(false);
    router.push(`/diagnose/practice/${question_id}`);
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto popup-modal-practice z-10" onClose={() => {}}>
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
            <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full">
              <div className="items-center justify-center m-auto w-[600px] mt-[10%] rounded-lg bg-white">
                <div className="p-8 xl:grid-cols-2 text-center h-[100%]">
                  <div className="mt-[10px]">
                    <div className="text-headline-3 mb-6 mt-3">
                      <p>Ayo! Phần thử sức chính thức bắt đầu!</p>
                      <p>Bạn đã sẵn sàng chưa? 🔥</p>
                    </div>
                    <div className="flex mb-[32px]"></div>
                    <div className="flex items-center justify-center">
                      <ButtonPractice
                        onClick={returnListing}
                        className="flex items-center justify-center w-full text-center mr-3 border-solid border-2 bg-purple border-purple text-white py-1 px-4"
                        title="Chiến luôn"
                      />
                    </div>
                    <p className="mt-3">Thời gian mỗi câu : 2 phút</p>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default Popup;
