import "../styles/globals.css";
import type { AppProps } from "next/app";

import Layout from "../layout/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="mx-10">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}

export default MyApp;
