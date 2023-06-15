import React, { useEffect } from 'react';
import GeneralInfo from '@/components/profile/general-info';
import PaymentInfo from '@/components/profile/payment-info';
import StudyProfile from '@/components/profile/study-profile';
import HistoryProfile from '@/components/profile/history';
import TargetProfile from '@/components/profile/target';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ProfileIcon, FlatIcon, PaymentIcon, BookProfile, HistoryPayment } from '@/components/icons/profile';
import { variantsHidden } from '@/service/config';
import { motion } from 'framer-motion';

const tabs = [
  {
    tab: 'general-info',
    title: 'Thông tin cá nhân',
    component: <GeneralInfo />,
    icon: ProfileIcon
  },
  {
    tab: 'study-profile',
    title: 'Chương trình học',
    component: <StudyProfile />,
    icon: BookProfile
  },
  {
    tab: 'target',
    title: 'Mục tiêu học tập',
    component: <TargetProfile />,
    icon: FlatIcon
  },
  {
    tab: 'payment',
    title: 'Gói và thanh toán',
    component: <PaymentInfo />,
    icon: PaymentIcon
  },
  {
    tab: 'history-payment',
    title: 'Lịch sử thanh toán',
    component: <HistoryProfile />,
    icon: HistoryPayment
  }
];

const Account = () => {
  const router = useRouter();
  const { tab } = router.query;
  const current = tabs.find((element) => element.tab === tab);
  const classrsps = current ? "hidden md:block" : "md:block"
  return (
    <div className="container-account">
      <div className="flex w-full md:h-[calc(100vh-71px)] h-[calc(100vh-64px)]">
        <div className={"w-full relative md:w-[260px] px-5 md:px-[10px] pt-8 md:bg-[url('/images/ADL-bg-profile.svg')] bg-no-repeat bg-contain bg-purple-medium bg-position bg-left-bottom " + classrsps} >
          <img className='absolute md:hidden bottom-[0px] left-[-20px] w-[160px]' src="/images/bg-menu-mobile.png" alt="" />
          <div className="text-headline-3 text-white mb-1 md:hidden">Tài khoản và thanh toán</div>
          {tabs.map((element, index) => {
            const Icon = element.icon;
            return (
              <Link href={'/account?tab=' + element.tab} key={'profile' + index}>
                <div
                  className={
                    (tab === element.tab ? 'text-purple bg-purple-light ' : ' text-white md:text-[#ECECFE] bg-transparent') +
                    ' text-body-2-highlight flex md:px-4 py-4 md:py-2 md:rounded-lg md:mb-4 hover:cursor-pointer  duration-200 border-custom md:border-none'
                  }
                >
                  <Icon
                    color={tab === element.tab ? '#5551FF' : '#ECECFE'}
                    className={tab === element.tab ? 'stroke-[#5551FF]' : 'stroke-[#ECECFE]'}
                  />
                  <p className="ml-3 font-semibold">{element.title}</p>
                </div>
              </Link>
            );
          })}
        </div>
        {current && <motion.div
          key={tab}
          variants={variantsHidden}
          initial={'hidden'}
          animate={'visible'}
          transition={{ duration: 0.3 }}
          className="tab-content flex-1 bg-white md:py-5  md:p-10 min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-71)] overflow-y-scroll"
        >
          {current.component}
        </motion.div>}
      </div>
    </div>
  );
};
export default Account;
Account.isHeader = true
