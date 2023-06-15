import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { variants } from '@/service/config';
const mapColor = {
  default: 'border-[1px] border-silver text-gray hover:border-purple-medium focus:border-purple',
  outline: 'border-[1px] border-purple hover:border-purple-medium text-purple hover:text-purple-medium ',
  warning: 'border-[1px] border-critical text-gray hover:border-critical-medium focus:border-critical',
  'outline-yellow': 'border-yellow hover:bg-yellow-medium',
  success: 'border-[1px] border-positive text-gray hover:border-positive-medium focus:border-positive',
  error: 'border-[1px] border-negative text-gray hover:border-negative-medium focus:border-negative',
  disabled: 'border-silver bg-smoke border-[1px] text-gray',
  'outline-disabled': 'border-silver'
};
export const Input = ({
  size,
  type = 'default',
  max,
  min,
  error,
  disabled,
  status,
  number,
  placeHolder,
  Icon,
  className,
  href,
  defaultValue,
  classParent,
  ...rest
}) => {
  const cls = error
    ? mapColor['error']
    : mapColor[!disabled ? type || 'default' : type.includes('outline') ? 'outline-disabled' : 'disabled'];
  return (
    <div className={'relative ' + classParent}>
      <input
        min={min}
        max={max}
        type={number ? 'number' : 'text'}
        disabled={disabled}
        placeholder={placeHolder}
        defaultValue={defaultValue}
        className={`duration-200 w-full min-w-[160px] max-w-[400px] text-caption-1 py-[10px] px-[12px] flex items-center last:mr-0 rounded-[8px] content-center focus:outline-none ${cls} ${className}`}
        {...rest}
      ></input>
      <AnimatePresence>
        {error && (
          <motion.div
            variants={variants}
            initial="hidden"
            animate="enter"
            key={error}
            transition={{ ease: 'easeOut', duration: 0.1 }}
          >
            <div className="flex items-center mt-2">
              <img width="16px" src={`/images/x-circle.png`} />
              <span className={`ml-2 text-negative  text-xs`}>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Input;
