// pages/_app.tsx
// import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import Layout from '@/components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ConfigProvider>
  );
}

export default MyApp;