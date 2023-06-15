import React from 'react';
import Button from '../button/basic';

const imgs = {
  sad: '/images/sad.png',
  wondering: '/icons/wondering.png'
};

export const Warning = ({ type, buttonConfirm, buttonCancel, title, subTitle }) => {
  const img = imgs[type] || '/images/sad.png';
  return (
    <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full">
      <div className="items-center justify-center m-auto max-w-[400px] h-full mt-[10%] rounded-lg">
        <div className="p-8 xl:grid-cols-2 text-center h-auto md:h-[260px] bg-white rounded-lg">
          <div className="mt-[10px]">
            <img className="m-auto" width="40px" src={img}></img>
            <div className="text-headline-3 mb-4 mt-3">{title}</div>
            <div className="text-body-2 mb-8 text-gray ">{subTitle}</div>
            <div className="flex items-center justify-center">
              <Button
                onClick={() => {
                  if (buttonCancel?.action) buttonCancel.action();
                }}
                type="outline"
                size="full"
                className="mr-2 border-solid border-2 ml-0"
              >
                {buttonCancel.text}
              </Button>
              <Button
                size="full"
                onClick={() => {
                  if (buttonConfirm?.action) buttonConfirm.action();
                }}
                className="ml-2 border-solid border-2"
              >
                {buttonConfirm.text}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
