import { Html, Head, Main, NextScript } from "next/document";

export const Document = () => (
  <Html lang="en">
    <Head>
      {/* Favicon Support */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      {/* adobe typekit support */}
      <link rel="stylesheet" href="https://use.typekit.net/pfr8gmr.css" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
