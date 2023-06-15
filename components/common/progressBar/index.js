import { useKnowledge } from '@/hooks/use-knowledge';
import { orderDifficult } from '@/service/config';
import React from 'react';

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
  const { practice, getStatus, diagnose, current_state } = useKnowledge();
  // current_knowledge trình độ hiện tại trên dạng bài tập này
  const current_knowledge = current_state[question_type];
  var current_difficult = null;
  current_difficult = listLevels ? getStatus(current_knowledge, listLevels) : getStatus(current_knowledge);
  const listDifficult = objectToArray(data);
  const indexActive = doneDifficult(listDifficult, current_difficult);
  var index = indexActive + 1;
  const levels = listLevels?.length || listDifficult.length;
  var total = (index / levels) * 100;
  return (
    <ul className={`progressbar relative flex h-[8px] bg-smoke border-none ${className}`}>
      <div className={`h-full progressbar-bg`} style={{ width: total + '%' }}></div>
    </ul>
  );
};
export default Step;
