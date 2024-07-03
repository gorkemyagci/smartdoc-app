import type { AppProps, AppType } from 'next/app';
import React from 'react';
import { trpc } from '@/lib/trpc';

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default trpc.withTRPC(MyApp);