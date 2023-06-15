import { currencyFormat } from '@/service/helper';
import { PopularBottomIcon, PopularIcon } from '../icons';

const clx = {
  active: 'bg-purple-light shadow-payment-active',
  default: 'bg-white shadow-payment-default'
};

const pricePerMonth = {
  0: '49.000đ',
  1: '66.000đ'
};

const ListProduct = ({ list, value, onChange }) => {
  return (
    <div className="">
      {list.map((item, index) => {
        const inClass = value === item.id ? 'active' : 'default';
        const className =
          'p-5 w-full md:w-[24.5rem] duration-200 ease-in-out mb-5 transition-all rounded-lg relative cursor-pointer ' +
          clx[inClass];
        return (
          <div
            className={className}
            key={item.id + 'payment' + index}
            onClick={() => {
              onChange(item);
            }}
          >
            {index === 0 && (
              <div className="flex mb-2">
                <div className="ml-auto md:font-semibold md:text-base text-caption-1-highlight uppercase text-negative">Số lượng có hạn</div>
              </div>
            )}

            <div className="flex md:font-semibold tmd:ext-lg items-center text-body-1-highlight">
              <span>{item.name_vi.replace('(package)', '')}</span>
              <span className="ml-auto text-body-1-highlight">{currencyFormat(item.selling_price)}</span>
              {item.tag_discount_percent && item.tag_discount_percent !== 0 && (
                <span className="rounded-full bg-negative text-white px-1 py-0 ml-2 h-fit text-caption-1-highlight">
                  -{item.tag_discount_percent}%
                </span>
              )}
            </div>
            {item.tag_discount_percent !== 0 && (
              <div className="flex mt-1 item-center">
                <span className="text-purple text-body-2-highlight">Chỉ {pricePerMonth[index]}/tháng</span>
                <span className="ml-auto text-gray line-through	text-body-2">{currencyFormat(item.origin_price)}đ</span>
              </div>
            )}

            {index === 0 && (
              <div className="absolute top-[1.25rem] left-[-8px]">
                <div className="absolute top-[50%] lef-0 translate-y-[-50%]">
                  <PopularIcon />
                  <PopularBottomIcon className="absolute top-full lef-0" />
                </div>
                <div className="relative z-10  pl-4 pr-7 md:font-semibold text-white text-body-2-highlight">Phổ biến nhất</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default ListProduct;
