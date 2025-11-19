// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
  // inicializa tema (dark) respeitando prefers-color-scheme e localStorage
  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
      const prefersDark =
        typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (stored === "dark" || (!stored && prefersDark)) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (e) {
      // fail silently
      // eslint-disable-next-line no-console
      console.debug("theme init failed", e);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Guilherme Sotti — Portfólio</title>
        <meta name="description" content="Portfólio técnico de Guilherme Sotti — projetos GitHub e métricas de ganhos por projeto." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {/* Open Graph */}
        <meta property="og:title" content="Guilherme Sotti — Portfólio" />
        <meta property="og:description" content="Portfólio técnico e painel de métricas por projeto." />
        <meta property="og:type" content="website" />
        {/* Optional: adicione um og:image em public/ e referencie aqui */}
      </Head>

      {/* skip link pra acessibilidade */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-3 py-2 rounded">
        Pular para o conteúdo
      </a>

      <Layout>
        {/* main-content id para o skip link */}
        <main id="main-content" className="min-h-[60vh]">
          <Component {...pageProps} />
        </main>
      </Layout>
    </>
  );
}
