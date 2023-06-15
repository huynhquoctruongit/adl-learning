import React, { useEffect, useState } from 'react';
import Header from '@/components/layouts/header';
import Head from 'next/head';
import Script from 'next/script';
import { constructCallBack } from '@/api/base/refresh-token';
import axiosClient from '@/api/base/axios-cms';
import { SWRConfig } from 'swr';
import { useAuth } from '../hooks';
import MiddlewareAuth from '@/components/middleware/auth';
import Router, { useRouter } from 'next/router';
import ThemeManager from '@/components/template';
import { MathJaxContext } from 'better-react-mathjax';
import { motion } from 'framer-motion';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { configMathjax, timeCache } from '../service';
import { initEventLog } from '@/libs/tracking';
import { BrowserView, MobileView, isBrowser, isTablet, isMobile } from 'react-device-detect';
import * as detech from 'react-device-detect';
import '../styles/globals.css';
import '../styles/custom-form.css';
import '../styles/custom.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// console.log('MODE: ', process.env.MODE);
if (process.env.MODE === 'production') {
  Sentry.init({
    dsn: 'https://8b987e6163e84400861f016f6cad28f4@sentry.galaxyedu.io/61',
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0
  });
  console.log = () => { };
}
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [init, setInit] = useState(false);
  const pathname = router.pathname;
  const { logout } = useAuth({ revalidateOnMount: false });
  constructCallBack(logout);
  const { permission, theme, isHeader } = Component;

  useEffect(() => {
    // initFirebase();
    initEventLog().then(() => setInit(true));
    // Router.router.beforePopState((e) => {
    //   if (e.as !== router.asPath) router.push(e.as);
    // });
  }, []);

  // fetch something to init log's payload
  if (!init) return null;
  const urlResponsive = isTablet ? 'url(/images/unsupported-table.png)' : 'url(/images/unsupported-mb.png)';
  return (
    <React.Fragment>
      {(isMobile || isTablet) && process.env.MODE === "production" ? (
        <div
          style={{
            background: urlResponsive,
            width: '100vw',
            height: '100vh',
            backgroundPosition: 'top left',
            backgroundSize: 'cover'
          }}
        ></div>
      ) : (
        <React.Fragment>
          <Head>
            <title>ICAN - Học Toán cùng Gia sư AI</title>
            <meta name="description" content="ICAN - Học Toán cùng Gia sư AI" />
          </Head>
          {typeof location !== 'undefined' && !location.origin.includes('localhost') && (
            <>
              <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=GTM-T5N9MM3`} />
              <Script strategy="lazyOnload">
                {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GTM-T5N9MM3', {
                page_path: window.location.pathname,
              });
                  `}
              </Script>
            </>
          )}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-T5N9MM3"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>

          <SWRConfig
            value={{
              fetcher: (url) => axiosClient.get(url),
              dedupingInterval: timeCache,
              revalidateOnFocus: false,
              shouldRetryOnError: false
            }}
          >
            {isHeader ? <Header /> : ''}
            <MiddlewareAuth auth={permission !== 'public'}>
              <ThemeManager theme={theme}>
                <MathJaxContext
                  config={configMathjax}
                  version={2}
                  onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
                >
                  <motion.div
                    key={pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ ease: 'easeOut', duration: 0.25 }}
                  >
                    <Component {...pageProps} key={pathname} />
                  </motion.div>
                </MathJaxContext>
              </ThemeManager>
            </MiddlewareAuth>
          </SWRConfig>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default MyApp;
