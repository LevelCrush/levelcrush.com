import path from "path";
import React from "react";
import Hero from "../../../components/hero";
import SiteHeader from "../../../components/site_header";
import {
  TableOfContents,
  TableOfContentsNavigationItem,
} from "../../../components/table_of_contents";
import RaidGuideManager, { RaidGuide } from "../../../core/raid_guide";
import * as fs from "fs";
import { RaidGuideDisplay } from "../../../components/raid_guide_display";
import Head from "next/head";
import Container from "../../../components/elements/container";
import { H2 } from "../../../components/elements/headings";
import GoogleDoc, { GoogleDocAssetMap } from "../../../core/googleDoc";
import { docs_v1 } from "googleapis";
import moment from "moment";
import GoogleDocDisplay from "../../../components/google_doc_display";

export async function getServerSideProps() {
  console.log("Grabbing Google Doc", moment().unix());
  const googleDoc = new GoogleDoc(
    process.env["GOOGLEDOC_DESTINY2_VOTD"] as string,
    {
      assetUrl: "https://assets.levelcrush.com/guides/destiny2/votd",
    }
  );
  console.log("Pulling google doc", moment().unix());
  await googleDoc.pull();

  const docSchema = googleDoc.getDoc();
  if (docSchema === undefined) {
    return {
      notFound: true,
    };
  }

  console.log("Generating Asset Map", moment().unix());
  await googleDoc.generateAssetMap();

  console.log("Generating outline", moment().unix());
  const googleDocOutline = await googleDoc.generateOutline();

  // build a 2 level deep nav tree
  let navTree: TableOfContentsNavigationItem[] = [];
  for (let i = 0; i < googleDocOutline.entries.length; i++) {
    const level1Entry = googleDocOutline.entries[i];
    let subnavigation: TableOfContentsNavigationItem[] = [];
    for (let j = 0; j < level1Entry.entries.length; j++) {
      const level2Entry = level1Entry.entries[j];
      subnavigation.push({
        text: level2Entry.title,
        url: "#" + level2Entry.headingID,
        subnavigation: [],
      });
    }
    navTree.push({
      text: level1Entry.title,
      url: "#" + level1Entry.headingID,
      subnavigation: subnavigation,
    });
  }

  console.log("Generating Asset Map", moment().unix());
  const assetMap = await googleDoc.generateAssetMap();
  return {
    props: {
      navTree: navTree,
      doc: docSchema as docs_v1.Schema$Document,
      assetMap: assetMap,
    },
  };
}

export interface GuideVOTDPageProps {
  navTree: TableOfContentsNavigationItem[];
  doc: docs_v1.Schema$Document;
  assetMap: GoogleDocAssetMap;
}

export const GuideVOTDPage = (props: GuideVOTDPageProps) => (
  <>
    <Head>
      <title>VOTD Raid Guide | Level Crush</title>
    </Head>
    <SiteHeader />
    <main>
      <Hero
        className="min-h-[35rem]"
        backgroundUrl="https://assets.levelcrush.com/images/VOTDHero.jpg"
      >
        <Container>
          <H2 className="drop-shadow text-center">
            <span className="pb-2 block">Vow of the Disciple</span>
            <div className="border-b-yellow-400 border-b-2"></div>
            <span className="text-3xl pt-2 block">
              Raid Guide / Walkthrough
            </span>
          </H2>
        </Container>
      </Hero>
      <div className="container mx-auto flex flex-wrap justify-between relative top-0 guide pt-0 pb-8 lg:pt-8">
        <TableOfContents
          key="tableOfContents"
          navTree={props.navTree}
        ></TableOfContents>
        <GoogleDocDisplay
          key="googleDocDisplay"
          doc={props.doc}
          assetMap={props.assetMap}
        ></GoogleDocDisplay>
      </div>
    </main>
  </>
);

export default GuideVOTDPage;
