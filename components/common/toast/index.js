import React, { Component, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { variantsToast } from '@/service/config';

const Toast = ({ toast, onClose }) => {
  const { message, status, show, time } = toast;
  const getImage = {
    warning: '/images/warning-toast.png',
    fail: '/images/error-toast.png',
    success: '/images/success-toast.png'
  };
  return (
    <div className="fixed bottom-[0] right-[52px]">
      <AnimatePresence>
        {show && (
          <motion.div
            variants={variantsToast}
            initial="hidden"
            animate="visible"
            exit={'exit'}
            transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
          >
            <div className={`message flex items-center justify-between shadow-box p-4 rounded toast-${status}`}>
              <div className="flex items-center">
                <img width="28px" src={getImage[status]} />
                <span className="ml-[12px] text-[14px]">{message}</span>
              </div>
              <img src="/images/x.png" className="cursor-pointer ml-2" onClick={onClose} width="20px" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
