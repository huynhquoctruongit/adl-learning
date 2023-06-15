import Button from '@/components/common/button/basic';
import { useRouter } from 'next/router';
const PopupPackage = ({ type, toggle, setOpen }) => {
  const router = useRouter();

  return (
    <div className="rounded-[20px] bg-white p-[32px] rounded max-w-[400px]">
      <div className="m-auto text-center">
        <img className="m-auto" src="/icons/writing-hand.png" width="40px"></img>
        <p className="text-headline-2 my-3">Gia sư AI đang soạn bài</p>
        <p className="text-body-2 mb-4">Nội dung mới sẽ sớm được cập nhật, bạn kiên nhẫn đợi nhé!</p>
      </div>
      <div>
        <Button onClick={setOpen} size="full" type="default" className="ml-0 mt-4 text-body-2-highlight  ">
          Đã hiểu
        </Button>
      </div>
    </div>
  );
};
export default PopupPackage;
