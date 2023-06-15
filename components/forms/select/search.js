import { removeAccents } from '@/service/helper';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SearchIcon } from '@heroicons/react/outline';
import useOnClickOutside from '@/hooks/outside';

const mapColor = {
  default: 'border-[1px] border-silver text-gray hover:border-purple-medium focus:border-purple',
  outline: 'border-[1px] border-purple hover:border-purple-medium text-purple hover:text-purple-medium ',
  warning: 'border-[1px] border-critical text-gray hover:border-critical-medium focus:border-critical',
  'outline-yellow': 'border-yellow hover:bg-yellow-medium',
  success: 'border-[1px] border-positive text-gray hover:border-positive-medium focus:border-positive',
  error: 'border-[1px] border-negative text-gray hover:border-negative-medium focus:border-negative',
  disabled: 'border-silver bg-smoke border-[1px] text-gray',
  'outline-disabled': 'border-silver border-[1px]'
};
const sizeClass = {
  small: 'min-w-[50px]',
  medium: ' ',
  full: 'w-full'
};

let time = null;
export const SelectSearch = ({
  value,
  size,
  options,
  message,
  disabled,
  placeHolder,
  name,
  onChange,
  isAdd,
  className,
  defaultValue,
  style = {},
  validate = () => {},
  ...rest
}) => {
  const [focus, setFocus] = useState(false);
  const [input, setIput] = useState('');
  const refInput = useRef();
  const ref = useRef();
  useOnClickOutside(ref, () => {
    validate(name);
    setFocus(false);
  });
  const cls = mapColor[message ? 'error' : !disabled ? 'default' : 'outline-disabled'];
  const onFocus = (status) => {
    setTimeout(() => {}, 150);
  };

  const onChangeInput = (event) => {
    clearTimeout(time);
    time = setTimeout(() => {
      setIput(event.target.value);
    }, 500);
  };

  const findNameById = (id) => {
    return options.find((element) => element.id == id);
  };

  useEffect(() => {
    return () => {
      clearTimeout(time);
    };
  }, []);
  useEffect(() => {
    if (value?.id && options.length > 0) {
      refInput.current.value = findNameById(value?.id)?.value;
    }
  }, [options]);
  useEffect(() => {
    if (!value?.id && !value?.name) {
      if (!defaultValue) refInput.current.value = '';
      setIput('');
    }
  }, [value]);

  const listRemoveAccents = useMemo(
    () => options.map((element) => ({ ...element, removeAccentName: removeAccents(element.value) })),
    [options]
  );
  const data = listRemoveAccents.filter((element) => element.removeAccentName.includes(removeAccents(input)));
  return (
    <div className={`relative mb-2 max-w-[400px] ${sizeClass[size || 'medium']} ${className} `} ref={ref}>
      <input
        disabled={disabled}
        onClick={() => setFocus(true)}
        ref={refInput}
        onChange={onChangeInput}
        placeholder={placeHolder}
        defaultValue={defaultValue}
        className={`duration-200 w-full text-caption-1 py-[10px] pr-[40px] px-[12px] flex items-center last:mr-0 rounded-[8px] content-center focus:outline-none ${cls}}`}
        {...rest}
      ></input>
      {input && <SearchIcon className="w-5 h-5 absolute right-[12px] top-[11px]" />}
      {!input && (
        <img
          className={`absolute right-[12px] top-[12px] ${focus ? 'focus-down-icon' : 'focus-up-icon'}`}
          width="20px"
          src={`/images/chevron-black-down.png`}
          style={{ pointerEvents: 'none' }}
        />
      )}
      {focus ? (
        <div
          className={`absolute z-10 w-full bg-white border-[1px] border-purple rounded-[8px] mt-3 py-2 min-w-[100%] overflow-hidden max-h-[250px] overflow-y-scroll`}
        >
          {data.length === 0 && (
            <>
              <p className="hover:bg-purple-light text-gray p-3 cursor-pointer">Không tìm thấy </p>
              {isAdd && input && (
                <p
                  onClick={() => {
                    onChange(name, { id: null, value: input });
                    validate(name);
                    setFocus(false);
                  }}
                  className="hover:bg-purple-light text-gray p-3 cursor-pointer flex justify-between"
                >
                  <span>{input}</span>
                  <span className="text-black whitespace-nowrap">Thêm vào</span>
                </p>
              )}
            </>
          )}
          {data.map((item, index) => (
            <p
              key={item.id || 'select' + name + index}
              className="hover:bg-purple-light p-3 py-2.5  cursor-pointer text-caption-1"
              onClick={() => {
                onChange(name, item);
                validate(name);
                setFocus(false);
                if (refInput.current) refInput.current.value = item.value;
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
export default SelectSearch;
