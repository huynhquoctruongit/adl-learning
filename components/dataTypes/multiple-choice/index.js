import React, { Fragment } from 'react';
import { useInteraction } from '@/hooks/use-interaction';
import QuesNoti from '@/components/common/ques-noti';
import MathJaxBlock from '@/components/common/mathtype/MaxJax';

const MultileChoice = ({
  answer_option = [],
  answerRight,
  answerListState,
  itemActive,
  question,
  changeAnswer,
  status,
  isReview
}) => {
  if (answer_option?.[0]?.__component !== 'answers-option.multi-choice') return null;
  const { findInteraction, interaction } = useInteraction();
  const interact = findInteraction(question.question_uuid);
  const state = interact?.state || answerListState;
  const answerLabel = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L'];
  const isAnswered = interact?.is_answer_correct !== undefined;
  return (
    <Fragment>
      <div className="p-5 md:p-8 min-height-content">
        {!isAnswered && (
          <p className="text-caption-1-highlight uppercase text-gray mb-[16px]">
            {answerRight > 1 ? 'HÃY CHỌN TẤT CẢ ĐÁP ÁN ĐÚNG' : 'HÃY CHỌN 1 ĐÁP ÁN ĐÚNG'}{' '}
          </p>
        )}
        {isAnswered && (
          <div className="mb-3">
            <QuesNoti status={status} interact={interact} />
          </div>
        )}
        {answer_option.map((data, index) => {
          const item = data.list;
          var isSelected = '';
          var isFail = '';
          var isCorrred = '';
          if (answerRight) {
            state &&
              state.length > 0 &&
              !state.type &&
              state.map((itemdata) => {
                if (itemdata == item?.id) {
                  if (status == 'pending') {
                    isSelected = ' text-white bg-selected';
                  } else {
                    if (!item.is_correct) {
                      if (itemdata == item?.id && !isReview) {
                        isFail = ' bg-fail text-white';
                      } else {
                        if (isReview) {
                          isFail = ' bg-fail text-white';
                        }
                      }
                    }
                  }
                }
              });
          }
          if (status === 'review' || (location.pathname === '/full_page_preview' && status === 'cancel')) {
            isCorrred = item?.is_correct && status !== 'pending' ? 'text-white bg-correct' : '';
          } else {
            if (isReview) {
              isCorrred = item?.is_correct && status !== 'pending' ? 'text-white bg-correct' : '';
            } else {
              state &&
                state.length > 0 &&
                !state.type &&
                state.map((itemdata) => {
                  if (itemdata == item?.id) {
                    isCorrred = item?.is_correct && status !== 'pending' ? 'text-white bg-correct' : '';
                  }
                });
            }
          }
          const isStag = window.location.href.includes('stag') || window.location.href.includes('localhost');
          return (
            <div key={item?.id}>
              <input
                checked={itemActive === item?.id}
                disabled={status !== 'pending'}
                type="radio"
                className="hidden"
                id={item?.id}
                name="answer"
                value={item?.id}
                onChange={(e) => changeAnswer(e)}
              />
              <label
                htmlFor={item?.id}
                className={`item-multiple-choose shadow-box-purple border-item-select relative min-h-[80px] w-full h-full flex items-center cursor-pointer mb-[16px] p-[20px] rounded-[12px] transition-all ease-in-out duration-300 bg-[white] ${isSelected} ${isFail} ${isCorrred} ${
                  item?.is_correct && isStag ? 'shadow-box-correct' : ''
                }`}
              >
                <span
                  className={`text-indigo-600 rounded-[20px] flex items-center justify-center min-w-[32px] min-h-[32px] bg-purple-light text-purple ${
                    isSelected && ' text-[white] bg-purple'
                  } ${isFail && ' text-[white] bg-negative'}  ${isCorrred && ' text-[white] bg-positive'}`}
                >
                  {answerLabel[index]}
                </span>
                <div className={`ml-[20px] text-black`}>
                  <MathJaxBlock content={item?.answer} />
                </div>
                {state &&
                  state.length > 0 &&
                  !state.type &&
                  state.map((itemdata, index) => {
                    if (itemdata == item?.id && status !== 'pending') {
                      return (
                        <p
                          key={index}
                          className={`absolute top-0 right-0 px-2 py-1 text-sm bg-red-500 rounded-tag-selected mt-1 mr-1 text-[white] text-caption-2-highlight ${
                            isFail && ' bg-negative'
                          }  ${isCorrred && ' bg-positive'}`}
                        >
                          Bạn chọn
                        </p>
                      );
                    }
                  })}
              </label>
            </div>
          );
        })}

        <div
          className="p-4 bg-green-500text-positive bg-correct rounded-[12px]"
          style={{ display: status !== 'pending' && isReview ? 'block' : 'none' }}
        >
          <p className="uppercase text-caption-1-highlight">Lời giải</p>
          <p className="text-black text-caption-1 md:ext-sm mt-2">
            <MathJaxBlock content={question?.detailed_answer} />
          </p>
        </div>
      </div>
    </Fragment>
  );
};
export default MultileChoice;
