import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import DiscordLink from "../../components/discord_link";
import Container from "../../components/elements/container";
import { H2, H3 } from "../../components/elements/headings";
import Hyperlink from "../../components/elements/hyperlink";
import Hero from "../../components/hero";
import OffCanvas from "../../components/offcanvas";
import { SiteHeader } from "../../components/site_header";
import MatchupFeedRequest, {
  TournamentConfiguration,
} from "../../core/matchup_feed_request";

export interface RulesProps {
  configuration: TournamentConfiguration;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let feed = new MatchupFeedRequest("pvp2-tournament");
  let results = await feed.fetch();
  return {
    props: {
      configuration: results.configuration,
    },
  };
};

export const RulesPage = (props: RulesProps) => (
  <OffCanvas>
    <Head>
      <title>Tournament Rules | Level Crush</title>
    </Head>
    <SiteHeader />
    <main>
      <Hero className="min-h-[20rem]">
        <Container minimalCSS={true} className="px-4 mx-auto flex-initial">
          <H2 className="drop-shadow text-center">Tournament Rules</H2>
        </Container>
      </Hero>
      <Container>
        <H3>Tournament Rules</H3>
        <p>
          Below you&apos;ll find a list of all of our rules for the tournament.
          If you have any questions be sure to join the discord and post about
          it! <br />
          <br />
          <strong>
            Note: A copy of the rules will be posted in the discord in the
            appropriate channels. If there is a discrepancy in rules between
            this page and the discord rules, favor discord version rulings.
          </strong>
          <DiscordLink></DiscordLink>
        </p>
      </Container>
      <Container>
        <H3>Format</H3>
        <p>{props.configuration.information.format}</p>
      </Container>
      <Container>
        <H3>Team Size</H3>
        <p>
          <strong>Team Size:</strong>
          {props.configuration.information.team_size}
        </p>
        <p>
          <strong>Required Teams:</strong>
          {props.configuration.information.required}
        </p>
      </Container>
      <Container>
        <H3>Date</H3>
        <p>
          This tournament will take place on:{" "}
          {props.configuration.information.date}
        </p>
      </Container>
      <Container>
        <H3>Maps</H3>
        <p>The maps that will be played are </p>
        <ol className="list-inside list-decimal">
          {props.configuration.maps.map((map, map_index) => (
            <li key={"map_" + map_index}>{map}</li>
          ))}
        </ol>
      </Container>
      <Container>
        <H3>Loadout Rules</H3>
        <p>
          Please follow the rules below, failure to do so will get your team
          disqualified immediately.
        </p>
        <ol className="list-inside list-decimal">
          {props.configuration.rules.map((rule, rule_index) => (
            <li key={"rule_" + rule_index}>{rule}</li>
          ))}
        </ol>
      </Container>
      <Container>
        <Hyperlink
          className="block max-w-[12rem] text-center text-white bg-blue-600 hover:bg-blue-900 hover:cursor-pointer rounded px-4 py-2  mx-0 my-8"
          href="/signup"
        >
          Sign up!
        </Hyperlink>
      </Container>
    </main>
  </OffCanvas>
);

export default RulesPage;
