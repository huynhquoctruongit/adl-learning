import React, { useRef, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
export * from "./warning"
export default function Recommand({ children, isShow, toggle, title }) {
  const cancelButtonRef = useRef(null);
  return (
    <Transition.Root show={isShow} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={toggle}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 w-7xl">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-000"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <span className=" sm:inline-block sm:align-top sm:h-screen" aria-hidden="true"></span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-top sm:max-w-4xl sm:w-full sm:mt-20 ">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ">
                <div className='relative'>
                  <svg
                    className="cursor-pointer w-10 h-10 px-2 absolute top-[-1rem] left-[97%]"
                    onClick={toggle}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <div className="flex justify-between items-center">
                  {title && (
                    <>
                      <div className="text-xl font-bold">{title}</div>
                      <svg
                        className="cursor-pointer w-12 h-12 px-2 text-right text-gray-600"
                        onClick={() => toggle()}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </>
                  )}
                </div>
                <div className="content py-3">{children}</div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
