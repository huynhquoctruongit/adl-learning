import Button from '@/components/common/button/basic';

const Login = () => {
 
  return (
    <div>   
      <div className="shadow-box p-[20px] md:p-10 min-h-[calc(100vh)] flex items-center justify-center bg-purple-medium md:bg-[url(/images/bg-onboarding.svg)] bg-cover">
        <div className="bg-white rounded-xl h-[480px] flex">
          {/* <div className="left w-[200px] bg-purple-light rounded-r-none rounded-xl"></div> */}
          <div className="right p-8 rounded-xl max-w-[400px] flex flex-col">
            <img src="/images/logo.svg" alt="logo" className="w-[94px]" />
            <p className="font-bold text-xl mt-6">Học theo lộ trình cá nhân, phát huy sở trường, nâng cao điểm số</p>
            <div className="list mt-4">
              <div className="item flex mb-[10px]">
                <img src="/icons/Union.svg" alt="icon" className="mr-2 flex-shrink" />
                <p className="text-sm">Thiết lập mục tiêu học tập</p>
              </div>
              <div className="item flex items-center mb-[10px]">
                <img src="/icons/Union.svg" alt="icon" className="mr-2 flex-shrink" />
                <p className="text-sm">Lộ trình học tập được thiết kế cá nhân hoá riêng cho bạn </p>
              </div>
              <div className="item flex mb-[10px]">
                <img src="/icons/Union.svg" alt="icon" className="mr-2 flex-shrink" />
                <p className="text-sm">Tối ưu theo mục tiêu học tập</p>
              </div>
              <div className="item flex mb-[10px]">
                <img src="/icons/Union.svg" alt="icon" className="mr-2 flex-shrink" />
                <p className="text-sm">Kiểm tra đánh giá chi tiết năng lực học tập</p>
              </div>
            </div>
            <Button
              className=" w-full text-white px-4 py-2 mt-auto ml-0"
              onClick={() => {
                window.location.href =
                  process.env.API_INTERACTION + '/interaction/public/login?fe_callback_url=' + window.location.origin;
              }}
            >
              Đăng nhập
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden md:block img fixed top-5 left-5">
        <img src="/images/ican_logo.svg" alt="" />
      </div>
    </div>
  );
};
export default Login;
Login.permission = 'public';
