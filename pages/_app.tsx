import "../styles/globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import type { AppProps } from "next/app";

import smoothScroll from "smoothscroll-polyfill";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    smoothScroll.polyfill();
  });
  return <Component {...pageProps} />;
}

export default MyApp;
