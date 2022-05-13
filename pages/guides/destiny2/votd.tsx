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

export async function getServerSideProps() {
  let doHardPull = false;
  const cachePath = path.join("./", "guideCache", "raidguide_votd.json");
  let fileDoesExist = false;
  let raidGuide: RaidGuide = {
    title: "",
    encounters: {},
    id: "",
    assets: {},
  };
  try {
    await fs.promises.access(cachePath);
    fileDoesExist = true;
  } catch {
    fileDoesExist = false;
  }

  if (fileDoesExist) {
    raidGuide = JSON.parse(
      await fs.promises.readFile(cachePath, { encoding: "utf-8" })
    );
  } else {
    doHardPull = true;
  }

  if (doHardPull) {
    let guideManager = new RaidGuideManager("votd");
    await guideManager.pull();
    await guideManager.prerender();
    raidGuide = guideManager.raw() as RaidGuide;
  }

  let navTree: TableOfContentsNavigationItem[] = [];

  for (let encounterID in raidGuide.encounters) {
    const encounter = raidGuide.encounters[encounterID];
    let subnavigation: TableOfContentsNavigationItem[] = [];

    for (let sectionID in raidGuide.encounters[encounterID].sections) {
      const section = raidGuide.encounters[encounterID].sections[sectionID];
      subnavigation.push({
        text: section.title,
        url: "#" + section.id,
        subnavigation: [],
      });
    }
    navTree.push({
      text: encounter.title,
      url: "#" + encounter.id,
      subnavigation: subnavigation,
    });
  }

  return {
    props: {
      guide: raidGuide,
      navTree: navTree,
    },
  };
}

export interface GuideVOTDPageProps {
  guide: RaidGuide;
  navTree: TableOfContentsNavigationItem[];
}

export class GuideVOTDPage extends React.Component<GuideVOTDPageProps> {
  public constructor(props: GuideVOTDPageProps) {
    super(props);
  }

  public render() {
    return (
      <div>
        <Head>
          <title>Level Crush - VOTD Raid Guide</title>
        </Head>
        <SiteHeader />
        <main>
          <Hero
            className="min-h-[35rem]"
            backgroundUrl="https://assets.levelcrush.com/images/banner_background_opt.jpg"
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
            <TableOfContents navTree={this.props.navTree}></TableOfContents>
            <RaidGuideDisplay guide={this.props.guide}></RaidGuideDisplay>
          </div>
        </main>
      </div>
    );
  }
}

export default GuideVOTDPage;
