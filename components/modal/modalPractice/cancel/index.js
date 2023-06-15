import React, { useRef, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import ButtonPractice from '@/components/common/button/buttonPractice';
export default function ModalExplain({ data, open, setOpen }) {
  
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto popup-modal-practice"  onClose={() => {}}>
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
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full">
              <div className="bg-white ">
                <div className="flex justify-between items-center border-b-2 border-smoke px-9 py-2">
                  <ButtonPractice
                    className="text-critical hover:cursor-auto"
                    source={'/images/icon/ADT-icon-pen.png'}
                    title="Phương pháp giải"
                  />
                  <svg
                    className="cursor-pointer w-12 h-12 px-2 text-right text-gray-600"
                    onClick={() => setOpen(false)}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <div className="grid grid-cols-1 p-8 xl:grid-cols-2">
                  <div>Check 1</div>
                  <div>Check 2</div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
