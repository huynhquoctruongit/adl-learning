const Tooltip = ({ className, content }) => {
  if (!content) return null;
  return (
    <div className="relative flex items-center group">
      <img src="/icons/help-circle.png" className={`w-[14.67px] h-[14.67px] ml-[4.67px] ${className}`} />
      <div className="absolute bottom-0 hidden items-center top-1/2 mb-[5px] ml-[2.25rem] group-hover:flex min-w-[300px] z-50">
        <div className="w-fit z-10 shadow-box p-[12px] text-xs leading-none text-white mb-[10px] bg-[#383838] shadow-lg rounded-[12px]">
          <div className="shape-triangle-left-tooltip"></div>
          <p className="text-caption-1">{content}</p>
        </div>
      </div>
    </div>
  );
};
export default Tooltip;
