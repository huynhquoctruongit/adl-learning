import useSWR from 'swr';
import axiosInteraction, { fetchInteract } from '@/api/base/axios-interaction';
import { timeCache } from '@/service/config';
import { useMemo, useRef } from 'react';

export function useStatusLearning(options) {
  const { data, error, mutate } = useSWR('/learning_path/status', fetchInteract, {
    dedupingInterval: timeCache,
    revalidateOnFocus: false
  });
  const firstLoading = data === undefined && error === undefined;
  const updateStatusProgress = async () => {
    const data = await axiosInteraction.get('/learning_path/status');
    mutate(data, false);
    return data;
  };
  return {
    mutate,
    statusLearning: data,
    firstLoading,
    useStatusLearning,
    updateStatusProgress
  };
}
