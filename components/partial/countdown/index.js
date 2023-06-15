import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/use-auth';
import axiosInteraction from '@/api/base/axios-interaction';
const CountDownTimer = ({ timeStamp, handelTimeout, isLogout, handleLogout }) => {
  const router = useRouter();
  const [timeCountDown, setTimeCountdown] = useState(timeStamp);
  const timeCouttDownRef = useRef(timeStamp);
  const timeoutRef = useRef(null);
  const countRef = useRef(null);
  const { profile } = useAuth();
  const timeConfig = 14400;


  useEffect(() => {
    if (timeCountDown > 0) {
      countRef.current = setTimeout(() => {
        setTimeCountdown((state) => {
          if (state == 1) return;
          timeCouttDownRef.current = state - 1;
          // localStorage.setItem('time', state - 1);
          return state - 1;
        });
      }, 1000);
    } else {
      const date_old = localStorage.getItem('date');
      const today = new Date();
      // if (date_old == today.toLocaleDateString('en-US')) {
      //   axiosInteraction.post('/user/meta-data', {
      //     left_time: 0
      //   });
      // }
      clearTimeout(countRef.current);
      if (handelTimeout) {
        handelTimeout(true);
      }
    }
  }, [timeCountDown]);

  useEffect(() => {
    if (profile) {
      callBackTimer();
    } else {
      clearTimeout(timeoutRef.current);
    }
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [profile]);

  const callBackTimer = () => {
    var timeConfigtion = timeCouttDownRef.current;
    const date_old = localStorage.getItem('date');
    const today = new Date();
    if (!date_old) {
      localStorage.setItem('date', today.toLocaleDateString('en-US'));
      axiosInteraction.post('/user/meta-data', {
        left_time: 14400
      });
    } else {
      if (date_old !== today.toLocaleDateString('en-US')) {
        setTimeout(() => {
          axiosInteraction.post('/user/meta-data', {
            left_time: timeConfig
          });
          localStorage.setItem('date', today.toLocaleDateString('en-US'));
        }, 1000);
      } else {
        if (timeConfigtion > 0 && profile) {
        } else {
          clearTimeout(timeoutRef.current);
        }
      }
    }
  };

  useEffect(() => {
    if (timeCountDown === null || timeCountDown === 0 || !profile) {
      return;
    }
    if (timeCountDown <= 1) {
      setTimeout(() => {
        router.push('/timeout');
      }, 1000);
    }
  }, [timeCountDown]);
  useEffect(() => {
    if (timeCountDown == 0) {
      router.push('/timeout');
    }
  }, []);
  if (timeCountDown === null || timeCountDown === 0 || !profile) return null;
  let totalSeconds = timeCountDown;
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  function handleVisibilityChange() {
    if (document.hidden) {
      clearTimeout(timeoutRef.current);
      clearTimeout(countRef.current);
    } else {
      callBackTimer();
      setTimeCountdown((state) => state - 1);
      countRef.current = timeCouttDownRef.current;
    }
  }

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange, false);
  }, []);

  return (
    <>
      {(hours !== NaN && minutes !== NaN && seconds !== NaN && (
        <>
          <span>{`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`}</span>
          <div
            className="percent-all"
            style={{ width: '74px', height: '6px', background: '#DCDCDC', borderRadius: '3px', overflow: 'hidden' }}
          >
            <p
              className="percent custom-button"
              style={{
                width: (timeCouttDownRef.current / timeConfig) * 100 - 10 + 'px',
                borderRadius: '3px',
                height: '6px'
                // background: '#0057A5'
              }}
            >
              {timeCouttDownRef.current}
            </p>
          </div>
        </>
      )) ||
        ''}
    </>
  );
};

export default CountDownTimer;
