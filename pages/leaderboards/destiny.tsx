process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import Head from "next/head";
import React from "react";
import Hero from "../../components/hero";
import { SiteHeader } from "../../components/site_header";
import DiscordLink from "../../components/discord_link";
import Container from "../../components/elements/container";
import { H3 } from "../../components/elements/headings";
import OffCanvas from "../../components/offcanvas";
import { H2 } from "../../components/elements/headings";
import SpeedRunTable, { SpeedRunProps } from "../../components/speedrun_table";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import axios from "axios";
import ENV from "../../core/env";

export interface DestinyLeaderboardsProp {
  entries: SpeedRunProps["data"];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const axiosResponse = await axios.post(ENV.hosts.api + "/leaderboards/read", {
    type: "destiny2-speedrun-kingsfall",
    amount: 10,
  });

  let entries: SpeedRunProps["data"] = [];
  if (
    axiosResponse &&
    axiosResponse.data &&
    axiosResponse.data.success &&
    axiosResponse.data.response &&
    axiosResponse.data.response.results
  ) {
    for (let i = 0; i < axiosResponse.data.response.results.length; i++) {
      try {
        const entry = JSON.parse(
          axiosResponse.data.response.results[i].fields
        ) as SpeedRunProps["data"][0];

        entry.duration = entry.duration || "Not provided";
        entry.verified = entry.verified || false;
        entry.video = entry.video || "N/A";
        entries.push(entry);
      } catch {}
    }
  }

  return {
    props: {
      entries: entries,
    },
  };
};

export const DestinyLeaderboards = (props: DestinyLeaderboardsProp) => (
  <OffCanvas>
    <Head>
      <title>Destiny Leaderboards | Level Crush</title>
    </Head>
    <SiteHeader />
    <main>
      <Hero className="min-h-[20rem]">
        <Container className="px-4 mx-auto flex-initial" minimalCSS={true}>
          <H2 className="drop-shadow  text-center">Leaderboards</H2>
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
      <Container>
        <SpeedRunTable
          title="Destiny 2 - Kings Fall"
          id="destinySpeedRunsKingsFall"
          addlHeaders={["Raid Report"]}
          data={props.entries}
        ></SpeedRunTable>
      </Container>
    </main>
  </OffCanvas>
);

export default DestinyLeaderboards;
