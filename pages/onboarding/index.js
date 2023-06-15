import Button from '@/components/common/button/basic';
import CreateAnAccount from '@/components/onboarding/create-account';
import StudyProgram from '@/components/onboarding/study-program';
import StepOnboarding from '@/components/onboarding/step';
import Target from '@/components/onboarding/target';
import Welcome from '@/components/onboarding/welcome';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { convertQueyToObject } from '@/service/helper';
import { Tracker } from '@/libs/tracking';
import { useTracking } from '@/hooks/use-tracking';

const listStep = [
  { url: 'create_account', label: 'Thông tin cá nhân' },
  { url: 'study-program', label: 'Chương trình học' },
  { url: 'target', label: 'Mục tiêu học tập' },
  { url: 'welcome', label: 'Hoàn tất' }
];

const WrapDiv = ({ children, step }) => {
  return (
    <>
      <div className="hidden md:block img fixed top-5 left-5">
        <img src="/images/ican_logo.svg" alt="" />
      </div>
      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: 'easeOut', duration: 0.3 }}
        className="p-[20px] md:p-0 w-full md:w-[21rem] min-h-[33rem]"
      >
        {children}
      </motion.div>
    </>
  );
};

const Onboarding = () => {
  const router = useRouter();
  const { profile } = useAuth();
  const { dataTracking, pushTracking } = useTracking('info_fields', 'timeFill');
  const query = convertQueyToObject(router.asPath);
  const [step, setStep] = useState(query?.step * 1 || (profile.current_step || 1) - 1 || 0);
  const [disabled, setDisabled] = useState(false);

  const action = useRef({ onNext: () => {}, onPrev: () => {} });

  const updateAction = (next, prev) => {
    if (next) action.current.onNext = next;
    if (prev) action.current.onPrev = prev;
  };

  const next = async () => {
    const { onNext } = action.current;
    const result = await onNext();
    if (result && step !== 3) setStep((step) => step + 1);
    if (result && step === 3) router.push('/learning-path');
  };
  const prev = () => {
    setStep((step) => step - 1);
  };
  useEffect(() => {
    if (listStep[step].url || listStep[step].url === '')
      router.replace(router.pathname + `?step_url=${listStep[step].url}&step=${step}`);
  }, [step]);

  useEffect(() => {
    Tracker.send({ action: 'show', event: 'start', category: 'onboard' });
    router.prefetch('/learning-path');
  }, []);

  if (!profile) return null;
  console.log(step, 'step');
  return (
    <div className="md:p-10 min-h-[calc(100vh)] flex md:items-center justify-center bg-purple-medium md:bg-[url(/images/bg-onboarding.svg)] bg-cover">
      <div className="bg-white md:rounded-xl md:w-auto w-full">
        <div className="md:p-8 md:flex">
          <h2 className="flex justify-between items-center h-[64px] md:bg-white md:hidden block bg-purple-medium md:p-0 px-[20px] py-[18px] md:text-black text-white text-headline-3 md:mb-6">
            <div className="flex">
              {listStep[step].label}
              {step === 3 && <img className="ml-2 w-[28px] -translate-y-[2px]" src="/icons/party-popper.png" />}
            </div>
            <StepOnboarding listStep={listStep} step={step} />
          </h2>

          <StepOnboarding className="hidden md:block" listStep={listStep} step={step} />
          <AnimatePresence exitBeforeEnter>
            {step === 0 && (
              <WrapDiv step={step}>
                <CreateAnAccount
                  setDisabled={setDisabled}
                  updateAction={updateAction}
                  dataTracking={dataTracking}
                  pushTracking={pushTracking}
                />
              </WrapDiv>
            )}
            {step === 1 && (
              <WrapDiv step={step}>
                <StudyProgram updateAction={updateAction} hasTracking />
              </WrapDiv>
            )}
            {step === 2 && (
              <WrapDiv step={step}>
                <Target
                  setDisabled={setDisabled}
                  updateAction={updateAction}
                  hasTracking
                  dataTracking={dataTracking}
                  pushTracking={pushTracking}
                />
              </WrapDiv>
            )}
            {step === 3 && (
              <WrapDiv step={step}>
                <Welcome welcomeAction={updateAction} />
              </WrapDiv>
            )}
          </AnimatePresence>
        </div>
        <div className="border-b-[1px] border-t-[1px] border-silver mt-auto w-[100%] px-[20px] py-[12px] md:px-8 md:py-5 md:bg-smoke rounded-b-xl md:relative absolute md:bottom-auto bottom-0">
          <div className="flex justify-end">
            {step !== 0 && (
              <Button typehtml={'submit'} size="min" onClick={prev} type="outline" className="mr-[12px] md:mr-4 ml-0">
                Quay lại
              </Button>
            )}
            <Button
              typehtml={'submit'}
              size="min"
              disabled={disabled}
              onClick={next}
              type="default"
              className="ml-0 w-full md:w-auto  md:min-w-[115px]"
            >
              {listStep[step].url === 'welcome' ? 'Hoàn tất' : 'Tiếp theo'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Onboarding;
