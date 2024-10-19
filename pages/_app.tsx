import type { AppProps } from 'next/app';
import { ConfigProvider, theme } from 'antd';
import Layout from '@/components/Layout';
import '../styles/globals.css'
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