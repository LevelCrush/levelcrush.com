import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import DiscordLink from "../../components/discord_link";
import Container from "../../components/elements/container";
import { H2, H3 } from "../../components/elements/headings";
import Hyperlink from "../../components/elements/hyperlink";
import Hero from "../../components/hero";
import {
  MatchupFeedDisplay,
  MatchupFeedProperties,
} from "../../components/matchup_feed";
import OffCanvas from "../../components/offcanvas";
import { SiteHeader } from "../../components/site_header";
import MatchupFeedRequest from "../../core/matchup_feed_request";

export const getServerSideProps: GetServerSideProps = async (context) => {
  let feed = new MatchupFeedRequest("pvp2-tournament");
  let results = await feed.fetch();

  return {
    props: {
      name: "PVPTournamentFeed",
      feed: results,
    },
  };
};

export const MatchupPage = (props: MatchupFeedProperties) => (
  <OffCanvas>
    <Head>
      <title>Tournament Matchups | Level Crush</title>
    </Head>
    <SiteHeader />
    <main>
      <Hero className="min-h-[20rem]">
        <Container minimalCSS={true} className="px-4 mx-auto flex-initial">
          <H2 className="drop-shadow text-center">Tournament Matchups</H2>
        </Container>
      </Hero>
      <Container>
        <MatchupFeedDisplay {...props} />
      </Container>
    </main>
  </OffCanvas>
);

export default MatchupPage;
