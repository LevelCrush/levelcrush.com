import Head from "next/head";
import React from "react";
import Hero from "../../../components/hero";
import { SiteHeader } from "../../../components/site_header";
import DiscordLink from "../../../components/discord_link";
import Container from "../../../components/elements/container";
import { H3 } from "../../../components/elements/headings";
import OffCanvas from "../../../components/offcanvas";
import { H2 } from "../../../components/elements/headings";

export const DestinyLeaderboards = (props: any) => (
  <OffCanvas>
    <Head>
      <title>Destiny Leaderboards | Level Crush</title>
    </Head>
    <SiteHeader />
    <main>
      <Hero className="min-h-[20rem]">
        <Container className="px-4 mx-auto flex-initial" minimalCSS={true}>
          <H2 className="drop-shadow  text-center">Destiny Leaderboards</H2>
        </Container>
      </Hero>
      <Container>
        <H3>Below is a list of leaderboards that LevelCrush supports</H3>
        <p>
          While we are working on an automated system, please bare with us and
          manually submit your entry please Discord Primal#7344 or make an
          appropriate post in the discord.
        </p>
        <p>
          <DiscordLink />
        </p>
      </Container>
    </main>
  </OffCanvas>
);

export default DestinyLeaderboards;
