import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { TranslationProvider } from '../context/TranslationContext';
import React from 'react';

export default function App({ Component, pageProps }: AppProps) {
  // pageProps.translations e pageProps.locale serão preenchidos em getStaticProps/getServerSideProps
  const translations = pageProps.translations ?? {};
  const locale = pageProps.locale ?? 'en';

  return (
    <TranslationProvider translations={translations} locale={locale}>
      <Component {...pageProps} />
    </TranslationProvider>
  );
}
