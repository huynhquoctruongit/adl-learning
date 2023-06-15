import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import ButtonPractice from '@/components/common/button/basic';
import { useRouter } from 'next/router';
import { useKnowledge } from '@/hooks/use-knowledge';
import { orderDifficult } from '@/service/config';
import { checkTickedOverviewPractice, removeFailStatus } from '@/service/helper';

const Popup = ({ open, setOpen, difficulty_levels = [], data }) => {
  const router = useRouter();
  const { id } = router.query;
  const getLevel = id && id[1];
  const qt_id = id && id[0];

  const { practice, getStatus, diagnose, current_state } = useKnowledge();

  const funcCheckTecked = practice[qt_id]
    ? checkTickedOverviewPractice(diagnose, practice, qt_id)
    : removeFailStatus(diagnose[qt_id]);

  const [levelSelected, setSelectedLevel] = useState(getLevel);
  const returnListing = () => {
    router.push(`/practice/${qt_id}/${levelSelected}`);
    setOpen(false);
  };
  // struggle thì dấu x, pass thì dấu tick. Còn lại hiển thị như bình thường.

  const level = [
    {
      name: 'Dễ',
      id: 'easy',
      widthImg: '27px',
      color: 'text-positive',
      htmlFor: 'radio_0'
    },
    {
      name: 'Vừa',
      id: 'medium',
      img: null,
      color: 'text-critical',
      htmlFor: 'radio_1'
    },
    {
      name: 'Khó',
      id: 'hard',
      color: 'text-negative',
      htmlFor: 'radio_2'
    }
  ];

  const selectRadio = (item) => {
    setSelectedLevel(item.id);
  };

  const practiceKnowledge = practice[qt_id];

  const list = {
    unknown: 'Bắt đầu luyện tập',
    pending: 'Tiếp tục luyện tập',
    pass: 'Xem lại kết quả',
    fail: 'Xem lại kết quả',
    struggle: 'Xem lại kết quả'
  };

  const icons = {
    pass: '/images/check.png',
    fail: '/images/cancel.png',
    struggle: '/images/cancel.png'
  };

  const status = practiceKnowledge ? practiceKnowledge[levelSelected] || 'unknown' : 'unknown';
  const doneDifficult = (listDifficult, status) => {
    if (!status) return '';
    if (status === 'all') return listDifficult.length;

    const index = listDifficult.findIndex((element) => {
      return element.key === status.knowledge;
    });
    return index;
  };
  const objectToArray = (obj = {}) => {
    const list = Object.keys(obj).map((key) => {
      const item = obj[key];
      const order = orderDifficult[key];
      if (order !== undefined && item > 0) return { value: item, key: key, order };
    });
    return list.filter((element) => element).sort((a, b) => a.order - b.order);
  };
  const current_knowledge = current_state[qt_id];
  var current_difficult = null;
  current_difficult = difficulty_levels
    ? getStatus(current_knowledge, difficulty_levels)
    : getStatus(current_knowledge);
  const listDifficult = objectToArray(data);
  const indexActive = doneDifficult(listDifficult, current_difficult);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="absolute flex z-10 inset-0 overflow-y-auto popup-modal-practice justify-center items-center"
        onClose={() => {}}
      >
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
            <div className="px-[20px] md:px-0 inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full">
              <div className="flex items-center justify-center m-auto w-full rounded-lg h-full">
                <div className="bg-white rounded-[12px] md:mt-[87px] mt-[64px]">
                  <img
                    onClick={() => setOpen(false)}
                    src="/images/x.png"
                    width="24px"
                    className="hidden md:block float-right mt-4 mr-4 cursor-pointer"
                  />
                  <div className="p-[24px] md:p-8 xl:grid-cols-2 md:text-center h-[100%] md:min-w-[480px] w-full">
                    <div className="md:mt-[10px]">
                      <div className="text-headline-3 mb-[20px] md:mt-3 flex md:block items-start justify-center">
                        <p>Bạn muốn luyện tập độ khó nào?</p>
                        <div className="w-[50px] flex items-start justify-end">
                          <img
                            onClick={() => setOpen(false)}
                            src="/images/x.png"
                            width="24px"
                            className="block md:hidden flex cursor-pointer mt-[3px]"
                          />
                        </div>
                      </div>
                      <div>
                        {difficulty_levels.map((difficulty, index) => {
                          const item = level[difficulty - 1];
                          const statusItem = practiceKnowledge ? practiceKnowledge[item.id] : 'unknown';

                          const statusMerge = funcCheckTecked ? funcCheckTecked[item.id] : 'unknown';

                          const checkPass = indexActive >= index ? 'pass' : 'unknown';

                          const isShow =
                            indexActive + 1 == index && difficulty_levels.length !== 1 && statusItem !== 'struggle';

                          return (
                            <label
                              key={'difficulty' + difficulty}
                              htmlFor={item.htmlFor}
                              className={`${
                                item.id === levelSelected ? 'bg-selected' : ''
                              } cursor-pointer border-silver border-[1.5px] mb-[20px] h-[64px] rounded-[12px] p-[20px] md:p-6 item-plan flex justify-between items-center`}
                            >
                              <div className="flex justify-center items-center">
                                <label
                                  htmlFor={item.htmlFor}
                                  className={`relative w-[20px] mr-[20px] mb-[10px] flex items-center cursor-pointer rounded-[12px] transition-all ease-in-out duration-300 glx-shadow-box`}
                                >
                                  <div className="flex justify-between w-full">
                                    <div className="flex justify-center">
                                      <label className="container-input">
                                        <input
                                          defaultChecked={item.id === getLevel}
                                          key={item.htmlFor}
                                          type="radio"
                                          name={`radio_checked`}
                                          id={item.htmlFor}
                                          onChange={(e) => selectRadio(item)}
                                        />
                                        <span className={`checkmark`} />
                                      </label>
                                    </div>
                                  </div>
                                </label>
                                <div className="flex items-center justify-start block w-[100px]">
                                  <label
                                    htmlFor="radio_0"
                                    className={`text-body-1-highlight mr-3 text-left min-w-[50px] ${item.color}`}
                                  >
                                    {item.name}
                                  </label>
                                  {icons[statusMerge] && (
                                    <img
                                      width={statusMerge === 'fail' || statusMerge === 'struggle' ? 20 : 27}
                                      alt={statusMerge}
                                      src={
                                        statusMerge === 'struggle' || statusMerge === 'fail'
                                          ? icons['struggle']
                                          : icons[checkPass]
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                              {isShow && (
                                <div className="whitespace-nowrap flex items-center text-caption-1-highlight justify-center text-center bg-yellow-highlight rounded-[4px] text-white py-[2px] px-[8px]">
                                  <p className="whitespace-nowrap">Phù hợp nhất</p>
                                </div>
                              )}
                            </label>
                          );
                        })}
                        <ButtonPractice
                          onClick={returnListing}
                          size="full"
                          className="ml-0 mr-0 body-2-highlight pt-2 pb-2"
                        >
                          {list[status]}
                        </ButtonPractice>
                      </div>
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
