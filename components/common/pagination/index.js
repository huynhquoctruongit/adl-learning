import Button from '../button/basic';
const Pagination = ({ total, size, current, onChange, className }) => {
  const page = Math.ceil(total / size);
  const list = [];
  for (let index = 0; index < page; index++) {
    list.push(index);
  }
  return (
    <div className={"w-full  " + className}>
      {list.map((item, index) => {
        const type = index === current ? '' : 'outline';
        return (
          <Button
            key={'pagination' + index}
            className={'w-10 h-10 inline-flex items-center justify-center border-[1px]  mx-2 '}
            type={type}
            onClick={() => {
              onChange(index);
            }}
          >
            {item + 1}
          </Button>
        );
      })}
    </div>
  );
};

export default Pagination;
