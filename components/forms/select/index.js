import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
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
export const Select = ({
  size,
  options,
  type,
  getData,
  message,
  disabled,
  status,
  placeHolder,
  Icon,
  className,
  id,
  href,
  ...rest
}) => {
  const [focus, setFocus] = useState(false);
  const cls = mapColor[!disabled ? type || 'default' : type.includes('outline') ? 'outline-disabled' : 'disabled'];

  const onFocus = (status) => {
    setTimeout(() => {
      setFocus(status);
    }, 150);
  };
  const setValueInput = (value) => {
    var elem = document.querySelector(`#${id}`);
    elem.value = value;
  };
  return (
    <div className="relative mb-3">
      <input
        disabled={disabled}
        onFocus={() => onFocus(true)}
        onBlur={() => onFocus(false)}
        id={id}
        onChange={(e, value) => getData(e, value)}
        placeholder={placeHolder}
        className={`duration-200 text-caption-1 py-[10px] pr-[40px] px-[12px] flex items-center last:mr-0 rounded-[8px] content-center focus:outline-none ${cls} ${className}`}
        {...rest}
      ></input>
      <img
        className={`absolute right-[12px] top-[12px] ${focus ? 'focus-down-icon' : 'focus-up-icon'}`}
        width="20px"
        src={`/images/chevron-black-down.png`}
        style={{ pointerEvents: 'none' }}
      />
      {focus ? (
        <div
          className={`absolute z-10 bg-white border-[1px] border-purple rounded-[8px] mt-3 w-[220px] overflow-hidden`}
        >
          {options.map((item, index) => (
            <p
              key={index}
              className="hover:bg-purple-light p-3 cursor-pointer"
              onClick={() => {
                getData(item), setValueInput(item.value);
              }}
            >
              {item.value}
            </p>
          ))}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
export default Select;
