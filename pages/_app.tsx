import type { AppProps } from 'next/app';
import { ConfigProvider, theme } from 'antd';
import { Provider } from 'react-redux';
import { store } from '../store';
import Layout from '@/components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ConfigProvider>
  );
}