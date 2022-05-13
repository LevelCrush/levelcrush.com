import Head from "next/head";
import React from "react";
import DiscordLink from "../components/discord_link";
import Container from "../components/elements/container";
import { H2, H3 } from "../components/elements/headings";
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
      <Hero className="min-h-[20rem]">
        <Container minimalCSS={true} className="px-4 mx-auto flex-initial">
          <H2 className="drop-shadow text-center">Looking for a group?</H2>
        </Container>
      </Hero>
      <Container>
        <H3>Looking for a group?</H3>
        <p>
          Right now we are currently working on our own lfg search feature. In
          the meantime please visit the discord to lfg. Thank you!
          <DiscordLink></DiscordLink>
        </p>
      </Container>
      <Container>
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
      </Container>
    </main>
  </>
);

export default LFGPage;
