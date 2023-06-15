import React, { useState } from 'react';
import { useInteraction } from '@/hooks/use-interaction';
import { useRouter } from 'next/router';

const Redirect = ({ data = [], active, chooseQuestion, className, isResult }) => {
  const router = useRouter();
  const width = router.asPath.includes('diagnose') ? 'w-full' : 'w-fit';

  const classStatus = {
    active: 'bg-white bg-purple border-purple text-white',
    pending: 'bg-white  bg-purple text-white',
    failed: 'bg-white  border-negative text-negative',
    failedActive: 'bg-white  border-negative text-white bg-negative',
    corrected: 'bg-white  border-positive text-positive',
    correctedActive: 'bg-white  border-positive text-white bg-positive',
    default: 'bg-white  border-silver text-gray bg-white'
  };
  const [page, setPage] = useState(0);
  const { interaction, firstLoading } = useInteraction();
  if (firstLoading) return null;
  const questions = [...data].splice(page * data?.length, data?.length);

  return (
    <div className="bg-smoke md:bg-white w-full">
      <div className={'flex justify-end w-full gap-2.5 md:gap-2 py-2 px-5 md:p-0 items-center ' + width}>
        {questions.length > 0 &&
          questions.map((element, index) => {
            const interact = interaction.data[index];
            const status = interact?.is_answer_correct;
            let name = 'default';
            if (status !== undefined) {
              name = status ? 'corrected' : 'failed';
            }
            if (index === active && status !== undefined) {
              name = status ? 'correctedActive' : 'failedActive';
            }
            if (index === active && status === undefined) name = 'active';
            return (
              <div
                key={(element.question_uuid || '') + index}
                onClick={() => chooseQuestion(element, index)}
                className={
                  classStatus[name] +
                  ' border-[1px] w-7 h-7 md:w-5 md:h-5 rounded-full p-3 md:p-4 text-sm md:text-base font-bold md:font-black flex items-center justify-center cursor-pointer'
                }
              >
                {index + 1}
              </div>
            );
          })}
        <div
          onClick={() => chooseQuestion('result', 'result')}
          className={`${
            isResult ? classStatus.pending : ' border-[1px] border-silver text-gray'
          } h-7 md:h-[34px] text-ms font-semibold whitespace-nowrap overflow-hidden text-ellipsis md:font-bold rounded-full p-3 md:p-4 flex items-center justify-center cursor-pointer`}
        >
          Kết quả
        </div>
      </div>
    </div>
  );
};
export default Redirect;
