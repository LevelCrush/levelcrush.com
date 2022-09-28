import Head from "next/head";
import React from "react";
import DiscordLink from "../../components/discord_link";
import Container from "../../components/elements/container";
import { H2, H3 } from "../../components/elements/headings";
import Hyperlink from "../../components/elements/hyperlink";
import Hero from "../../components/hero";
import OffCanvas from "../../components/offcanvas";
import { SiteHeader } from "../../components/site_header";

export const RulesPage = (props: any) => (
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
          it!
          <strong>
            Note: A copy of the rules will be posted in the discord in the
            appropriate channels. If there is a discrepency in rules between
            this page and the discord rules, favor discord version rulings.
          </strong>
          <DiscordLink></DiscordLink>
        </p>
      </Container>
      <Container>
        <H3>Games</H3>
        <p>
          Most games will be a best of 3 format. The finals will be best of 5
          format
        </p>
      </Container>
      <Container>
        <H3>Maps</H3>
        <p>
          The maps that will be played are{" "}
          <Hyperlink
            href="https://d2.destinygamewiki.com/wiki/The_Burnout"
            target="_blank"
          >
            Burnout
          </Hyperlink>
          ,
          <Hyperlink
            href="https://d2.destinygamewiki.com/wiki/The_Dead_Cliffs"
            target="_blank"
          >
            Dead Cliffs
          </Hyperlink>
          ,
          <Hyperlink
            href="https://d2.destinygamewiki.com/wiki/Endless_Vale"
            target="_blank"
          >
            Endless Vale
          </Hyperlink>
          ,
          <Hyperlink
            href="https://d2.destinygamewiki.com/wiki/Javelin-4"
            target="_blank"
          >
            Javelin-4
          </Hyperlink>
          ,{" "}
          <Hyperlink
            href="https://d2.destinygamewiki.com/wiki/Wormhaven"
            target="_blank"
          >
            Wormhaven
          </Hyperlink>
        </p>
      </Container>
      <Container>
        <H3>Weapons and Exotics</H3>
        <p>
          {" "}
          Please follow the rules below, failure to do so will get your team
          disqualified immediately.
        </p>
        <ul className="list-inside list-decimal">
          <li>No sunset Weapons or armor pieces allowed</li>
          <li>No duplicate exotic weapons or armor</li>
          <li>
            No duplicate special weapon archtypes. Snipers and Linears are the
            same for this category (i.e one shotgun, 1 fusion, 1 linear, 1
            sniper)
          </li>
          <li>Only 1 Bow per team is allowed</li>
          <li>&quot;Quicksilver Storm&quot; is banned</li>
          <li>
            <strong>MK44 PAIRED WITH Juggernaut</strong> is banned. (i.e you
            cannot use these 2 items together)
          </li>
          <li>ALL heavy weapons are banned</li>
          <li>All supers are allowed</li>
        </ul>
      </Container>
    </main>
  </OffCanvas>
);

export default RulesPage;
