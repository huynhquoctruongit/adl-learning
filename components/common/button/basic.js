import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
const mapColor = {
  default: 'bg-purple hover:bg-purple-medium text-white border-[1.5px] border-purple hover:border-purple-medium',
  outline: 'border-[1.5px] border-purple hover:border-purple-medium text-purple hover:text-purple-medium ',
  yellow: 'bg-yellow hover:bg-yellow-medium border-[1.5px] border-yellow hover:border-yellow-medium',
  'outline-yellow': 'border-yellow hover:bg-yellow-medium',
  disabled: 'bg-shark text-white',
  'outline-disabled': 'border-silver'
};
const sizeMap = {
  size: 'w-[7.5rem]',
  defautl: 'md:min-w-[160px]',
  full: 'w-full'
};
let timmer = null;
const Button = ({ size, type, typehtml, children, disabled, Icon, className, href, onClick, ...rest }) => {
  const isPass = useRef(true);
  const route = useRouter();
  const handleClick = (e) => {
    if (isPass.current === false) return;
    isPass.current = false;
    timmer = setTimeout(() => {
      isPass.current = true;
    }, 300);
    if (href) route.push(href);
    else if (onClick) onClick(e);
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
  const cls = mapColor[!disabled ? type || 'default' : type.includes('outline') ? 'outline-disabled' : 'disabled'];
  const clsSize = sizeMap[size || 'default'];
  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={`duration-200 font-semibold min-h-[32px] md:min-h-[40px] text-center flex justify-center items-center mx-2 last:mr-0 rounded-lg content-center text-caption-1-highlight md:text-body-2-hightlight whitespace-nowrap focus:outline-none ${cls} ${clsSize} ${className} py-[8px] px-[18px]`}
      {...rest}
      typehtml={typehtml}
    >
      <span>{children}</span>
    </button>
  );
};
export default Button;
