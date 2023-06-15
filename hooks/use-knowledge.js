import useSWR from 'swr';
import axiosInteraction, { fetchInteract } from '@/api/base/axios-interaction';
import { timeCache } from '@/service/config';
import { useEffect, useMemo } from 'react';
import { convertArrayToObject } from '@/service/helper';
import { useRouter } from 'next/router';

const mapIndex = ['easy', 'medium', 'hard', 'veryhard'];
const getStatus = (item, difficulty_levels = [1, 2, 3]) => {
  let knowledge = {
    level: '',
    status: '',
    knowledge: ''
  };

  const nextLevel = (level, direct = 'next') => {
    const index = mapIndex.findIndex((item) => item === level);
    const nextIndex = direct === 'next' ? index + 1 : index - 1;
    if (nextIndex > mapIndex.length || !difficulty_levels.includes(nextIndex + 1)) {
      return null;
    }
    return { index: nextIndex, name: mapIndex[nextIndex] };
  };

  if (!item) {
    if (difficulty_levels.includes(2)) {
      knowledge = { level: 'medium', status: 'pending', knowledge: '' };
    } else {
      const index = difficulty_levels.sort()[0];
      const difficulty = mapIndex[index - 1];
      knowledge = { level: difficulty, status: 'pending', knowledge: '' };
    }
    knowledge.start = true;
    return knowledge;
  }
  // case pending
  if (item.medium === 'pending') knowledge = { level: 'medium', status: 'pending', knowledge: '' };
  if (item.easy === 'pending') knowledge = { level: 'easy', status: 'pending', knowledge: '' };
  if (item.hard === 'pending') knowledge = { level: 'hard', status: 'pending', knowledge: '' };
  if (item.medium === 'pending' || item.easy === 'pending' || item.hard === 'pending') return knowledge;

  // item.medium === 'struggle';
  if (item.veryHard === 'struggle') knowledge = { level: 'veryHard', status: 'struggle', knowledge: 'hard' };
  if (item.hard === 'struggle') knowledge = { level: 'hard', status: 'struggle', knowledge: 'medium' };
  if (item.medium === 'struggle') knowledge = { level: 'medium', status: 'struggle', knowledge: 'easy' };
  if (item.easy === 'struggle') knowledge = { level: 'easy', status: 'struggle', knowledge: '' };

  const isTruggle = mapIndex.find((key) => item[key] === 'struggle');
  if (isTruggle) return knowledge;

  let passlevel = '';
  let failLevel = '';

  // Nếu lấy thằng fail nhỏ nhất
  // get fail hight priority level
  if (item.veryHard === 'fail') failLevel = 'veryHard';
  if (item.hard === 'fail') failLevel = 'hard';
  if (item.medium === 'fail') failLevel = 'medium';
  if (item.easy === 'fail') failLevel = 'easy';

  // get pass hight priority level
  if (item.easy === 'pass') passlevel = 'easy';
  if (item.medium === 'pass') passlevel = 'medium';
  if (item.hard === 'pass') passlevel = 'hard';
  if (item.veryHard === 'pass') passlevel = 'veryHard';

  // case only pass
  if (!failLevel && passlevel) {
    const next = nextLevel(passlevel, 'next');
    if (next) {
      knowledge = { level: next.name, status: 'pending', knowledge: passlevel };
    } else {
      knowledge = { level: passlevel, status: 'pass', knowledge: passlevel };
    }
    return knowledge;
  }
  // only fail
  if (failLevel && !passlevel) {
    const prev = nextLevel(failLevel, 'prev');
    if (prev) {
      knowledge = { level: prev.name, status: 'pending', knowledge: '' };
    } else {
      knowledge = { level: failLevel, status: 'fail', knowledge: '' };
    }
    return knowledge;
  }

  if (failLevel && passlevel) {
    const indexFail = mapIndex.findIndex((element) => failLevel === element);
    const indexPass = mapIndex.findIndex((element) => passlevel === element);
    if (indexFail > indexPass) knowledge = { level: failLevel, status: 'fail', knowledge: passlevel };
    return knowledge;
  }
};

export function useKnowledge(options) {
  const { data, error, mutate } = useSWR('/knowledge_state/current_knowledge_state', fetchInteract, {
    dedupingInterval: timeCache,
    revalidateOnFocus: false,
    ...options
  });

  const firstLoading = data === undefined && error === undefined;
  const diagnose = useMemo(() => {
    if (!data || !data.diagnose) return {};
    return convertArrayToObject(data.diagnose.status, 'question_type');
  }, [data]);

  const current_state = useMemo(() => {
    if (!data || !data.current_state) return {};
    return convertArrayToObject(data.current_state, 'question_type');
  }, [data]);

  const practice = useMemo(() => {
    if (!data || !data.practice) return {};
    return convertArrayToObject(data.practice.status, 'question_type');
  }, [data]);

  const updateKnowledge = async () => {
    const data = await axiosInteraction.get('/knowledge_state/current_knowledge_state');
    mutate(data, false);
    return data;
  };

  const get_current_status = (uuid) => {
    const item = current_state[uuid] || null;
    return getStatus(item);
  };

  return {
    knowledge: data,
    diagnose: diagnose,
    practice: practice,
    current_state,
    firstLoading,
    getStatus,
    updateKnowledge,
    get_current_status,
    mutate
  };
}
