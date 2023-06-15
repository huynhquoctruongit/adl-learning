const clx = {
  active: 'bg-purple-light shadow-payment-active',
  default: 'bg-white shadow-payment-default'
};

const MethodList = ({ list, value, onChange }) => {
  return (
    <div className="flex justify-center mx-[-8px]">
      {list.map((item, index) => {
        const inClass = value === item.id ? 'active' : 'default';
        const className = 'mx-2 ease-in-out relative cursor-pointer ';
        return (
          <div
            className={className}
            key={item.id + 'payment' + index}
            onClick={() => {
              onChange(item);
            }}
          >
            <div className={'p-3 duration-200 transition-all rounded-xl ' + clx[inClass]}>
              <img src={'/images/payment/' + item.icon} className="w-20 h-20 md:w-24 md:h-24" alt="" />
            </div>
            <div className="flex font-semibold text-base justify-center mt-2">
              <span>{item.text}</span>
            </div>
            <div className="flex mt-1 item-center"></div>
          </div>
        );
      })}
    </div>
  );
};
export default MethodList;
