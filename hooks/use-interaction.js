import useSWR from 'swr';
import { useEffect } from 'react';
import { fetchInteract } from '@/api/base/axios-interaction';
import { findInteract } from '@/service/helper';
import { useRouter } from 'next/router';
import { howToPass } from '../service';

const option = {
  dedupingInterval: 60 * 60 * 1000, // 1hr
  revalidateOnFocus: true
};

export function useInteraction(options) {
  var url_interact = '';
  if (options !== undefined) {
    url_interact = '/session/last?view=' + window.location.pathname + options;
  } else {
    url_interact = '/session/last?view=' + window.location.pathname;
  }
  const { data: interaction, mutate, error } = useSWR(url_interact, fetchInteract, { ...option, ...options });
  const firstLoading = interaction === undefined && error === undefined;
  const router = useRouter();
  useEffect(() => {
    mutate();
  }, [window.location.pathname]);

  // mutation interaction
  const addInteraction = async (newRecord) => {
    interaction.data.push(newRecord);
    await mutate({ ...interaction, time: new Date() }, false);
  };

  // function not mutation
  const pushInteraction = async (newRecord, requiredCheck) => {
    interaction.data.push(newRecord);
    await mutate({ ...interaction }, false);
    if (requiredCheck) return checkPassQT(interaction.data);
    return null;
  };

  const checkPassQT = (data = []) => {
    const listInteraction = [...data];
    const difficulty = router.query?.id[1] || 'default';
    if (difficulty === 'default' || difficulty.indexOf('modal') > -1) return null;

    const {
      sequential,
      non_sequential: [count_pass, total]
    } = howToPass[difficulty] || {};

    const min = sequential;
    const max = total;
    for (let index = 0; index < listInteraction.length; index++) {
      const list_min = listInteraction.slice(index, index + min);
      const list_max = listInteraction.slice(index, index + max);
      const correct_min = list_min.filter((item) => item.is_answer_correct).length;
      if (correct_min >= min) return 'pass';
      const correct_max = list_max.filter((item) => item.is_answer_correct).length;
      if (correct_max >= count_pass) return 'pass';
    }

    return null;
  };

  const findInteraction = (id) => {
    return findInteract(interaction?.data, id);
  };

  const answerQuestion = interaction?.data.filter((element) => element.event_type === 'answer_question') || [];
  if (interaction) interaction.data = answerQuestion;
  const getInteractionByDiffilcut = (diffilcut) => {
    const result = answerQuestion.filter(
      (element) =>
        element.event_type === 'answer_question' &&
        element.flow === 'diagnose' &&
        element.difficulty_level === diffilcut
    );
    return result;
  };
  return {
    interaction: interaction || {},
    error,
    firstLoading,
    addInteraction,
    mutate,
    pushInteraction,
    checkPassQT,
    findInteraction,
    getInteractionByDiffilcut
  };
}
