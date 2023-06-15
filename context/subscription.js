import useSWR from 'swr';
import React, { useEffect, useState, useRef } from 'react';
import axiosSubscription, { fetchSubscription } from '@/api/base/axios-supscription';
import { useRouter } from 'next/router';
const PaymentContext = React.createContext({});
// model = {request_id, promo_code, client, details: {plan, quantity}}

const parseJON = (json) => {
  let result = {};
  try {
    result = JSON.parse(json) || {};
  } catch (error) {}
  return result;
};

const getTypeUser = (sub) => {
  if (!sub) return 'new-user';
  if (sub.is_active) return 'active-user';
  if (!sub.is_active) return 'expired-user';
  return 'type-user';
};

let timmer = null;

const PaymentProvider = ({ children }) => {
  const { data: prod } = useSWR('/products', fetchSubscription);
  const { data: subscription, mutate, error: error_sub } = useSWR('/user-subscription', fetchSubscription);
  const { query } = useRouter();
  const localPayment = window.localStorage.getItem('payment');

  // flow return website when user not purechase
  // if field isAddSubscription = true mean user added subscription, so request_id was invalidate
  // when buy succeed or fail
  // we must delete object payment
  const initPayment = parseJON(localPayment);
  if (!initPayment.promo_code || initPayment.isAddSucription) initPayment.sale_info = null;
  const products = (prod?.[0]?.plans || [])
    .filter((item) => item.type === 'package')
    .sort((a, b) => (a.selling_price > b.selling_price ? -1 : 1));
  const [payInfo, setPayInfo] = useState(initPayment);
  const refPayInfo = useRef();
  const plan = products?.find((element) => element.id === payInfo.id);
  const id = plan?.id;

  const updatePaymentInfo = async (payload) => {
    setPayInfo((info) => ({ ...info, request_id: payInfo.info, ...payload }));
  };
  const checkSubscription = () => {};
  const updateCode = (code) => {
    setPayInfo({ ...payInfo, promo_code, code });
  };
  const cancelCode = () => {
    const params = { ...payInfo, promo_code: '', sale_info: null };
    delete params.promo_code;
    setPayInfo(params);
  };

  const addPromotion = () => {
    setPayInfo((temp) => ({ ...temp, isAddSucription: true }));
  };
  const resetPromotion = () => {
    setPayInfo({});
  };

  const checkPromotion = async (code, method) => {
    const body = {
      promo_code: code,
      details: [{ plan: id, quantity: 1 }],
      payment_type: method,
      request_id: payInfo.request_id
    };
    try {
      const data = await axiosSubscription.post('/check-promotion', body);
      if (data) {
        setPayInfo({
          ...payInfo,
          request_id: data.request_id,
          sale_info: data,
          promo_code: data.promo_code,
          error: null
        });
        return { type: 'success', message: 'Áp dụng mã khuyến mãi thành công' };
      }
    } catch (error) {
      const data = error?.response?.data;
      setPayInfo({
        ...payInfo,
        error: data || '',
        sale_info: null
      });
      return { type: 'error', message: data?.message || 'Mã khuyến mãi không đúng hoặc đã hết hạn' };
    }
  };
  useEffect(() => {
    window.localStorage.setItem('payment', JSON.stringify(payInfo));
  }, [payInfo]);
  refPayInfo.current = payInfo;
  const typeUser = getTypeUser(subscription && subscription[0]);

  useEffect(() => {
    (() => {
      timmer = setTimeout(async () => {
        if (query.status !== 'failed') return;
        if (refPayInfo.current.isAddSucription && refPayInfo.current.request_id) {
          const paymentInfo = { ...refPayInfo.current };
          try {
            await axiosSubscription.post('/cancel-promo-code', {
              request_id: paymentInfo.request_id
            });
          } catch (error) {}
          delete paymentInfo.isAddSucription;
          delete paymentInfo.request_id;
          delete paymentInfo.sale_info;
          delete paymentInfo.promo_code;
          setPayInfo(paymentInfo);
        }
      }, 3000);
    })();

    return () => {
      clearTimeout(timmer);
    };
  }, []);

  const fistloading = subscription === undefined && error_sub === undefined;
  if (fistloading) return null;

  const value = {
    products,
    payInfo,
    updatePaymentInfo,
    checkSubscription,
    updateCode,
    checkPromotion,
    cancelCode,
    addPromotion,
    resetPromotion,
    subscription: subscription ? subscription[0] : null,
    mutateSub: mutate,
    typeUser
  };
  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};
export const usePayment = () => {
  const value = React.useContext(PaymentContext);
  return value;
};

export default PaymentProvider;
