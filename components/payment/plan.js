import { usePayment } from '@/context/subscription';
import { parseDateTime } from '@/service/helper';
import { useRouter } from 'next/router';
import Button from '../common/button/basic';

import { TickProfile } from '../icons';
import { InformationIcon, WarningIcon } from './icons';
const data = [
  { text: '5000+ bài tập kèm lời giải chi tiết' },
  { text: 'Gợi ý luyện tập thông minh' },
  { text: 'Báo cáo tiến độ học tập cơ bản' },
  { text: '50+ video lý thuyết ', opacity: true },
  { text: '50+ video phương pháp giải', opacity: true },
  { text: '200+ bài đọc lý thuyết trọng tâm', opacity: true },
  { text: 'Phân tích điểm mạnh, điểm yếu', opacity: true }
];
const Plan = ({ }) => {
  const { subscription, typeUser } = usePayment();
  const { is_active } = subscription || {};
  const { next_expiry_date } = subscription?.last_transaction?.details[0] || {};
  const { name_vi } = subscription?.current_plan || {};
  const clx_active = is_active ? 'bg-information-light border-information' : 'bg-critical-light border-critical';
  return (
    <div className="mb-[64px] p-5 md:p-0 md:mb-0">
  
      {subscription && (
        <div className="rounded-xl p-5 border-[1px] border-silver md:mb-8">
          <div className="flex justify-between items-center mb-2 md:mb-3">
            <p className='text-body-2 md:text-body-1'>Gói sản phẩm:</p>
            <p className={'text-body-2-highlight md:text-body-1-highlight'}>{name_vi}</p>
          </div>
          <div className="flex flex-nowrap justify-between items-center">
            <p className='text-body-2 md:text-body-1 whitespace-nowrap'>Sử dụng đến:</p>
            <p className={'text-body-2-highlight md:text-body-1-highlight whitespace-nowrap ' + (typeUser === 'expired-user' ? 'text-negative' : '')}>
              {parseDateTime(next_expiry_date)}{typeUser === 'expired-user' && '(hết hạn)'}
            </p>
          </div>
          <div className={'rounded-lg mt-5 text-caption-1 md:text-base flex items-center border-[1px]  font-medium px-2.5 py-3 ' + clx_active}>
            <div className='w-5 mr-2.5'>
              {is_active && <InformationIcon />}
              {!is_active && <WarningIcon />}
            </div>
            {is_active && 'Thời hạn sử dụng sẽ được cộng dồn khi bạn mua thêm gói.'}
            {!is_active && 'Gói của bạn đã hết hạn, gia hạn để tiếp tục sử dụng nhé.'}
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:mt-0">
        <div className="min-w-[14rem] p-6 rounded-xl border-[1px] border-silver order-2 md:order-1">
          <div className="text-gray text-xl font-bold ">CƠ BẢN</div>
          <div className="text-2xl font-bold mt-2 mb-4">Miễn phí</div>
          <hr />
          <div className="mt-4">
            {data.map((element) => (
              <div key={element.text + 'left'} className={'flex my-2.5 ' + (element.opacity ? 'opacity-25' : '')}>
                <TickProfile className="" />
                <span className="ml-2.5 text-sm font-medium">{element.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="order-1 md:order-2 min-w-[14rem] my-4 md:my-0 p-6 rounded-xl border-[2px] border-purple md:ml-6 bg-purple-light relative">
          <div className="text-purple text-xl font-bold ">NÂNG CAO</div>
          <div className="text-xl text-medium mt-2 mb-4">
            Chỉ từ <span className="text-2xl font-bold"> 49.000đ</span>/ tháng
          </div>
          <hr />
          <div className="mt-4">
            {data.map((element) => (
              <div className={'flex my-2.5'} key={element.text + 'right'}>
                <TickProfile className="" />
                <span className="ml-2.5 text-sm font-medium">{element.text}</span>
              </div>
            ))}
          </div>
          <BuyButton className="mt-4" />
          <div className="rounded-b-lg text-white px-2.5 py-0.5 bg-negative font-semibold absolute right-6 top-0">
            Giá ưu đãi
          </div>
        </div>
      </div>
      <div className="md:hidden w-full px-5 py-3 border-t-[1px] border-silver fixed bottom-0 left-0 bg-white">
        <BuyButton />
      </div>
    </div>
  );
};
export default Plan;


const BuyButton = () => {
  const router = useRouter();
  const { typeUser } = usePayment();
  return (<Button
    size="full"
    className="ml-0"
    onClick={() => {
      router.push({ pathname: router.pathname, query: { ...router.query, step: 'products' } });
    }}
  >
    {typeUser === 'expired-user'
      ? 'Gia hạn gói'
      : typeUser === 'active-user'
        ? 'Mua thêm gói'
        : 'Nâng cấp ngay'}
  </Button>)
}
