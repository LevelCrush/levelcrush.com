import Head from "next/head";
import Script from "next/script";
import React from "react";

export interface SiteHeadProps {
  title: string;
}

export class SiteHead extends React.Component<
  React.PropsWithChildren<SiteHeadProps>
> {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <Head>
        <title>{this.props.title}</title>
        {/* Meta Output  */}
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,shrink-to-fit=no"
        />
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

        {this.props.children}
      </Head>
    );
  }
}

export default SiteHead;
