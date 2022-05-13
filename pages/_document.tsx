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
      {/* twitch sdk */}
      <script defer src="https://embed.twitch.tv/embed/v1.js"></script>

      {/* google analytics */}
      <script
        defer
        src="https://www.googletagmanager.com/gtag/js?id=G-6KWQM3Y11P"
      ></script>

      {/* must be a better way to do this inside nextjs? */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
                   function gtag(){dataLayer.push(arguments);}
                   gtag('js', new Date());
                   gtag('config', 'G-6KWQM3Y11P');
                  `,
        }}
      ></script>
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
