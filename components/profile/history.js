import { fetchSubscription } from '@/api/base/axios-supscription';
import Pagination from '@/components/common/pagination';
import { useAuth } from '@/hooks/use-auth';
import { currencyFormat, parseDateTime } from '@/service/helper';
import { getNameMethod } from '@/service/map';
import Image from 'next/image';
import React, { useState } from 'react';
import useSWR from 'swr';
import { isMobile } from 'react-device-detect';

const History = () => {
  const [current, setCurrent] = useState(0);
  const { data, error } = useSWR('/transactions/', fetchSubscription);
  if (!data) return null;
  const size = isMobile ? 3 : 7;
  const transaction = data.data || [];
  const total = transaction.length;
  const list = [...transaction].slice(current * size, (current + 1) * size);

  return (
    <div className="h-full flex flex-col mb-5 p-5 md:p-0">
      <h2 className="text-headline-2 hidden md:block">Lịch sử thanh toán</h2>
      <div className="rounded-xl md:border-[1px] md:border-silver md:mt-6 w-full md:overflow-x-scroll ">
        <div className="text-body-2-highlight md:flex text-black py-4 px-5 md:border-b-[1px] md:border-silver hidden" >
          <div className="w-40 mr-5"> Ngày thanh toán </div>
          <div className="w-40 mr-5"> Gói sản phẩm </div>
          <div className="w-[8.75rem] mr-5"> Ngày hết hạn </div>
          <div className="w-[7.5rem] mr-5"> Giá tiền </div>
          <div className="w-[8.75rem] mr-5"> Hình thức </div>
          <div className="w-40 mr-5"> Trạng thái</div>
        </div>
        {total === 0 && (
          <div className="py-28 flex flex-col justify-center items-center">
            <div className="w-[128px] h-[128px] text-center">
              <Image src="/images/not-found-history.png" layout="responsive" width={'128px'} height={'128px'} />
            </div>
            <div className="text-body-2 mt-2 whitespace-nowrap text-center text-gray">Chưa có lịch sử thanh toán</div>
          </div>
        )}
        {total > 0 &&
          list.map((element, index) => {
            const { details, gateway, payment_type, status, status_display, total_amount } = element;
            const { plan_details, created_at, next_expiry_date, price } = details[0];
            const clx = index % 2 === 0 ? 'bg-smoke' : 'bg-white';
            const end = index === list.length - 1
            const padding = total / size <= 1 ? " pb-5 " : " "
            return (
              <>
                <div className={'text-body-2 hidden md:flex text-black py-4 px-5 ' + clx + padding} key={element.id}>
                  <div className="w-40 mr-5"> {parseDateTime(created_at)}</div>
                  <div className="w-40 mr-5">
                    {plan_details.name_vi.replace('(Package)', '').replace('(package)', '')}
                  </div>
                  <div className="w-[8.75rem] mr-5"> {parseDateTime(next_expiry_date)} </div>
                  <div className="w-[7.5rem] mr-5"> {currencyFormat(total_amount)}đ </div>
                  <div className="w-[8.75rem] mr-5"> {getNameMethod[payment_type]} </div>
                  <div className={'w-40 mr-5 ' + (status === 'failed' ? 'text-negative' : '')}> {status_display}</div>
                </div>
                <div className={"md:hidden border-[1px] border-silver p-5 rounded-xl shadow " + (end ? "  " : " mb-4")}  >
                  <div className="flex justify-between">
                    <div className="mr-5 text-body-2 mb-4"> Ngày thanh toán </div>
                    <div className="text-body-2-highlight">{parseDateTime(created_at)}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="mr-5 text-body-2 mb-4"> Gói sản phẩm </div>
                    <div className="text-body-2-highlight"> {plan_details.name_vi.replace('(Package)', '').replace('(package)', '')}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="mr-5 text-body-2 mb-4"> Ngày hết hạn </div>
                    <div className="text-body-2-highlight"> {plan_details.name_vi.replace('(Package)', '').replace('(package)', '')}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="mr-5 text-body-2 mb-4"> Giá tiền </div>
                    <div className="text-body-2-highlight"> {currencyFormat(total_amount)}đ</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="mr-5 text-body-2 mb-4"> Hình thức </div>
                    <div className="text-body-2-highlight">{getNameMethod[payment_type]}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="mr-5 text-body-2"> Trạng thái</div>
                    <div className={"text-body-2-highlight " + (status === 'failed' ? 'text-negative' : '')}>{status_display}</div>
                  </div>
                </div>
              </>
            );
          })}
      </div>
      {
        total / size > 1 ? (
          <div className="py-6 md:mt-auto md:pt-0">
            <Pagination total={total} size={size} current={current} onChange={setCurrent} className="text-center md:text-right" />
          </div>
        ) : <div className="pt-5 md:mt-auto md:pt-0"></div>
      }
    </div >
  );
};
export default React.memo(History);
