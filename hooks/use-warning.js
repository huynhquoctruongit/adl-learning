import Router, { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

const useWarnIfUnsavedChanges = (unsavedChanges, callback) => {
  const prevent = useRef(true);
  const router = useRouter();
  // const currentUrl = router.asPath.split('?')[0];
  useEffect(() => {
    // not show warning in localhost
    if (location.href.includes('localhost')) return;
    const routeChangeStart = (url) => {
      // const baseUrl = url.split('?')[0];
      if (!prevent.current) return;
      if (unsavedChanges) {
        if (callback) callback(url);
        Router.events.emit('routeChangeError');
        throw 'Abort route change. Please ignore this error.';
      }
    };
    function confirmExit() {
      if (unsavedChanges) return 'You have attempted to leave this page. Are you sure?';
    }
    window.onbeforeunload = confirmExit;
    Router.events.on('routeChangeStart', routeChangeStart);
    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
      window.onbeforeunload = () => {};
    };
  }, [unsavedChanges]);

  const changePrevent = (value) => {
    prevent.current = value;
  };
  return { changePrevent };
};

export default useWarnIfUnsavedChanges;
