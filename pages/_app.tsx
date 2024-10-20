import type { AppProps } from 'next/app';
import { ConfigProvider, theme } from 'antd';
import Layout from '@/components/Layout';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Loader from '@/components/Loader';

import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
        }}
      >
        <Layout>
          {loading && <Loader />}
          <Component {...pageProps} />
        </Layout>
      </ConfigProvider>
    </Provider>
  );
}