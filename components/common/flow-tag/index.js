import React from 'react';
const FlowTag = ({ type, className }) => {
  return (
    <>
      {type === 'diagnose' ? (
        <div
          className={`bg-critical-light font-bold text-caption-2-highlight md:text-[14px] w-[fit-content] text-center rounded-[4px] px-[8px] py-[2px] type flex justify-center items-center border-[2px] text-yellow-highlight border-yellow-highlight ${className}`}
        >
          <img width="18.5px" src="/images/muscle.png" />
          <p>THỬ SỨC</p>
        </div>
      ) : (
        type === 'practice' && (
          <div
            className={`bg-information-light font-bold text-caption-2-highlight md:text-[14px] w-[fit-content] text-center rounded-[4px] p-[8px] py-[2px] type flex justify-center items-center border-[2px] text-highlight-blue border-highlight-blue ${className}`}
          >
            <img width="22px" src="/images/gym.png" />
            <p>LUYỆN TẬP</p>
          </div>
        )
      )}
    </>
  );
};
export default FlowTag;
