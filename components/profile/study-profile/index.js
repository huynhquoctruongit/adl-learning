import Button from '@/components/common/button/basic';
import StudyProgram from '@/components/onboarding/study-program';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/context/toast';

const WrapDiv = ({ children, step }) => {
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: 'easeOut', duration: 0.3 }}
      className="md:w-[21rem]"
    >
      {children}
    </motion.div>
  );
};

const StydyProfile = () => {
  const { profile } = useAuth();
  const [disabled, setDisabled] = useState(true);
  const { toggleToast } = useToast();
  const action = useRef({ onNext: () => {}, onPrev: () => {} });

  const updateAction = (next, prev) => {
    if (next) action.current.onNext = next;
    if (prev) action.current.onPrev = prev;
  };

  const next = async () => {
    const { onNext } = action.current;
    const result = await onNext();
    toggleToast({
      show: true,
      status: result ? 'success' : 'fail',
      message: result ? 'Cập nhật thành công' : 'Cập nhật thất bại',
      time: 5000
    });
  };
  if (!profile) return null;
  return (
    <>
      <div className="bg-white rounded-xl md:p-0 p-[20px] h-[calc(100vh-64px-65px)] md:h-full">
        <WrapDiv>
          <StudyProgram updateAction={updateAction} notUpdateStep setDisabled={setDisabled} />
        </WrapDiv>
      </div>
      <div className="md:flex justify-end md:max-w-[21rem] w-full md:mt-4 md:px-0 md:py-0 px-[20px] py-[12px] bg-white border-b-[1px] border-t-[1px] border-silver md:border-none">
        <Button
          typehtml={'submit'}
          size="min"
          disabled={disabled}
          onClick={next}
          type="default"
          className="md:ml-4 ml-0 md:min-w-[180px] w-full md:w-auto"
        >
          Cập nhật
        </Button>
      </div>
    </>
  );
};
export default StydyProfile;
