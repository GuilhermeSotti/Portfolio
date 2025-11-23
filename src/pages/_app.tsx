// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect } from "react";
import { LocaleProvider } from "../components/LocaleContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("site_theme") : null;
      if (stored === "light") document.documentElement.classList.add("light");
      else document.documentElement.classList.remove("light");
    } catch {}
  }, []);

  return (
    <>
      <Head>
        <title>Guilherme Sotti — Portfólio</title>
        <meta name="description" content="Portfólio técnico de Guilherme Sotti — projetos GitHub e métricas de ganhos." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <LocaleProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LocaleProvider>
    </>
  );
}
