import Button from '../common/button/basic';
import { useRouter } from 'next/router';
import { usePayment } from '@/context/subscription';
import { currencyFormat, parseDateTime } from '@/service/helper';
import { getNameMethod } from '@/service/map';
import React, { useEffect, useRef } from 'react';
import axiosSubscription, { fetchSubscription } from '@/api/base/axios-supscription';
import { useAuth } from '@/hooks/use-auth';
import useSWR from 'swr';
const mapStatus = { succeed: 'voucherSuccess', failed: 'voucherFail' };
const result = {
  succeed: {
    color: 'text-positive',
    text: 'Thanh toán thành công',
    des: 'Cùng Gia sư AI chinh phục mục tiêu của bạn',
    icon: '/icons/party-popper.png'
  },
  failed: {
    color: 'text-negative',
    text: 'Thanh toán thất bại',
    des: 'Úi, có lỗi gì rồi. Bạn vui lòng thử lại nhé!',
    icon: 'icons/crying-face_1f622.png'
  },
  pending: {
    color: 'text-critical',
    text: 'Giao dịch đang xử lí',
    des: 'Bạn vui lòng chờ và kiểm tra Lịch sử thanh toán nhé!',
    icon: '/icons/pending.png'
  },
  voucherSuccess: {
    color: 'text-positive',
    text: 'Kích hoạt gói thành công',
    des: 'Cùng Gia sư AI chinh phục mục tiêu của bạn',
    icon: '/icons/party-popper.png'
  },
  voucherFail: {
    color: 'text-negative',
    text: 'Kích hoạt gói thất bại',
    des: 'Úi, có lỗi gì rồi. Bạn vui lòng thử lại nhé!',
    icon: 'icons/crying-face_1f622.png'
  }
};

let timeout = null;
const Result = () => {
  const { data, mutate: updateTransactions } = useSWR('/transactions/', fetchSubscription);
  const router = useRouter();
  const count = useRef(10);
  const { payInfo, subscription } = usePayment();
  const { getProfile } = useAuth();
  const { id, type } = router.query;
  const status = type !== 'active-code' ? router.query.status : mapStatus[router.query.status];

  const fetchAndCheck = () => {
    axiosSubscription.get('/user-subscription').then(async (data) => {
      const { last_transaction } = data[0] || {};
      console.log(last_transaction?.id);
      if (last_transaction?.id == id) {
        router.push({ pathname: router.pathname, query: { ...router.query, status: last_transaction.status } });
      } else {
        if (count.current === 0) {
          clearTimeout(timeout);
          return;
        }
        timeout = setTimeout(() => {
          count.current--;
          fetchAndCheck();
        }, 1000);
      }
    });
  };

  const last_transaction = subscription.last_transaction;
  const product = id == last_transaction?.id ? subscription.current_plan : payInfo.product;
  console.log(id == last_transaction?.id);
  const paymentType = id == last_transaction?.id ? last_transaction?.payment_type : payInfo.payment_type;

  const price_active_code = product?.selling_price || product?.origin_price;
  const price =
    id == last_transaction?.id
      ? last_transaction?.total_amount
      : payInfo.sale_info?.after_sale_price || payInfo.product?.selling_price;

  if (!product?.next_expiry_time) product.next_expiry_time = last_transaction.details[0]?.next_expiry_date;

  useEffect(() => {
    if (status === 'pending') {
      timeout = setTimeout(() => {
        fetchAndCheck();
      }, 1000);
    } else {
      setTimeout(() => {
        getProfile();
      }, 2000);
      updateTransactions();
    }
  }, [status]);

  useEffect(() => {
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (!status || !product) return null;

  // cách tính tiền
  // nếu là active thì lây giá hiện tại của gói đó
  // nếu là mua thông qua các hình thức thanh toán

  return (
    <div className="result-payment md:absolute md:left-[50%] md:translate-x-[-50%] px-5 md:px-0 w-screen md:w-full flex flex-col justify-center md:block min-h-[calc(100vh-168px)]">
      <div className="md:max-w-[400px] m-auto md:mt-0">
        <div className="text-center">
          <img className="m-auto" width="64px" src={result[status].icon} />
          <p className={` text-headline-2 md:text-headline-1 md:whitespace-nowrap mt-4 ${result[status].color}`}>{result[status].text}</p>
          <p className="mt-2 text-caption-1 md:text-body-1 mb-6 md:whitespace-nowrap">{result[status].des}</p>
        </div>
        <div className="border-[1px] border-silver rounded-[20px] p-[20px] mt-2">
          <div className="flex justify-between items-center mb-3">
            <p className='text-body-2 md:text-body-1'>Gói sản phẩm</p>
            <p className="text-body-2-highlight md:text-body-1-highlight">{product.name_vi.replace('(package)', '')}</p>
          </div>

          {status !== 'failed' && (
            <div className="flex justify-between items-center mb-3">
              <p className='text-body-2 md:text-body-1'>Sử dụng đến</p>
              <p className="text-body-2-highlight md:text-body-1-highlight ">{parseDateTime(product?.next_expiry_time)}</p>
            </div>
          )}
          <div className="flex justify-between items-center mb-3">
            <p className='text-body-2 md:text-body-1'>Thanh toán qua</p>
            <p className="text-body-2-highlight md:text-body-1-highlight ">{getNameMethod[paymentType]}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className='text-body-2 md:text-body-1'>{status === 'voucherSuccess' ? 'Giá tiền' : 'Tổng thanh toán'}</p>
            <p className="text-body-2-highlight md:text-body-1-highlight ">{currencyFormat(status === 'voucherSuccess' ? price_active_code : price)}đ</p>
          </div>
        </div>
        {status === 'succeed' || status === 'voucherSuccess' || status === 'pending' ? (
          <div className="flex justify-between md:mt-10 w-full fixed md:static bottom-0 left-0 px-5 py-3 border-t-[1px] md:border-t-0 border-silver">
            <Button
              onClick={() => {
                router.push({ pathname: router.pathname, query: 'tab=history-payment' });
              }}
              type="outline"
              className="ml-0 w-full mr-2 whitespace-nowrap"
            >
              Lịch sử thanh toán
            </Button>
            <Button
              onClick={() => {
                router.push({ pathname: '/learning-path' });
              }}
              className="ml-2 whitespace-nowrap w-full"
            >
              Màn hình chính
            </Button>
          </div>
        ) : (
          <div
            className="flex justify-between md:mt-20 w-full fixed md:static bottom-0 left-0 px-5 py-3 border-t-[1px] md:border-t-0 border-silver"
            onClick={() => {
              router.push({ pathname: router.pathname, query: 'tab=payment&step=methods' });
            }}
          >
            <Button className="ml-0 min-w-[188px] w-full md:with-auto whitespace-nowrap">Quay lại</Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default React.memo(Result);
