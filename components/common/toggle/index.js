import { useState } from 'react';
export const Toggle = ({ onChange }) => {
  const [state, setState] = useState(false);
  const left = !state ? '2px' : '14px';

  return (
    <div
      className={'rounded-full h-5 w-8 relative cursor-pointer ' + (state ? 'bg-purple' : 'bg-silver')}
      onClick={() => {
        setState(!state);
        onChange(!state);
      }}
    >
      <div
        className="absolute w-4 h-4 rounded-full bg-white transition-all duration-300"
        style={{ transform: `translate(${left}, -50%)`, top: '50%' }}
      ></div>
    </div>
  );
};
