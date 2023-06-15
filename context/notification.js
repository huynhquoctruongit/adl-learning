import { createContext, useContext, useRef, useState } from 'react';
import Toast from '@/components/common/toast';
const NotifiContext = createContext({});

const Notification = ({ children }) => {
  const timmer = useRef();
  const noti_ = useRef();
  const [noti, setNoti] = useState({
    show: false,
    message: '',
    message: ''
  });
  noti_.current = noti;
  const toggleNoti = async (data) => {
    clearTimeout(timmer.current);
    if (noti_.current.show) {
      setNoti((state) => ({ ...state, show: false }));
      return;
    }
    const temp = { ...data };
    setNoti(temp);
    timmer.current = setTimeout(() => {
      setNoti((state) => ({ ...state, show: false }));
    }, temp.time);
  };

  const onClose = () => {
    clearTimeout(timmer.current);
    setNoti((state) => ({ ...state, show: false }));
  };

  return (
    <NotifiContext.Provider value={{ setNoti, toggleNoti }}>
      {children}
      <Toast toast={toast} onClose={onClose} />
    </NotifiContext.Provider>
  );
};

export const useToast = () => {
  const toast = useContext(NotifiContext);
  return toast;
};

export default ToastProvider;
