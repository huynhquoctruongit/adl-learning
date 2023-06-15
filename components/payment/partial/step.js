import { Checked } from '@/components/icons';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

const clxOvan = {
  default: 'border-gray',
  active: 'border-white bg-purple text-white',
  selected: 'border-white bg-positive'
};
const clxText = {
  default: 'text-gray',
  active: 'text-purple',
  selected: 'text-black'
};

const listStep = [
  { tag: 'products', label: 'Chọn gói' },
  { tag: 'methods', label: 'Thanh toán' },
  { tag: 'result', label: 'Hoàn tất' }
];
const StepPayment = () => {
  const router = useRouter();
  const { step = 'plan', type, status } = router.query;
  const ref = useRef();
  useEffect(() => {
    if (step === "result") {
      ref.current.scrollTo({
        top: 100,
        left: ref.current.scrollWidth,
      })
    }
  }, [])

  let index_step = listStep.findIndex((element) => element.tag === step);
  if (status === 'succeed') index_step = 100;
  if (step === 'plan' || type === 'active-code' || status === 'pending' || (status !== 'succeed' && step === 'result'))
    return null;
  return (
    <div ref={ref} className="md:absolute md:left-[50%] md:translate-x-[-50%] w-screen md:w-fit overflow-x-scroll no-scroll mt-4 md:mt-0">
      <div className="border-silver text-gray flex whitespace-nowrap w-fit px-5">
        {listStep.map((item, index) => {
          let status = index > index_step ? 'default' : index === index_step ? 'active' : 'selected';
          const clx = clxOvan[status];
          return (
            <div key={item.label}>
              <div className="flex items-center">
                <div
                  className={`rounded-full duration-200 font-bold text-xs w-[1.5rem] h-[1.5rem] border-[1px] flex justify-center items-center ${clx}`}
                >
                  {status !== 'selected' && index + 1}
                  {status === 'selected' && <Checked />}
                </div>
                <div className={`ml-3 duration-200 ${clxText[status]}`}>{item.label}</div>
                {index !== listStep.length - 1 && <div className="w-[2rem] h-[1px] bg-shark my-1 mx-2"></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default StepPayment;
