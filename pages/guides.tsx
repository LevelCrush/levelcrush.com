import Link from "next/link";
import React from "react";
import Hero from "../components/hero";
import SiteHeader from "../components/site_header";
import DiscordLink from "../components/discord_link";
import Head from "next/head";

export class GuidePage extends React.Component {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div>
        <Head>
          <title>Level Crush - Guides</title>
        </Head>
        <SiteHeader />
        <Hero className="bg-[url('/images/banner_background.jpg')] min-h-[20rem]">
          <div className="absolute top-0 left-0 bg-black opacity-[.65] w-full h-full"></div>
          <div className="container px-4 mx-auto flex-initial">
            <h2 className="drop-shadow text-6xl text-yellow-400 font-headline font-bold uppercase tracking-widest text-center">
              Guides
            </h2>
          </div>
        </Hero>
        <div className="container px-4 mx-auto mt-8 mb-16">
          <h3 className="text-4xl font-sans font-bold uppercase mb-4">
            Guides
          </h3>
          <p>
            We are currently working on expanding our guides available to the
            community! Enjoy what we have currently put together. | If you have
            any suggestions for any more, please feel free to join us on the
            discord and make the suggestions there!
            <DiscordLink />
          </p>
        </div>
        <div className="container px-4 mx-auto mt-8 mb-16">
          <h4 className="text-2xl">Guide List</h4>
          <hr />
          <br />
          <ol>
            <li>
              <p>
                <Link href="/guides/destiny2/votd">
                  <a className="hover:underline">
                    Destiny 2 - Vow of the Disciple Raid Guide{" "}
                  </a>
                </Link>
              </p>
              <p>Lorem Ipsum - Description here</p>
            </li>
          </ol>
        </div>
      </div>
    );
  }
}

export default GuidePage;
