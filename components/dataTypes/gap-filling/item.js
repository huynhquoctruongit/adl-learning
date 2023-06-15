import useOnClickOutside from '@/hooks/outside';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { LatexCom } from '../matching/item';

const classInput = {
  input: 'border-purple bg-purple-light ',
  active: 'hidden ',
  cancel: '',
  timeout: '',
  failed: 'border-negative bg-negative-light text-negative ',
  corrected: 'hidden '
};

const classSpan = {
  input: 'absolute h-0 opacity-0 w-auto ',
  active: 'relative ',
  cancel: '',
  timeout: '',
  failed: 'border-positive bg-positive-light text-positive ',
  corrected: 'border-positive bg-positive-light text-positive '
};

const Element = ({ id, gapFilling, statusGlobal, isReview }) => {
  const router = useRouter();
  const input = useRef();
  const span = useRef();
  const { store, answers, result = [], interact } = gapFilling.current;
  const old = result.find(({ key }) => key === id);
  const old_status = old?.result === false ? 'failed' : old?.result === true ? 'corrected' : '';
  const [status, setStatus] = useState(old_status.trim() || (interact ? 'failed' : 'active'));
  const value = store[id];
  useOnClickOutside(input, () => {
    if (status === 'input') setStatus('active');
  });
  const keyDown = (event) => {
    const { key, keycode, which } = event
    const keyCode = keycode || which;
    gapFilling.current.store[id] = event.target.value.trim();
    gapFilling.current.forceUpdate();
    if (keyCode === 13) {
      setStatus('active');
    }
  };

  useEffect(() => {
    // preview for content
  }, []);

  useEffect(() => {
    if (gapFilling.current.store[id] || interact) {
      const answer = gapFilling.current.answers[id];
      const list = (answer || '').split('||');
      span.current.innerHTML = list ? list[0].trim() : '';
      if (statusGlobal === 'review') {
        var getFilter = gapFilling.current.result.find((item) => {
          return item.key === id;
        });
        if (getFilter?.result) {
          span.current.innerHTML = gapFilling.current.store[id];
        }
      }
      input.current.style.width = span.current.offsetWidth + 'px';
    }
    const resize = () => {
      span.current.innerHTML = input.current.value;
      input.current.style.width = span.current.offsetWidth + 'px';
    };
    input.current.addEventListener('input', resize);
  }, [statusGlobal]);

  useEffect(() => {
    if (statusGlobal === 'cancel' || statusGlobal === 'timeout') {
      setStatus('failed');
      const first = (answers[id] || '').split('||');
      span.current.innerHTML = first && first[0] ? first[0].trim() : '';
      if (location.pathname === '/full_page_preview') {
        span.current.innerHTML = gapFilling.current.answers[id];
      }
    }
  }, [statusGlobal]);

  const onSubmit = (status) => {
    setStatus(status ? 'corrected' : 'failed');
    const first = (answers[id] || '').split('||');
    if (status) {
      span.current.innerHTML = input.current.value;
    } else {
      span.current.innerHTML = first && (first[0] || first[0] === 0) ? first[0].trim() : '';
    }
  };
  gapFilling.current.func[id] = onSubmit;
  const inputClass =
    'py-[2px] h-[29px] mx-0.5 text-center inline px-3 border-b-[2px] focus:outline-none min-w-[3rem] font-bold ';
  const spanClass = `py-[2px] mx-0.5 h-[29px] text-bold border-b-[2px] px-3 min-w-[3rem] top-0 inline-flex items-center whitespace-pre justify-center `;
  const statusInReview = !isReview && status === 'failed' ? 'input' : status;
  return (
    <>
      <input
        ref={input}
        maxLength="30"
        defaultValue={value}
        type="text"
        style={{ width: '2rem' }}
        className={inputClass + classInput[status]}
        onKeyUp={keyDown}
        disabled={status === 'corrected' || status === 'failed'}
      />
      <span
        onClick={() => {
          if (status === 'active') setStatus('input');
          queueMicrotask(() => {
            input.current.style.width = span.current.offsetWidth + 'px';
            input.current.focus();
          });
        }}
        ref={span}
        style={{
          minWidth: '88px',
          fontFamily: 'Be Vietnam Pro, sans-serif',
          verticalAlign: 'middle'
        }}
        className={
          spanClass +
          classSpan[statusInReview] +
          (status !== 'failed' && status !== 'corrected'
            ? value
              ? ' border-purple bg-purple-light'
              : 'border-gray bg-smoke'
            : '')
        }
      ></span>
    </>
  );
};

const ItemGap = ({ data, index, isDisable, gapFilling, status, isReview }) => {
  const indexMap = useRef([]);
  const value = data.list.values || '';
  const answers = value.split('\n');

  useEffect(() => {
    indexMap.current.map((item, i) => {
      const id = index + '-root-' + item;
      const dom = document.getElementById(id);
      gapFilling.current.count.push(id);
      if (!gapFilling.current.answers[id]) {
        gapFilling.current.answers[id] = answers[i];
      }
      if (dom)
        ReactDOM.render(
          <Element
            key={i}
            statusGlobal={status}
            isReview={isReview}
            isDisable={isDisable}
            id={id}
            gapFilling={gapFilling}
            answer={answers[i]}
          />,
          dom
        );
    });
  }, [status]);

  const question = data.list.question.replace(/\$inuput/g, '@input');
  const html = useMemo(
    () =>
      question?.replace(/@input/g, (value, i) => {
        indexMap.current.push(i);
        const id = index + '-root-' + i;
        return `<span id="${id}" class="inline-flex align-middle font-bold mx-2"></span>`;
      }),
    [question]
  );

  return (
    <div
      className={`rounded-xl shadow w-full h-full flex items-center cursor-pointer mb-4 bg-white p-5 transition-all ease-in-out duration-300`}
    >
      <div className="flex justify-between w-full items-center ">
        <div className="leading-8 gap-filling">
          <LatexCom data={html} />
        </div>
      </div>
    </div>
  );
};
export default ItemGap;
