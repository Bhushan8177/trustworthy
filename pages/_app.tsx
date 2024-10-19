import type { AppProps } from 'next/app';
import { ConfigProvider, theme } from 'antd';
import Layout from '@/components/Layout';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

import '../styles/globals.css'
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ConfigProvider>
    </Provider>
  );
}