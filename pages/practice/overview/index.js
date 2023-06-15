import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import StepBar from '@/components/partial/levelBar';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { unique } from '@/service/helper';
import { useKnowledge } from '@/hooks/use-knowledge';
import Image from 'next/image';
import { variants } from '@/service/config';
import { useAuth } from '@/hooks/use-auth';
const Overview = () => {
  const { diagnose, firstLoading, getStatus } = useKnowledge();
  const { profile } = useAuth();
  const [onTab, setOnTab] = useState(false);

  const { data, error } = useSWR('/units?populate=learning_outcomes.question_types&populate=questions');
  const units = data?.data || [];
  const list_unit = units.sort((a, b) => a.attributes.order - b.attributes.order);
  const getLessonsByUnit = (learningOutcome) => {
    const listLearning = learningOutcome.data;
    let question_types = [];
    listLearning.forEach((element) => {
      const q_t = element.attributes?.question_types?.data || [];
      question_types = [...question_types, ...q_t];
    });
    return unique(question_types);
  };
  const extendTab = (id) => {
    setOnTab(!onTab);
    const ele = document.getElementById(id);
    if (onTab) {
      ele.classList.add('learning-path-extendtab');
      ele.classList.add('learning-path-offtab');
    } else {
      ele.classList.remove('learning-path-extendtab');
      ele.classList.add('learning-path-offtab');
    }
  };

  const fistLoadingData = !data && error;
  if (firstLoading || fistLoadingData) return null;
  return (
    <motion.div
      className="container-account"
      variants={variants}
      transition={{ duration: 4, type: 'spring', stiffness: 100 }}
    >
      <div className="account-body w-full mx-auto p-4 md:container">
        <div className="next-question"></div>
        <div className="item-chapter">
          <div className="chapter my-4 flex items-center cursor-pointer" onClick={() => extendTab('chapter1')}>
            <span className="tag-chapter bg-yellow p-[3px] px-3 text-headline-3">CHƯƠNG 1</span>{' '}
            <span className="font-bold text-headline-2">Hàm số và đồ thị</span>
            <div className="down-icon p-1 bg-white rounded-full ml-3 shadow-box">
              <img
                src="/images/chevron-black-down.png"
                className={`w-[20px] ${onTab ? 'focus-up-icon ' : 'focus-down-icon'}`}
              />
            </div>
          </div>
          <div id="chapter1" className="learning-path-extendtab">
            {list_unit.map((value, index) => {
              const { title, name, order, unit_uuid } = value.attributes;
              const question_type = getLessonsByUnit(value.attributes.learning_outcomes);
              return (
                <div className="wrap-card" key={unit_uuid}>
                  <div className="question-type-card mb-8">
                    <div className="ml-6">
                      <p className="mb-3 font-bold">{title}</p>
                      <div className="flex my-4 flex-wrap">
                        {question_type.map((item, index) => {
                          const {
                            name,
                            question_type_uuid,
                            diagnose: qt_diagnose,
                            practice: qt_practice,
                            ref_name,
                            difficulty_levels
                          } = item.attributes;
                          const diagnose_knowladge = diagnose[question_type_uuid];
                          const status_diagnose = getStatus(diagnose_knowladge, difficulty_levels);
                          const linkDiagnose = `/diagnose/overview/${question_type_uuid}/`;
                          const passHard = status_diagnose.level === 'hard' && status_diagnose.status === 'pass';
                          const linkPractice = `/practice/overview/${question_type_uuid}/` + status_diagnose.level;
                          const url = passHard
                            ? linkDiagnose
                            : status_diagnose.status !== 'pending'
                            ? linkPractice
                            : linkDiagnose;
                          return (
                            <Link href={url} key={'learning' + index}>
                              <div className="card bg-white overflow-hidden w-[261px] flex flex-col  mr-4 cursor-pointer rounded-[8px] shadow-box mb-4">
                                <div className="w-full">
                                  <Image
                                    className="object-cover"
                                    src="/images/thumbnail-bg.png"
                                    width={'100%'}
                                    height="41%"
                                    layout="responsive"
                                  />
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                  <div className="info text-md">{name}</div>
                                  <div className="mt-auto">
                                    <StepBar
                                      question_type={question_type_uuid}
                                      className="mt-3"
                                      data={qt_diagnose}
                                      step={4}
                                    />
                                  </div>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default Overview;
Overview.isHeader = true;
