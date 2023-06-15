import { useRouter } from 'next/router';
import useSWR from 'swr';
import Slide from '@/components/layouts/slide-practice';
const option = {
  dedupingInterval: 60 * 60 * 1000, // 1hr
  revalidateOnFocus: false
};
const PracticeTheme = ({ children, theme }) => {
  const router = useRouter();
  const { type, question } = router.query;
  const { data } = useSWR(
    type ? `/questions/?populate=answer&filters[question_type][question_type_uuid]=${type}&pagination[pageSize]=1000` : null,
    option
  );
  const menu = data?.data || [];
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row pt-0 lg:pt-10">
        <div className="w-full lg:w-fit z-10 sticky top-20 lg:top-0 lg:relative">
          <Slide data={menu} questionid={question} />
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default PracticeTheme;
