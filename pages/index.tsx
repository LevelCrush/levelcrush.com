import Head from "next/head";
import React from "react";
import EmbedGallery from "../components/embed_gallery";
import Hero from "../components/hero";
import { SiteHeader } from "../components/site_header";
import DiscordLink from "../components/discord_link";
import Container from "../components/elements/container";
import { H3 } from "../components/elements/headings";

export const HomePage = (props: any) => (
  <>
    <Head>
      <title>Level Crush - Home</title>
    </Head>
    <SiteHeader />
    <main>
      <Hero className="min-h-[50rem]">
        <div className="w-full">
          <EmbedGallery
            embeds={["terr0rbyt3", "arcane1x", "thatguymcdsr"]}
            type={"carousel"}
          ></EmbedGallery>
        </div>
      </Hero>
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-between">
          <div className="flex-[1_1_auto] lg:flex-[0_1_40%]">
            <Container>
              <H3>WHO ARE WE ?</H3>
              <p>
                Level Crush was spoken into existence between a small circle of
                friends. We began with one mission: To build a strong community
                that is diverse, friendly, and helpful!
                <br />
                <br />
                Our venture first took place with Overwatch on Twitch.tv, then
                moved to Beam.pro, and followed them to the exciting rebranding
                into Mixer where we soared within the Destiny community.
                Although we decided to step back from content creation as a
                community, our gamers continue to raid the Hive, loot
                King&apos;s Canyon, and creep through haunted farm houses at
                night. Come join us!
                <DiscordLink />
              </p>
            </Container>
            <Container>
              <H3>LOOKING FOR GROUP ?</H3>
              <p>
                Need another Guardian to take on Atheon? How about another
                squadmate to take on the kill leader? Or maybe run some casual
                creative modes?
                <br />
                <br />
                Well, what are you waiting for? Ready up!
                <DiscordLink />
              </p>
            </Container>
          </div>
          <div className="flex-[1_1_auto] lg:flex-[0_1_30%]">
            <Container>
              <H3>Discord Activity</H3>
              <iframe
                src="https://discord.com/widget?id=303862208419594240&theme=dark"
                width="100%"
                height="1000"
                frameBorder="0"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              ></iframe>
            </Container>
          </div>
        </div>
      </div>
    </main>
  </>
);

export default HomePage;
