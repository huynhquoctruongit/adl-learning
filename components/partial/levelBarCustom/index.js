import { useKnowledge } from '@/hooks/use-knowledge';
import { orderDifficult } from '@/service/config';
import React from 'react';

const Step = ({ step, active, className, hideGrayscale, lastLevel }) => {
  return (
    <span className={`flex progressbar relative mr-[2px] ${className}`}>
      {step == 1 ? (
        <img key={'step' + active} src="/icons/fire-pending.png" width="24px" />
      ) : (
        Array.apply(null, { length: step }).map(function (item, index) {
          return (
            <div key={"bar" + index}>
              {index < active - 1 ? (
                <img key={'step' + index} src="/icons/fire.png" width="24px" />
              ) : index == active - 1 ? (
                <img key={'step' + index} src="/icons/fire-pending.png" width="24px" />
              ) : (
                <img key={'step' + index} src="/icons/fire-fail.png" width="24px" />
              )}
            </div>
          );
        })
      )}
    </span>
  );
};
export default Step;
