import { usePayment } from '@/context/subscription';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from '../common/button/basic';
import ListProduct from './partial/list-product';
const Plan = ({ products }) => {
  const { updatePaymentInfo } = usePayment();
  const [select, setSelect] = useState(products[0]);
  const router = useRouter();
  const onChange = (item) => {
    setSelect(item);
  };
  const { query, pathname } = router;
  const prev = () => {
    router.push({ pathname, query: { ...query, step: 'plan' } });
  };
  const next = () => {
    const body = {
      details: [{ plan: select.id, quantity: 1 }],
      id: select.id,
      prevPage: history.pathname,
      product: select
    };
    updatePaymentInfo(body);
    router.push({ pathname, query: { ...query, step: 'methods' } });
  };
  return (
    <div className="md:absolute md:left-[50%] md:translate-x-[-50%] w-screen md:w-fit p-5 mt-1 md:mt-0 md:px-0">
      <ListProduct list={products} onChange={onChange} value={select?.id} />
      <div className="flex justify-between md:mt-14 w-full fixed md:static bottom-0 left-0 px-5 py-3 border-t-[1px] md:border-t-0 border-silver">
        <Button typehtml={'submit'} onClick={prev} type="outline" className="ml-0 mr-2 md:w-full">
          Quay lại
        </Button>
        <Button typehtml={'submit'} size="full" onClick={next} type="default" className="ml-2">
          Thanh toán
        </Button>
      </div>
    </div>
  );
};

const WrapPlan = (props) => {
  const { products } = usePayment();
  if (products.length > 0) return <Plan {...props} products={products} />;
  else return null;
};

export default WrapPlan;
