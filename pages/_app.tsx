import "../styles/globals.css";
import type { AppProps } from "next/app";

import Layout from "../layout/Layout";

import { SessionProvider } from "next-auth/react";

import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className="mx-10">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
      <Toaster position="bottom-right" />
    </SessionProvider>
  );
}

export default MyApp;
