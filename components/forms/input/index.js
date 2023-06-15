import useOnClickOutside from '@/hooks/outside';
import { variants } from '@/service/config';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
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
const getTextColor = {
  success: 'text-positive',
  warning: 'text-critical',
  error: 'text-negative'
};
const getImageType = {
  success: 'check-circle.png',
  warning: 'alert-triangle.png',
  error: 'x-circle.png'
};
export const Input = ({
  size,
  type = 'default',
  classParent,
  message,
  disabled,
  status,
  placeHolder,
  Icon,
  className,
  href,
  number,
  onChange,
  refInput,
  validate = () => {},
  ...rest
}) => {
  const ref = useRef();
  useOnClickOutside(ref, () => {
    const error = validate(rest.name);
    if (rest.name === 'phone_number' && !error) {
      ref.current.value = ref.current.value.replaceAll(/ /g, '');
    }
    if (rest.name === 'last_gpa' && !error) {
      const value = ref.current.value.replaceAll('.', '.');
      ref.current.value = '';
      ref.current.value = value;
    }
  });
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    if (name === 'last_gpa') {
      if (value > 10) ref.current.value = 10;
      if (value < 0) ref.current.value = 0;
    }
    onChange(e);
  };
  const cls = mapColor[!disabled ? type || 'default' : type.includes('outline') ? 'outline-disabled' : 'disabled'];

  if (refInput) refInput.current = ref.current;
  return (
    <div className={classParent}>
      <input
        ref={ref}
        type={number ? 'number' : 'text'}
        disabled={disabled}
        placeholder={placeHolder}
        onChange={onChangeInput}
        className={`duration-200 w-full max-w-[400px] text-caption-1 py-[10px] px-[12px] flex items-center last:mr-0 rounded-[8px] content-center focus:outline-none ${cls} ${className}`}
        {...rest}
      ></input>
      <AnimatePresence>
        {(type === 'success' || type === 'error' || type === 'warning') && (
          <motion.div
            variants={variants}
            initial="hidden"
            animate={{ opacity: 1, height: 16 }}
            exit="hidden"
            key={message}
            transition={{ ease: 'easeOut', duration: 0.1 }}
            className="relative h-4"
          >
            <div className="flex items-center mt-2 absolute top-0 lef-0 w-full">
              <img width="12px" src={`/images/${getImageType[type]}`} />
              <span className={`ml-1 font-medium text-xs whitespace-nowrap ${getTextColor[type]}`}>{message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Input;
