import Head from "next/head";
import React from "react";
import Hero from "../../../components/hero";
import { SiteHeader } from "../../../components/site_header";
import DiscordLink from "../../../components/discord_link";
import Container from "../../../components/elements/container";
import { H3 } from "../../../components/elements/headings";
import OffCanvas from "../../../components/offcanvas";
import { H2 } from "../../../components/elements/headings";
import Hyperlink from "../../../components/elements/hyperlink";

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
        <H3>Destiny Leaderboards</H3>
        <p>
          Below is a list of leaderboards that LevelCrush supports <br />
          While we are working on an automated system, please bare with us and
          manually submit your entry please Discord Primal#7344 or make an
          appropriate post in the discord.
        </p>
        <p>
          <DiscordLink />
        </p>
      </Container>
      <Container>
        <H3>Raids</H3>
        <ul className="list-disc">
          <li>
            <Hyperlink href="/leaderboards/destiny/kingsfall">
              Kings Fall
            </Hyperlink>
          </li>

          <li>
            <Hyperlink href="/leaderboards/destiny/votd">
              Vow of the Disciple
            </Hyperlink>
          </li>

          <li>
            <Hyperlink href="/leaderboards/destiny/vog">
              Vault of Glass
            </Hyperlink>
          </li>

          <li>
            <Hyperlink href="/leaderboards/destiny/dsc">
              Deep Stone Crypt
            </Hyperlink>
          </li>

          <li>
            <Hyperlink href="/leaderboards/destiny/gos">
              Garden of Salvation
            </Hyperlink>
          </li>

          <li>
            <Hyperlink href="/leaderboards/destiny/lastwish">
              Last Wish
            </Hyperlink>
          </li>
        </ul>
      </Container>
    </main>
  </OffCanvas>
);

export default DestinyLeaderboards;
