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

        {this.props.children}
      </Head>
    );
  }
}

export default SiteHead;
