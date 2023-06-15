import { createContext, useContext, useRef, useState } from 'react';
import Toast from '@/components/common/toast';
const ToastContext = createContext({});

const ToastProvider = ({ children }) => {
  const timmer = useRef();
  const toast_ = useRef();
  const [toast, setToast] = useState({
    show: false,
    status: '',
    message: '',
    time: 3000
  });
  toast_.current = toast;

  const toggleToast = async (data) => {
    clearTimeout(timmer.current);
    if (toast_.current.show) {
      setToast((state) => ({ ...state, show: false }));
      timmer.current = setTimeout(() => {
        toggleToast(data);
      }, 500);
      return;
    }
    const temp = { ...data };
    if (!temp.time) temp.time = 5000;
    setToast(temp);
    timmer.current = setTimeout(() => {
      setToast((state) => ({ ...state, show: false }));
    }, temp.time);
  };

  const onClose = () => {
    clearTimeout(timmer.current);
    setToast((state) => ({ ...state, show: false }));
  };

  return (
    <ToastContext.Provider value={{ setToast, toggleToast }}>
      {children}
      <Toast toast={toast} onClose={onClose} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const toast = useContext(ToastContext);
  return toast;
};

export default ToastProvider;
