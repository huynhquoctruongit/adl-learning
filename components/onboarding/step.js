import { Checked } from '../icons';

const clxOvan = {
  default: 'border-white md:text-gray text-white md:border-gray',
  active: 'border-white bg-white md:bg-purple md:text-white text-purple-medium',
  selected: 'border-positive md:border-white bg-positive'
};
const clxText = {
  default: 'text-gray',
  active: 'text-purple',
  selected: 'text-black'
};

const StepOnboarding = ({ className, listStep, step }) => {
  return (
    <div className={`flex md:block justify-end md:pr-10 md:border-r-[1px] md:mr-8 border-silver text-gray ${className}`}>
      {listStep.map((item, index) => {
        const status = index > step ? 'default' : index === step ? 'active' : 'selected';
        const clx = clxOvan[status];

        return (
          <div key={item.label}>
            <div className="flex">
              <div
                className={`rounded-full mr-[8px] md:mr-0 duration-200 font-bold text-xs w-[1.5rem] h-[1.5rem] border-[1px] flex justify-center items-center ${clx}`}
              >
                {status !== 'selected' && index + 1}
                {status === 'selected' && <Checked />}
              </div>
              <div className={`ml-3 duration-200 hidden md:block ${clxText[status]}`}>{item.label}</div>
            </div>
            {index !== listStep.length - 1 && <div className="hidden md:block h-[1rem] w-[1px] bg-shark ml-[0.74rem] my-[4px]"></div>}
          </div>
        );
      })}
    </div>
  );
};
export default StepOnboarding;
