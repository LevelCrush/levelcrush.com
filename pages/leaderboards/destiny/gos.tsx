process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import Head from "next/head";
import React from "react";
import Hero from "../../../components/hero";
import { SiteHeader } from "../../../components/site_header";
import DiscordLink from "../../../components/discord_link";
import Container from "../../../components/elements/container";
import { H3 } from "../../../components/elements/headings";
import OffCanvas from "../../../components/offcanvas";
import { H2 } from "../../../components/elements/headings";
import SpeedRunTable, {
  SpeedRunProps,
} from "../../../components/speedrun_table";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import axios from "axios";
import ENV from "../../../core/env";
import DestinyLeaderboardsProp from "../../../core/destiny_leaderboard_props";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const axiosResponse = await axios.post(ENV.hosts.api + "/leaderboards/read", {
    type: "destiny2-speedrun-gos",
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

export const GardenOfSalvationLeaderboards = (
  props: DestinyLeaderboardsProp
) => (
  <OffCanvas>
    <Head>
      <title>Garden of Salvation Leaderboards | Level Crush</title>
    </Head>
    <SiteHeader />
    <main>
      <Hero className="min-h-[20rem]">
        <Container className="px-4 mx-auto flex-initial" minimalCSS={true}>
          <H2 className="drop-shadow  text-center">
            Garden of Salvation Leaderboard
          </H2>
        </Container>
      </Hero>
      <Container>
        <H3>Destiny 2 Garden of Salvation speedruns</H3>
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
        <H3>Speed run leaderboard</H3>
        <p>
          The leaderboard below is exclusively for Destiny 2. Submitted runs
          will be watched and if everything checks it out , it will receive a
          &quot;Verified&quot; mark. Submissions that do not come with a video
          will be flagged as &quot;Unverified&quot;. If your submission is found
          to have errors or be questionable. We will not include it in the
          leaderboard.
        </p>
      </Container>
      <Container>
        <SpeedRunTable
          title="Destiny 2 - Garden of Salvation"
          id="destinySpeedRunsGOS"
          addlHeaders={["Raid Report"]}
          data={props.entries}
        ></SpeedRunTable>
      </Container>
    </main>
  </OffCanvas>
);

export default GardenOfSalvationLeaderboards;
