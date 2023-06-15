import { useState } from 'react';

export function useModal() {
  const [isShow, setShow] = useState(false);
  const toggle = () => {
    setShow((show) => !show);
  };

  return [isShow, toggle, setShow];
}
