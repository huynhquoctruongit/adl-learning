import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { BookOpenIcon, ChevronDoubleRightIcon, CollectionIcon } from '@heroicons/react/outline';
import { ClipboardCheckIcon } from '@heroicons/react/solid';
import { Disclosure } from '@headlessui/react';
import axiosInteraction from '@/api/base/axios-interaction';
import useSWR from 'swr';
import { unique } from '@/service/helper';
const Slide = ({ active }) => {
  const [isShow, setShow] = useState(false);
  const toggle = () => {
    setShow((isShow) => {
      if (!isShow === true) document.body.style.overflow = 'hidden';
      else document.body.style.overflow = 'auto';
      return !isShow;
    });
  };
  return (
    <div>
      <div
        className="px-4 shadow-md py-5 bg-white lg:hidden flex items-center justify-between relative z-20 rounded-md"
        onClick={toggle}
      >
        <div className="flex items-center font-bold">Chọn chương trình học khác</div>
        <ChevronDoubleRightIcon
          className={`w-5 h-5 transition-transform duration-300 ease-in-out ${isShow ? 'rotate-90' : ''}`}
        />
      </div>
      <div className="hidden lg:block">
        <Menu toggle={toggle} active={active} />
      </div>
      <div
        className={`block lg:hidden transition-transform bg-stone-50 ${
          isShow ? '' : 'translate-x-[-100%]'
        } relative z-10`}
      >
        <Menu toggle={toggle} active={active} />
      </div>
    </div>
  );
};

export default React.memo(Slide);
// data : learning outcome
const getLessonsByUnit = (learningOutcome) => {
  const listLearning = learningOutcome.data;
  let question_types = [];
  listLearning.forEach((element) => {
    const q_t = element.attributes?.question_types?.data || [];
    question_types = [...question_types, ...q_t];
  });
  return unique(question_types);
};


const Menu = React.memo(({ active }) => {
  const router = useRouter();
  const { type } = router.query;
  const { data } = useSWR(
    '/units?populate=learning_outcomes.question_types&populate=questions&program_uuid=6267ae35-afe7-4363-9406-cbf51bf07542'
  );
  const units = data?.data || [];
  const list_unit = units.sort((a, b) => a.attributes.order - b.attributes.order);
  const [dataKnowledgeState, setDataKnowledgeState] = useState({});
  useEffect(() => {
    axiosInteraction
      .get('/user/question-knowledge-state')
      .then((data) => {
        setDataKnowledgeState(data.question_type_uuid);
      })
      .catch((errorMessage) => {
        console.error(errorMessage);
      });
  }, []);

  return (
    <div className="h-[calc(100vh-104px)] min-w-[14rem] lg:min-w-[20rem] w-[20rem] px-2 py-2 absolute lg:relative top-0 bg-stone-50  z-10 overflow-y-scroll">
      {list_unit.map((value, index) => {
        const { title, name } = value.attributes;
        const question_type = getLessonsByUnit(value.attributes.learning_outcomes);
        const isUnit = router.pathname.includes('unit');
        const classname =
          isUnit && active === value.attributes.unit_uuid + ''
            ? 'custom-button font-[600]'
            : 'font-light text-slate-700';
        const defaultOpen = question_type.find((element) => element.attributes.question_type_uuid === type);
        return (
          <div key={index} className={`last:mb-0 text-sm ${question_type.length > 0 ? 'mb-1' : ''}`}>
            <Disclosure defaultOpen={true}>
              <Disclosure className="block w-full">
                <Link href={'/unit/' + value.attributes.unit_uuid} passHref>
                  <a className={`font-[600] text-sm mt-[4px] text-left flex px-2 py-2 ${classname} `}>
                    <CollectionIcon className="w-4 h-4 inline mr-2 " />
                    {name} : {title}
                  </a>
                </Link>
              </Disclosure>

              <Disclosure.Panel>
                <ul className="">
                  {question_type.map((item, index) => {
                    const { name, total_question, question_type_uuid } = item.attributes;

                    const isLesson = router.pathname.includes('question-types');
                    const classname =
                      isLesson && active == item.attributes.question_type_uuid ? 'custom-button' : 'text-slate-600';
                    return (
                      <li key={index} className="mt-1 pl-3">
                        <Link href={'/question-types/' + item.attributes.question_type_uuid} passHref>
                          <a
                            className={`rounded-md px-3 py-2 text-sm font-[500]  transition-all ease-in-out ${classname} inline-flex w-full  items-start`}
                          >
                            {(dataKnowledgeState && dataKnowledgeState[question_type_uuid] == total_question && (
                              <div className="tooltip">
                                <ClipboardCheckIcon className="mr-2 w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span className="tooltiptext">Đã hoàn thành luyện tập dạng bài</span>
                              </div>
                            )) || <BookOpenIcon className="mr-2 w-4 h-4 flex-shrink-0 mt-0.5" />}
                            <span className="font-bold">
                              Dạng bài : <span className="font-medium">{name}</span>
                            </span>
                          </a>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </Disclosure.Panel>
            </Disclosure>
          </div>
        );
      })}
    </div>
  );
});
