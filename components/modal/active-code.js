import axiosSubscription from '@/api/base/axios-supscription';
import { usePayment } from '@/context/subscription';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import Button from '../common/button/basic';
import Input from '../forms/input/index';

const ActiveCode = ({ toggle }) => {
  const code = useRef('');
  const router = useRouter();
  const onChange = (event) => {
    const value = event.target.value;
    setMessage([]);
    code.current = value;
  };
  const [message, setMessage] = useState([]);
  const { mutateSub, updatePaymentInfo } = usePayment();
  const submit = async () => {
    const voucher = code.current.trim();
    if (!voucher) {
      setMessage(['error', 'Vui lòng nhập mã kích hoạt']);
      return;
    }
    const body = {
      active_code: voucher
    };
    try {
      const transation = await axiosSubscription.post('/active-code', body);
      if (transation.status === 'succeed') {
        await mutateSub();
        router.push('/account?tab=payment&step=result&status=voucherSuccess&id=' + transation.id);
      }
    } catch (error) {
      const messageError = error?.response?.data?.message;
      setMessage(['error', messageError || 'Mã kích hoạt không đúng hoặc đã hết hạn']);
    }
  };
  return (
    <div className="bg-white p-8 w-full md:w-[25rem] rounded-[20px]">
      <div className="flex justify-center">
        <img src="/icons/gift.png" className="w-12" alt="load image fail" />
      </div>
      <div className="text-headline-3 mt-3 mb-4 text-center">Nhập mã kích hoạt</div>
      <Input placeHolder={'Nhập mã kích hoạt tại đây'} onChange={onChange} type={message[0]} message={message[1]} />
      <div className="flex justify-between mt-6">
        <Button typehtml={'submit'} size="full" onClick={toggle} type="outline" className="ml-0 mr-2">
          Hủy
        </Button>
        <Button typehtml={'submit'} size="full" onClick={submit} type="default" className="ml-2">
          Áp dụng
        </Button>
      </div>
    </div>
  );
};

export default ActiveCode;
