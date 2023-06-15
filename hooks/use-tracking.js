import { useRef } from 'react';
import { Tracker } from '@/libs/tracking';

const initDataTracking = (arg) => {
  const init = {};
  arg.forEach((key) => {
    init[key] = [];
  });
  return init;
};

// nhận vào danh sách các list
export const useTracking = (...arg) => {
  const dataTracking = useRef(initDataTracking(arg));
  const pushTracking = (...params) => {
    arg.forEach((key, index) => {
      if (params[index]) dataTracking.current[key].push(params[index]);
    });
  };
  return { pushTracking, dataTracking: dataTracking.current };
};
