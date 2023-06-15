import React, { Fragment } from 'react';
import { useInteraction } from '@/hooks/use-interaction';
import QuesNoti from '@/components/common/ques-noti';
import MathJaxBlock from '@/components/common/mathtype/MaxJax';

const Table = ({ answer_option, question, selectRadio, status, isReview }) => {
  if (answer_option?.[0]?.__component !== 'answers-option.table') return null;
  const { findInteraction } = useInteraction();
  const interact = findInteraction(question.question_uuid);
  const { state } = interact || {};
  return (
    <Fragment>
      <div className="p-5 md:p-8 min-height-content">
        <div className="text-caption-1-highlight text-gray uppercase text-right mr-[30px] flex justify-between items-center mb-3">
          {interact?.is_answer_correct === undefined && <p className="text-left mr-[8px]">Hãy chọn đáp án phù hợp</p>}
          {interact?.is_answer_correct !== undefined && <QuesNoti status={status} interact={interact} />}
          <div className="mr-2">
            <span className="mr-[8px]">Đúng</span>
            <span>Sai</span>
          </div>
        </div>
        {answer_option.map((data, index) => {
          const item = data.list;
          var checkData = null;
          if (state && Object.keys(state).length > 0) {
            checkData = !state.type && state.find((value) => value.id == item.id);
          } else {
            checkData = item;
          }
          var isFail = '';
          var isCorrred = '';
          if (checkData && status !== 'pending') {
            if (checkData.choice == checkData.is_correct) {
              isCorrred = ' bg-correct';
            } else {
              isFail = ' bg-fail';
            }
          }
          const propsLeft = {};
          if (
            (status === 'cancel' || status === 'timeout' || status === 'review') &&
            checkData?.is_correct &&
            isReview
          ) {
            propsLeft.checked = true;
          }
          const propsRight = {};
          if (
            (status === 'cancel' || status === 'timeout' || status === 'review') &&
            !checkData?.is_correct &&
            isReview
          ) {
            propsRight.checked = true;
          }
          const isStag = window.location.href.includes('stag') || window.location.href.includes('localhost');
          return (
            <div key={item.id}>
              <label
                htmlFor={item.id}
                className={`shadow-box-purple relative min-h-[80px] w-full h-full flex items-center cursor-pointer mb-[16px] p-[24px] rounded-[12px] transition-all ease-in-out duration-300 bg-[white] glx-shadow-box ${isFail} ${isCorrred} ${isStag && item.is_correct ? 'shadow-box-correct' : ''}`}
              >
                <div className={`flex justify-between w-full`}>
                  <MathJaxBlock content={item?.answer} />
                  <div className="flex justify-center">
                    <label className="container-input">
                      <input
                        key={`radio_` + item.id}
                        disabled={status !== 'pending'}
                        type="radio"
                        name={`radio_` + index}
                        defaultChecked={
                          (status === 'cancel' || status === 'timeout' || status === 'review') && checkData?.is_correct
                        }
                        {...propsLeft}
                        onChange={(e) => selectRadio(item, 'right')}
                      />
                      <span className={`checkmark ${isCorrred} ${isFail}`} />
                    </label>
                    <label className="container-input">
                      <input
                        key={`radio_` + index}
                        disabled={status !== 'pending'}
                        type="radio"
                        name={`radio_` + index}
                        defaultChecked={
                          (status === 'cancel' || status === 'timeout' || status === 'review') && !checkData?.is_correct
                        }
                        {...propsRight}
                        onChange={(e) => selectRadio(item, 'wrong')}
                      />
                      <span className={`checkmark ${isCorrred} ${isFail}`} />
                    </label>
                  </div>
                </div>
              </label>
            </div>
          );
        })}
        {status !== 'pending' && isReview && (
          <div className="p-4 bg-green-500text-positive bg-correct rounded-[12px]">
            <p className="uppercase text-caption-1-highlight">Lời giải</p>
            <p className="text-black text-caption-1 md:ext-sm mt-2">
              <MathJaxBlock content={question?.detailed_answer} />
            </p>
          </div>
        )}
      </div>
    </Fragment>
  );
};
export default Table;
