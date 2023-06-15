import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/use-auth';
import React, { useState, useEffect, useMemo } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Link from 'next/link';
import { ProfileIcon } from '@/components/icons/profile';
import TagPackage from '@/components/partial/tagPackage';
import BackComponent from '@/components/mobile/backnav';
// const listBackMobile = ["tab=payment", "tab=history-payment"]
const titleByUrl = {
  "tab=payment": "Gói và thanh toán",
  "tab=history-payment": "Lịch sử thanh toán",
  "tab=general-info": "Thông tin cá nhân",
  "tab=target": "Mục tiêu học tập",
  "tab=study-profile": "Chương trình học",
}
const menuMobile = (url) => {
  let name = ""
  const reuslt = Object.keys(titleByUrl).find(element => {
    if (url.includes(element)) {
      name = element
      return true
    }
  })
  return [reuslt ? true : false, name]
}

const Header = () => {
  const router = useRouter();
  const { profile, logout } = useAuth({
    revalidateOnMount: false
  });

  const onLogout = () => {
    handelLogout();
  };
  const handelLogout = () => {
    logout();
    router.push('/');
  };
  const nameMobile = profile?.full_name.split(' ');
  const fullname = profile?.full_name && isMobile ? nameMobile[nameMobile.length - 1] : profile?.full_name;
  const [isMobile, name] = useMemo(() => {
    return menuMobile(router.asPath)
  }, [router.asPath])
  const title = titleByUrl[name]
  const clxMobile = isMobile ? "md:hidden" : "hidden"
  const clxDesktop = isMobile ? "hidden md:flex" : "flex"
  return (
    <div className={"h-[64px] md:h-[71px]"}>
      <div className={"border-b-[1px] border-silver bg-blue-400 bg-white text-slate-700 fixed w-full top-0 left-0 z-20 "}>
        <BackComponent className={"md:hidden px-5 " + clxMobile}> {title} </BackComponent>
        <div className={"py-[12px] px-4 xl:px-[32px] w-full justify-between flex-row items-center " + clxDesktop}>
          <div className="font-[500] text-xl">
            <div className="flex items-center">
              <img
                onClick={() => {
                  router.push('/learning-path');
                }}
                className="w-[80px] xl:w-[94px] xl:mr-3 cursor-pointer"
                src="/images/logo.svg"
                alt=""
              />

              {profile?.role && <div className="pt-2"><TagPackage type={profile?.role} /></div>}
            </div>
          </div>
          {profile && (
            <div className="profile items-center">
              <div className="flex items-center ">
                <div className="ml-2 flex items-center lg:ml-0">
                  <Popover className="relative">
                    {({ close }) => {
                      return (
                        <>
                          <Popover.Button
                            className={` h-[40px] text-black text-body-2-highlight group rounded-lg flex justify-center items-center text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                          >
                            <img
                              className="border-[1px] rounded-full border-smoke width-[40px] md:mr-2 h-10 w-10 text-orange-300 fill-black transition ease-in-out duration-150 object-cover"
                              src={profile.avatar || '/images/avatar-icon.png'}
                            />
                            <span className="hidden md:block text-body-2-highlight max-w-[13rem] truncate">
                              {fullname}
                            </span>
                            <img src="/images/chevron-black-down.png" className="w-[24px] ml-[6px]"></img>
                          </Popover.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                          >
                            <Popover.Panel className="shadow-box bg-white right-0 absolute z-20  min-w-[calc(100vw-32px)] md:min-w-full  mt-3 transform sm:px-0 border-[1px] border-[#5551FF] rounded-[12px] overflow-hidden">
                              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className=" bg-white p-[20px]">
                                  <Link href="/account">
                                    <div className="cursor-pointer flex items-center transition duration-150 ease-in-out rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50">
                                      <div className="flex items-center justify-center flex-shrink-0 text-white sm:h-12 sm:w-12">
                                        <img
                                          className=" border-[1px] rounded-full border-smoke width-[40px] h-10 w-10 text-orange-300 fill-black transition ease-in-out duration-150"
                                          src={profile.avatar || '/images/avatar-icon.png'}
                                        />
                                      </div>
                                      <div className="ml-2">
                                        <p className="text-body-2-highlight text-gray-900 whitespace-nowrap ">
                                          {profile?.full_name}
                                        </p>
                                        <p className="text-gray text-caption-1">{profile.email}</p>
                                      </div>
                                    </div>
                                  </Link>
                                  <div className="flex">
                                    {profile?.role !== 'premium' && (
                                      <Link href="/account?tab=payment">
                                        <p
                                          onClick={close}
                                          className="ml-3 text-body-2-highlight text-purple cursor-pointer"
                                        >
                                          Nâng cấp ngay
                                        </p>
                                      </Link>
                                    )}
                                  </div>
                                </div>
                                <hr className="bg-white mx-4 text-[#E8E8E8]"></hr>
                                <div className="px-[20px] pt-[20px] pb-[10px] bg-white">
                                  <span
                                    className="cursor-pointer items-center hidden md:flex"
                                    onClick={() => {
                                      router.push('/account?tab=general-info'), close();
                                    }}
                                  >
                                    <ProfileIcon color="#383838" />
                                    <span className="text-body-2-highlight whitespace-nowrap ml-[10px]"> Tài khoản và thanh toán</span>
                                  </span>
                                  <span
                                    className="cursor-pointer	flex items-center md:hidden flex-wrap"
                                    onClick={() => {
                                      router.push('/account'), close();
                                    }}
                                  >
                                    <ProfileIcon color="#383838" />
                                    <span className="text-body-2-highlight ml-[10px]"> Tài khoản và thanh toán</span>
                                  </span>
                                </div>
                                <div className="px-[20px] pt-[10px] pb-[20px] bg-white" onClick={close}>
                                  <span className="cursor-pointer	flex items-center ">
                                    <img src="/images/log-out.png" className="w-[22px]" />
                                    <span className="text-body-2-highlight ml-[10px]" onClick={onLogout}>
                                      {' '}
                                      Đăng xuất
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      );
                    }}
                  </Popover>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
