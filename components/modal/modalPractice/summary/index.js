import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import ButtonPractice from '@/components/common/button/buttonPractice';
import { useRouter } from 'next/router';
const Popup = ({ interaction, limit, open, setOpen }) => {
  const [isPassedSummary, setPassedSummary] = useState(false);
  const [number, setNumber] = useState(0);
  const numberRef = useRef(null);
  const router = useRouter();
  useEffect(() => {
    if (open) {
      if (interaction?.data) {
        interaction?.data.filter((item) => {
          if (item.is_answer_correct) {
            setNumber((number) => number + 1);
          }
        });
      }
    }
  }, [open]);
  useEffect(() => {
    if (number) {
      if (Math.ceil((2 / 3) * limit) <= number) {
        setPassedSummary(true);
      }
    }
  }, [number, open]);
  const returnListing = () => {
    setOpen(false);
    // router.push('/practice/listing');
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
              <div className="items-center justify-center m-auto w-[400px] mt-[10%] rounded-lg bg-white">
                <div className="p-8 xl:grid-cols-2 text-center h-[100%]">
                  <div className="mt-[10px]">
                    <img
                      className="m-auto"
                      width="40px"
                      src={isPassedSummary ? '/icons/party-popper.png' : '/images/cry.png'}
                    ></img>
                    <div className="text-headline-3 mb-6 mt-3">
                      Kết quả :{' '}
                      {isPassedSummary ? (
                        <span className="text-positive">Đạt</span>
                      ) : (
                        <span className="text-negative">Chưa đạt</span>
                      )}
                    </div>
                    <div className="flex mb-[32px]">
                      <div className="number-right w-[160px] h-[100px] bg-positive-light rounded-[12px] flex items-center justify-center mr-[15px]">
                        <div>
                          <p className="text-neutral mb-[8px]">Câu đúng</p>
                          <p className="text-positive text-headline-1">{number}</p>
                        </div>
                      </div>
                      <div className="number-wrong w-[160px] h-[100px] bg-negative-light rounded-[12px] flex items-center justify-center">
                        <div>
                          <p className="text-neutral mb-[8px]">Câu sai/chịu thua</p>
                          <p className="text-headline-1 text-negative">{limit - number}</p>
                        </div>
                      </div>
                    </div>
                    {/* <div className="text-body-2 mb-6 text-gray ">Câu hỏi này sẽ không được tính điểm.</div> */}
                    <div className="flex items-center justify-center">
                      <ButtonPractice
                        onClick={returnListing}
                        className="flex items-center justify-center w-full text-center mr-3 border-solid border-2 bg-purple border-purple text-white py-1 px-4"
                        title="Hoàn tất"
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
  );
};
export default Popup;
