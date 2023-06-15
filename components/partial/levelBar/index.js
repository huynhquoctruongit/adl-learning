import { fetchInteract } from '@/api/base/axios-interaction';
import { useKnowledge } from '@/hooks/use-knowledge';
import { orderDifficult } from '@/service/config';
import React from 'react';
import { isMobile } from 'react-device-detect';
import useSWR from 'swr';

const objectToArray = (obj = {}) => {
  const list = Object.keys(obj).map((key) => {
    const item = obj[key];
    const order = orderDifficult[key];
    if (order !== undefined && item > 0) return { value: item, key: key, order };
  });
  return list.filter((element) => element).sort((a, b) => a.order - b.order);
};

const doneDifficult = (listDifficult, status) => {
  if (!status) return '';
  if (status === 'all') return listDifficult.length;

  const index = listDifficult.findIndex((element) => {
    return element.key === status.knowledge;
  });
  return index;
};
const Step = ({ step, className, data = {}, question_type, listLevels }) => {
  const { getStatus, current_state } = useKnowledge();
  const current_knowledge = current_state[question_type];
  var current_difficult = null;
  current_difficult = listLevels ? getStatus(current_knowledge, listLevels) : getStatus(current_knowledge);

  const listDifficult = objectToArray(data);
  const indexActive = doneDifficult(listDifficult, current_difficult);
  const mapData = listLevels || listDifficult;
  return (
    <ul className={`h-[24px] progressbar flex mr-[2px] ${className}`}>
      {mapData.map((item, index) => {
        if (item)
          return (
            <div className="flex items-center" key={'step' + index}>
              <img className="w-5 md:w-6 " src={index <= indexActive ? '/icons/fire.png' : '/icons/fire-fail.png'} />
            </div>
          );
      })}
    </ul>
  );
};
export default Step;
