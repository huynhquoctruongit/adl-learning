import { useRouter } from 'next/router';
import React, { Fragment } from 'react';

const Footer = () => {
  const router = useRouter();
  return (
    <Fragment>
      <div className="border border-t-500 bg-blue-400 lg:bg-white text-white lg:text-slate-700 sticky top-0 left-0 z-1 min-h-52">
        <div className="max-w-7xl mx-auto  px-6 py-4 flex justify-between items-center flex-col lg:flex-row">
          <div className="font-[500] text-xl mt-[4px] pb-2">
            <div className="flex mb-4">
              <img src="/images/logo.svg" alt="" />
            </div>
            <div className="info-company text-sm text-[#0057A5]">
              <p className="mb-2 font-bold text-base">Công ty cổ phần Galaxy Education</p>
              <p className="mb-2 text-xs">MST: 0316418562 Quản Lý Bởi Cục Thuế Thành phố Hồ Chí Minh. Ngày cấp: 31/07/2020</p>
              <p className="mb-2 text-xs">Địa chỉ: 59C Xa Lộ Hà Nội, P. Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh, Việt Nam.</p>
              <p className="mb-2 text-xs">Số điện thoại: (028) 7300 3267. Email: education@galaxy.com.vn</p>
              <p className="mb-2 text-xs">Người đại diện: Phạm Giang Linh</p>
            </div>
          </div>
          <div className="connect text-[#0057A5]">
            <p>Kết nối với ICAN</p>
            <a target="_blank" href="https://www.facebook.com/ican.vn">
              <div className="cursor-pointer logo-fb rounded-full bg-gray-100 w-10 h-10 mt-2 flex justify-center items-center">
                <svg
                  width="10"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="facebook-f"
                  className="svg-inline--fa fa-facebook-f fa-w-10 "
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path
                    fill="currentColor"
                    d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                  ></path>
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
      <p className="text-center py-2 text-sm bg-slate-100 text-slate-400">@2020 Copyright by Galaxy Education</p>
    </Fragment>
  );
};

export default Footer;
