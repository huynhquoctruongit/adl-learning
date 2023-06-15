import React, { Children, Component, useEffect } from 'react';
import { useRouter } from 'next/router';
import Plan from '@/components/payment/plan';
import Products from '@/components/payment/products';
import Result from '@/components/payment/result';
import { motion } from 'framer-motion';
import { variantsHidden } from '@/service/config';
import { useModal } from '@/hooks/use-modal';
import ModalView from '@/components/common/modal/template';
import StepPayment from '@/components/payment/partial/step';
import Methods from '@/components/payment/methods';
import ActiveCode from '@/components/modal/active-code';
import axiosSubscription from '@/api/base/axios-supscription';

const steps = {
  plan: <Plan />,
  products: <Products />,
  methods: <Methods />,
  result: <Result />
};

let fisrtLoad = false;
const PackageInfo = () => {
  const [open, toggle, setOpen] = useModal();
  const router = useRouter();
  const { step = 'plan' } = router.query;
  const component = steps[step];
  useEffect(() => {
    if (router.asPath.includes('result?id')) {
      const url = router.asPath;
      const result = url.replace('result?id', 'result&id');
      router.push(result);
    }
    setTimeout(() => {
      fisrtLoad = true;
    }, 300);
    axiosSubscription;
  }, []);
  return (
    <div className="flex flex-col-reverse md:flex-row relative md:p-0">
      <div className={step === 'plan' ? '' : 'flex w-full'}>
        <div className="font-bold text-2xl mb-6 hidden md:block">Gói và thanh toán</div>
        <div className={step === 'plan' ? '' : 'mt-2 flex flex-col items-center'}>
          <StepPayment />
          <motion.div
            key={step}
            variants={variantsHidden}
            initial={'hidden'}
            animate={'visible'}
            transition={{ duration: 0.3 }}
            className="tab-content flex-1 bg-white"
          >
            {step == 'plan' && <EnterVoucher setOpen={setOpen} className=" xl:hidden mt-6 mb-1 text-center" />}
            <div className={step == 'plan' ? '' : 'md:mt-16'}>{component}</div>
          </motion.div>
        </div>
      </div>
      {step == 'plan' && (
        <>
          <EnterVoucher setOpen={setOpen} className="text-center hidden md:block md:ml-auto md:my-0 my-[24px] text-body-2" />
          <ModalView
            open={open}
            toggle={() => {
              setOpen(false);
            }}
          >
            <ActiveCode toggle={toggle} />
          </ModalView>
        </>
      )
      }
    </div >
  );
};

const EnterVoucher = ({ setOpen, className }) => {
  return (<div className={"ml-auto text-body-2 md:text-body-1 " + className}>
    Bạn có mã kích hoạt?{' '}
    <span
      onClick={() => setOpen(true)}
      className="text-purple duration-300 transition-colors underline hover:text-purple-medium font-semibold cursor-pointer"
    >
      Nhập tại đây
    </span>
  </div>)
}
export default PackageInfo;
