import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/common/button/basic';
var paramsPopup = '';
let timmer = null;
const ButtonPractice = ({
  dataPopup,
  key,
  isOpenTooltipUpgrade,
  isClearParam,
  param,
  disabled,
  children,
  className,
  source,
  title,
  indexData,
  isPopupUpgrade,
  ...rest
}) => {
  useEffect(() => {
    return () => {
      if (isClearParam) {
        if (paramsPopup) {
          window.history.pushState({}, null, location.search.replace(paramsPopup, ''));
        } else {
          window.history.pushState({}, null, location.pathname);
        }
      }
    };
  }, [isClearParam, param]);

  const isPass = useRef(true);
  const onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isPass.current === false) return;
    isPass.current = false;
    timmer = setTimeout(() => {
      isPass.current = true;
    }, 200);

    if (rest.onClick) {
      rest.onClick(event);
      paramsPopup = param;
      if (isClearParam) {
        window.history.pushState({}, null, location.search + param);
      }
    }
  };
  useEffect(() => {
    isPass.current = false;
    timmer = setTimeout(() => {
      isPass.current = true;
    }, 300);
    return () => {
      clearTimeout(timmer);
    };
  }, []);
  const disabledClass = disabled ? 'opacity-60' : '';

  return (
    <>
      <button
        disabled={disabled}
        onClick={onClick}
        className={`${disabledClass} text-body-2-highlight flex items-center last:mr-0 rounded-[8px] content-center focus:outline-none ${className}`}
      >
        {source ? <img src={source} alt="Adaptive Learning" className="mr-2 w-8 h-8" /> : null}
        <span>{title}</span>
      </button>
    </>
  );
};
export default ButtonPractice;
