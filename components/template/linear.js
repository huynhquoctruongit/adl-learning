import { useRouter } from 'next/router';
import Slide from '../layouts/slide-menu';
const ThemeMenuUnit = ({ children, theme }) => {
  const router = useRouter();
  const { id, type } = router.query;
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row pt-0 lg:pt-10">
        <div className="w-full lg:w-fit z-10 sticky top-20 lg:top-0 lg:relative">
          <Slide active={type || id} />
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default ThemeMenuUnit;
