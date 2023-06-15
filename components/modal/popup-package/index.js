import Button from '@/components/common/button/basic';
import { useRouter } from 'next/router';
const PopupPackage = ({ type, toggle, setOpen }) => {
  const router = useRouter();
  const result = {
    trial: {
      color: 'text-positive',
      text: 'Dùng thử 7 ngày miễn phí',
      titleButton: 'Bắt đầu dùng thử',
      queryUrl: 'tab=payment',
      des: 'Trải nghiệm toàn bộ nội dung bài học và hơn 5000+ bài tập kèm lời giải.',
      icon: '/icons/waving-hand_1f44b.png'
    },
    expires: {
      color: 'text-negative',
      text: 'Đã hết hạn dùng thử',
      titleButton: 'Nâng cấp ngay',
      queryUrl: 'tab=payment',
      des: 'Nâng cấp ngay trải nghiệm toàn bộ nội dung bài học và hơn 5000+ bài tập.',
      icon: '/images/sos.png'
    },
    upgrade: {
      color: 'text-negative',
      text: 'Nâng cấp ngay',
      titleButton: 'Nâng cấp ngay',
      queryUrl: 'tab=payment',
      des: 'Nâng cấp ngay trải nghiệm toàn bộ nội dung bài học và hơn 5000+ bài tập.',
      icon: '/images/gift.png'
    }
  };
  return (
    <div className=" bg-purple-medium p-[32px] rounded max-w-[400px]">
      <div className="m-auto text-center">
        <img className="m-auto" src={result[type].icon} width="40px"></img>
        <p className="text-headline-2 text-white my-3">{result[type].text}</p>
        <p className="text-body-2 text-white mb-4">{result[type].des}</p>
      </div>
      {type === 'trial' ? (
        <div>
          <Button onClick={setOpen} size="full" type="yellow" className="ml-0 mt-4 text-body-2-highlight  ">
            {result[type].titleButton}
          </Button>
          <p
            onClick={() => {
              router.push({ pathname: '/account', query: result[type].queryUrl });
            }}
            className="text-center mt-3 text-yellow text-body-2-highlight cursor-pointer"
          >
            Tìm hiểu thêm
          </p>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="w-full">
            <Button
              onClick={() => {
                router.push({ pathname: '/account', query: result[type].queryUrl });
              }}
              type="yellow"
              size="full"
              className="ml-0 mt-4 bg-yellow text-black text-body-2-highlight hover:bg-yellow-medium"
            >
              {result[type].titleButton}
            </Button>
            <p className="text-center mt-3 min-w-[100px] text-white text-caption-2-highlight">Chỉ từ 49.000đ/ tháng</p>
          </div>
          <p
            onClick={setOpen}
            className="text-center mt-6 min-w-[100px] text-yellow text-body-2-highlight cursor-pointer"
          >
            Để sau
          </p>
        </div>
      )}
    </div>
  );
};
export default PopupPackage;
