import { useAuth } from '@/hooks/use-auth';
import { Tracker } from '@/libs/tracking';

const Welcome = ({ welcomeAction }) => {
  const { profile, updateProfile } = useAuth();
  const duration = profile.estimated_date ? profile.estimated_date - Math.floor(new Date().getTime() / 1000) : 0;
  const month = duration > 0 ? Math.floor(duration / 2628000) : 0;
  const day = duration > 0 ? Math.ceil((duration % 2628000) / 86400) : 0;
  const onSubmit = () => {
    Tracker.send({ action: 'clicked', event: 'submit', category: 'onboard' });
    updateProfile({ current_step: 4 });
    return true;
  };
  welcomeAction(onSubmit);
  const listItem = [
    {
      id: 'lesson',
      icon: '/images/icon/ADT-icon-book.png'
    },
    {
      id: 'video',
      icon: '/images/icon/ADT-icon-play.png'
    },
    {
      id: 'test',
      icon: '/images/icon/Subtract.png'
    },
    {
      id: 'exam',
      icon: '/images/icon/ADT-icon-pen.png'
    }
  ];
  if (!profile.estimated_date) return null;
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold mb-6 hidden md:flex">
        Hoàn tất <img className="ml-2 w-10 -translate-y-2" src="/icons/party-popper.png" />
      </h2>
      <p className="text-caption-1">
        Chào mừng bạn đến với <span className="text-purple md:text-yellow font-semibold">Gia sư AI</span>
      </p>
      <div className="md:mt-6 mt-[20px] bg-purple-light p-6 rounded-xl">
        <h3 className="text-xl font-bold text-center">
          Mục tiêu đạt <span className="text-highlight-red">{profile.target_score} điểm</span>
        </h3>
        <div className="date-target flex justify-between mt-4">
          <div className="date-month flex items-center flex-col p-3 bg-white flex-grow mr-2 rounded-xl">
            <p className="text-6xl font-semibold">{month}</p>
            <p className="text-xl font-semibold">tháng</p>
          </div>
          <div className="date-month flex items-center flex-col p-3 bg-white flex-grow ml-2 rounded-xl">
            <p className="text-6xl font-semibold">{day}</p>
            <p className="text-xl font-semibold">ngày</p>
          </div>
        </div>
        <div className="lesson-line mt-4 grid grid-cols-2 gap-2">
          {listItem.map((item, index) => (
            <div key={index} className="lesson-line-item flex items-center">
              <img className="w-6" src={item.icon} />
              <p className="ml-2 font-light">
                {item.id === 'lesson'
                  ? '12 chương'
                  : item.id === 'video'
                  ? '32 video'
                  : item.id === 'test'
                  ? '57 bài'
                  : item.id === 'exam' && '1500+ bài tập'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Welcome;
