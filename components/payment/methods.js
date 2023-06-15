import { currencyFormat } from '@/service/helper';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import axiosSubscription, { fetchSubscription } from '@/api/base/axios-supscription';
import { usePayment } from '@/context/subscription';
import MethodList from './partial/list-method';
import Button from '../common/button/basic';
import Input from '../forms/input/index';
import ModalView from '../common/modal/template';
import { useModal } from '@/hooks/use-modal';
import useSWR from 'swr';

const methods = [
  // { id: 'momo', icon: 'momo.png', text: 'MoMo' },
  { id: 'payoo', icon: 'payoo.png', text: 'Payoo' }
  // { id: 'asiapay', icon: 'visa.png', text: 'Thẻ tín dụng' }
];

const Methods = () => {
  const { payInfo, checkPromotion, cancelCode, addPromotion, resetPromotion, updatePaymentInfo, mutateSub } =
    usePayment();
  const [voucher, setVoucher] = useState('');
  const [message, setMessage] = useState({});
  const [method, setMethod] = useState(methods[0]);
  const [open, toggle, setLoading] = useModal();
  const refInput = useRef();
  const router = useRouter();
  const { pathname, query } = router;
  const { data, error } = useSWR('/payment-type', fetchSubscription);
  const prev = () => {
    router.push({ pathname, query: { ...query, step: 'products' } });
  };
  const pushStep = async (params) => {
    await mutateSub();
    router.push({ pathname, query: { ...query, ...params } });
  };

  const onChange = (item) => {
    setMethod(item);
  };

  const voucherChange = (event) => {
    setVoucher(event.target.value);
    setMessage({});
  };
  const submitVoucher = async () => {
    if (voucher.length > 0) {
      setMessage({});
      const data = await checkPromotion(voucher, method.id);
      setMessage(data);
    } else {
      setMessage({ type: 'error', message: 'Vui lòng nhập mã giảm giá' });
    }
  };
  const cancelVoucher = async () => {
    try {
      await axiosSubscription.post('/cancel-promo-code', {
        request_id: payInfo.sale_info.request_id
      });
    } catch (error) {
      const result = error.response?.data;
      // Thông báo lỗi
    }
    refInput.current.value = '';
    cancelCode();
    setVoucher('');
    setMessage({});
  };

  const submit = async () => {
    const return_url = window.location.origin + window.location.pathname + '?tab=payment&step=result';
    const body = {
      request_id: payInfo.request_id,
      details: payInfo.details,
      return_url: return_url,
      promo_code: payInfo.promo_code,
      payment_type: method.id
    };
    updatePaymentInfo(body);
    if (!payInfo.promo_code) {
      delete body.request_id;
      delete body.promo_code;
    }
    delete body.id;
    setLoading(true);
    setTimeout(() => {
      handleSub(body);
    }, 0);
  };
  const handleSub = async (body) => {
    const { payment_type } = body;
    const qs = (params) => {
      return Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join('&');
    };

    try {
      const transaction = await axiosSubscription.post('/add-subscription', body);
      addPromotion();
      if (transaction?.status === 'succeed') {
        resetPromotion();
        pushStep({ step: 'result', status: 'succeed', id: transaction.id });
        return;
      }
      if (transaction?.status === 'failed') {
        pushStep({ step: 'result', status: 'failed', id: transaction.id });
        return;
      }
      if (payment_type === 'asiapay') {
        const query = qs(transaction.gateway_data);
        if (query) {
          window.location.href = transaction.pay_url + '?' + query;
        } else {
          resetPromotion();
          pushStep({ step: 'result', status: 'succeed', id: transaction.id });
        }
      } else {
        if (transaction?.pay_url) window.location.href = transaction.pay_url;
        else {
          pushStep({ step: 'result', status: 'succeed', id: transaction.id });
        }
      }
    } catch (error) {
      const result = error.response?.data;
      if (result?.message?.includes('request_id')) {
        await cancelCode();
        resetPromotion();
        checkPromotion();
      }
      pushStep({ step: 'result', status: 'failed' });
    }
  };
  const after_sale_price = currencyFormat(payInfo.sale_info?.after_sale_price || payInfo.product?.selling_price || 0);
  const discount_price = '- ' + currencyFormat(payInfo.sale_info?.discount_price || '');
  useEffect(() => {
    window.addEventListener('pageshow', function (event) {
      var routerTraversal =
        event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
      if (routerTraversal) {
        setLoading(false);
      }
    });
  }, []);
  const onKeyDown = (event) => {
    const keyCode = event.which || event.keyCode;
    if (keyCode === 13) {
      submitVoucher();
    }
    if (keyCode === 8) {
      setMessage({});
    }
  };

  const discount_price_number = payInfo.sale_info?.after_sale_price;
  const isDiscount = discount_price_number || discount_price_number === 0;
  const product = payInfo.product;
  return (
    <React.Fragment>
      <ModalView
        open={open}
        toggle={() => {
          setLoading(false);
        }}
        disableClose
      >
        <img src="/icons/pending.png" className="w-[128px] h-[128px]" alt="" />
      </ModalView>
      <div className="md:absolute md:left-[50%] md:translate-x-[-50%]">
        <div className="flex flex-col min-h-[31.25rem] md:min-w-[24.5rem] mt-6 md:mt-18 w-full">
          <div className="mb-6 md:mb-8">
            <MethodList list={methods} onChange={onChange} value={method?.id} />
          </div>

          <div className="">
            <div className="flex">
              <Input
                disabled={!payInfo?.sale_info ? false : true}
                defaultValue={payInfo.sale_info?.promo_code || voucher}
                onChange={voucherChange}
                placeholder="Nhập mã khuyến mãi"
                onKeyDown={onKeyDown}
                classParent="w-full"
                className="font-medium text-sm"
                type={message?.type}
                message={message?.message}
                refInput={refInput}
              />
              <div>
                <Button
                  type="yellow"
                  size="size"
                  className="whitespace-nowrap"
                  onClick={!payInfo.sale_info ? submitVoucher : cancelVoucher}
                >
                  {!payInfo.sale_info ? 'Áp dụng' : 'Xóa mã'}
                </Button>
              </div>
            </div>
          </div>
          <div className="bill mt-8">
            {product?.name_vi && (
              <div className="flex">
                <div className="name">Gói sản phẩm:</div>
                <div className="ml-auto">{product?.name_vi}</div>
              </div>
            )}

            <div className={'flex mt-3 ' + (!isDiscount > 0 ? 'font-semibold' : '')}>
              <div className="">Giá tiền:</div>
              <div className={'ml-auto font-semibold ' + (!isDiscount > 0 ? 'text-positive' : '')}>
                {currencyFormat(payInfo.product?.selling_price)}đ
              </div>
            </div>

            {isDiscount && (
              <div className={'flex mt-3 '}>
                <div className="">Giảm giá:</div>
                <div className={'ml-auto font-semibold'}>{discount_price}đ</div>
              </div>
            )}
            {isDiscount > 0 && (
              <div className="flex mt-3 font-semibold">
                <div className="">Tổng thanh toán:</div>
                <div className={'ml-auto font-semibold ' + (isDiscount >= 0 ? 'text-positive' : '')}>
                  {payInfo.sale_info?.after_sale_price === 0 ? '0' : after_sale_price}đ
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between md:mt-auto w-full fixed md:static bottom-0 left-0 px-5 py-3 md:p-0 border-t-[1px] md:border-t-0 border-silver">
            <Button typehtml={'submit'} onClick={prev} type="outline" className="ml-0 mr-2 md:w-full">
              Quay lại
            </Button>
            <Button typehtml={'submit'} size="full" onClick={submit} type="default" className="ml-2">
              Thanh toán
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Methods;
