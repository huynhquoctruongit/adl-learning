import { motion } from 'framer-motion';
export const Label = ({ children, required, id, ...rest }) => {
  return (
    <div className="">
      <label htmlFor={id} className="mb-2 text-black block text-caption-1" {...rest}>
        {children} {required && <span className="text-negative">*</span>}
      </label>
    </div>
  );
};
