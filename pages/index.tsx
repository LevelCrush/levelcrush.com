import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import EmbedGallery from "../components/embed_gallery";
import Hero from "../components/hero";
import SiteHead from "../components/site_head";
import { SiteHeader } from "../components/site_header";
import DiscordLink from "../components/discord_link";

export const HomePage = (props: any) => (
  <div>
    <SiteHead title="Level Crush - Home" />
    <SiteHeader />
    <main>
      <Hero className="bg-[url('/images/banner_background.jpg')] min-h-[50rem]">
        <div className="absolute top-0 left-0 bg-black opacity-[.65] w-full h-full"></div>
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
            <div className="container px-4 mx-auto mt-8 mb-16">
              <h3 className="text-3xl font-sans font-bold uppercase mb-4">
                WHO ARE WE ?
              </h3>
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
            </div>
            <div className="container px-4 mx-auto mt-8 mb-16">
              <h3 className="text-3xl font-sans font-bold uppercase mb-4">
                LOOKING FOR GROUP ?
              </h3>
              <p>
                Need another Guardian to take on Atheon? How about another
                squadmate to take on the kill leader? Or maybe run some casual
                creative modes?
                <br/>
                <br/>
                Well, what are you waiting for? Ready
                up!
                <DiscordLink />
              </p>
            </div>
            <div className="container px-4 mx-auto mt-8 mb-16">
              <h3 className="text-3xl font-sans font-bold uppercase mb-4">
                FEEDBACK ?
              </h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id
                nisl et augue cursus euismod vitae eget lorem. Donec maximus
                suscipit elit, at egestas nulla lacinia quis. Vivamus
                ullamcorper velit sem, ut eleifend eros facilisis non.
                Pellentesque varius lacinia est, a fringilla ipsum pulvinar sed.
                Etiam rutrum sem quis mauris aliquam, non lacinia felis gravida.
                Nulla gravida mauris ac ipsum posuere, eget bibendum magna
                laoreet. Donec magna felis, semper eget dui sed, cursus
                sollicitudin arcu. In scelerisque nisl ut tempor interdum.
                Aliquam consectetur, lorem nec hendrerit accumsan, felis mauris
                fermentum augue, ac pulvinar ipsum lorem et nulla. Ut eros
                magna, semper a leo at, semper mattis nunc. Nullam in elit
                massa.
                <DiscordLink />
              </p>
            </div>
            <div className="container px-4 mx-auto mt-8 mb-16">
              <h3 className="text-3xl font-sans font-bold uppercase mb-4">
                WANT TO COLLABORATE ?
              </h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id
                nisl et augue cursus euismod vitae eget lorem. Donec maximus
                suscipit elit, at egestas nulla lacinia quis. Vivamus
                ullamcorper velit sem, ut eleifend eros facilisis non.
                Pellentesque varius lacinia est, a fringilla ipsum pulvinar sed.
                Etiam rutrum sem quis mauris aliquam, non lacinia felis gravida.
                Nulla gravida mauris ac ipsum posuere, eget bibendum magna
                laoreet. Donec magna felis, semper eget dui sed, cursus
                sollicitudin arcu. In scelerisque nisl ut tempor interdum.
                Aliquam consectetur, lorem nec hendrerit accumsan, felis mauris
                fermentum augue, ac pulvinar ipsum lorem et nulla. Ut eros
                magna, semper a leo at, semper mattis nunc. Nullam in elit
                massa.
                <DiscordLink />
              </p>
            </div>
          </div>
          <div className="flex-[1_1_auto] lg:flex-[0_1_30%]">
            <div className="container px-4 mx-auto mt-8 mb-16">
              <h3 className="text-3xl font-sans font-bold uppercase mb-4">
                Discord Activity
              </h3>
              <iframe
                src="https://discord.com/widget?id=303862208419594240&theme=dark"
                width="100%"
                height="1000"
                frameBorder="0"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default HomePage;
