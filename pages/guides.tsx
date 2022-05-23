import Link from "next/link";
import React from "react";
import Hero from "../components/hero";
import SiteHeader from "../components/site_header";
import DiscordLink from "../components/discord_link";
import Head from "next/head";
import { H2, H3, H4 } from "../components/elements/headings";
import Container from "../components/elements/container";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import OffCanvas from "../components/offcanvas";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      permanent: false,
      destination: "/guides/destiny2/votd",
    },
  };
};

export const GuidePage = (props: any) => (
  <OffCanvas>
    <Head>
      <title>Level Crush - Guides</title>
    </Head>
    <SiteHeader />
    <Hero className="min-h-[20rem]">
      <Container className="px-4 mx-auto flex-initial" minimalCSS={true}>
        <H2 className="drop-shadow  text-center">Guides</H2>
      </Container>
    </Hero>
    <Container>
      <H3>Guides</H3>
      <p>
        We are currently working on expanding our guides available to the
        community! Enjoy what we have currently put together. | If you have any
        suggestions for any more, please feel free to join us on the discord and
        make the suggestions there!
        <DiscordLink />
      </p>
    </Container>
    <Container>
      <H4>Guide List</H4>
      <hr />
      <br />
      <ol>
        <li>
          <p>
            <Link href="/guides/destiny2/votd">
              <a className="hover:underline underline">
                Destiny 2 - Vow of the Disciple Raid Guide{" "}
              </a>
            </Link>
          </p>
          <p>
            Click the above link to learn more about Bungie&apos; latest raid
            for Destiny 2. Vow of the Disciple or VOTD for short is part of
            Bungie&apos; Witch Queen Expansion
          </p>
        </li>
      </ol>
    </Container>
  </OffCanvas>
);

export default GuidePage;
