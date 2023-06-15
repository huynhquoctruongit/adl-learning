import { tagRole } from '@/service/map';
const TagPackage = ({ type }) => {
  return (
    <div
      className={`${tagRole?.[type]?.color} w-fit text-caption-2-highlight whitespace-nowrap xl:text-caption-1-highlight border-[1px] px-[10px] pt-[2px] rounded-full`}
    >
      {tagRole?.[type]?.text}
    </div>
  );
};
export default TagPackage;
