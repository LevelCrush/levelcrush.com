import Head from "next/head";
import React from "react";
import DiscordLink from "../components/discord_link";
import Hero from "../components/hero";
import LFGFeed from "../components/lfg_feed";
import { SiteHeader } from "../components/site_header";
import LFGActivity from "../core/lfg_activity";

export interface LFGPageProps {
  lfgs?: LFGActivity[];
  scheduledLfgs?: LFGActivity[];
}

export const LFGPage = (props: LFGPageProps) => (
  <>
    <Head>
      <title>Level Crush - Looking For Group</title>
    </Head>
    <SiteHeader />
    <main>
      <Hero className="bg-[url('/images/banner_background.jpg')] min-h-[20rem]">
        <div className="absolute top-0 left-0 bg-black opacity-[.65] w-full h-full"></div>
        <div className="container px-4 mx-auto flex-initial">
          <h2 className="drop-shadow text-6xl text-yellow-400 font-headline font-bold uppercase tracking-widest text-center">
            Looking for a group?
          </h2>
        </div>
      </Hero>
      <div className="container px-4 mx-auto mt-8 mb-16">
        <h3 className="text-4xl font-sans font-bold uppercase mb-4">
          Looking for a group?
        </h3>
        <p>
          Right now we are currently working on our own lfg search feature. In
          the meantime please visit the discord to lfg. Thank you!
          <DiscordLink></DiscordLink>
        </p>
      </div>
      <div className="container  px-4 mx-auto mt-8 mb-16">
        <div className="flex flex-wrap justify-between ">
          <LFGFeed
            className="flex-[0_0_auto]  w-full lg:w-[48%] self-start"
            name="destiny-lfg"
            lfgs={props.lfgs}
          ></LFGFeed>
          <LFGFeed
            className="flex-[0_0_auto] w-full  lg:w-[48%]  self-start"
            name="destiny-scheduled-lfg"
            lfgs={props.scheduledLfgs}
          ></LFGFeed>
        </div>
      </div>
    </main>
  </>
);

export default LFGPage;
