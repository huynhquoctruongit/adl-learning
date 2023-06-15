import { useAuth } from '@/hooks/use-auth';
import { convertQueyToObject } from '@/service/helper';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PaymentProvider from '@/context/subscription';
import { Tracker } from '@/libs/tracking';

const pathname_tracker = [{ pathname: '/learning-path', name: 'home' }];

const MiddlewareAuth = ({ children, auth = false }) => {
  const router = useRouter();
  const { profile, firstLoading, getProfile } = useAuth();
  useEffect(() => {
    // tracking page
    const object = convertQueyToObject();
    let payload = {};
    if (!object.payload) return {};
    try {
      const actual = window.atob ? window.atob(object.payload) : '';
      payload = JSON.parse(actual);
    } catch (error) {
      payload = { access_token: "QwVk4i6XxXcYn9oFqdlVmPq0QgJsXdpAxjDh40DZNtA.kgbML8-t9vfcJORNK3y_fWqIzoq00QH9OJS2Qr7xVv8" };
      console.log(error);
    }

    (async () => {
      console.log(payload);
      if (payload.access_token && payload.expires_at * 1000 > new Date().getTime()) {
        console.log(object.payload);
        window.localStorage.setItem('access_token', payload.access_token);
        window.localStorage.setItem('refresh_token', payload.refresh_token);
        window.localStorage.setItem('expires_at', new Date().getTime() / 1000 + payload.expires_in);
        const profile_update = await getProfile();
        if (profile_update?.current_step === 4) router.push('/learning-path');
        else if (profile_update?.current_step < 4) router.push('/onboarding?step=' + profile_update.current_step || 0);
      }
    })();
  }, []);
  useEffect(() => {
    if (!firstLoading) {
      const isSendLog = pathname_tracker.find((element) => element.pathname === router.pathname);
      if (isSendLog) {
        Tracker.send({
          category: isSendLog.name,
          event: 'page',
          action: 'opened'
        });
      }
    }
  }, [firstLoading]);

  if (firstLoading) return null;

  if (!auth && (router.pathname === '/public_preview' || router.pathname === '/full_page_preview')) {
    return children;
  }
  if (auth && !profile) {
    router.push('/');
    return null;
  }

  if ((router.pathname === '/' && profile) || (!auth && profile)) {
    if (profile.current_step === 4) router.push('/learning-path');
    else if (profile.current_step < 4) router.push('/onboarding');
    return null;
  }

  return <PaymentProvider>{children}</PaymentProvider>;
};

export default MiddlewareAuth;
