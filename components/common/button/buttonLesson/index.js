import React from 'react';

const Button = ({ children, ...rest }) => {
  const onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (rest.onClick) rest.onClick(event);
  };
  return (
    <button
      onClick={onClick}
      className="custom-border border-2 py-1.5 px-3 rounded-md hover:text-white transition-all ease-in-out duration-300"
    >
      <span>{children}</span>
    </button>
  );
};
export default Button;
