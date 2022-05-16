import { docs_v1 } from "googleapis";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import Head from "next/head";
import GoogleDocDisplay from "../components/google_doc_display";
import SiteHeader from "../components/site_header";
import {
  TableOfContents,
  TableOfContentsNavigationItem,
} from "../components/table_of_contents";
import GoogleDoc, { GoogleDocAssetMap } from "../core/googleDoc";

export interface GoogleDocTestProps {
  navTree: TableOfContentsNavigationItem[];
  doc: docs_v1.Schema$Document;
  assetMap: GoogleDocAssetMap;
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const googleDoc = new GoogleDoc(
    process.env["GOOGLEDOC_DESTINY2_VOTD"] as string,
    {
      assetUrl: "https://assets.levelcrush.com/guides/destiny2/votd",
    }
  );

  console.log("Pulling google doc");
  await googleDoc.pull();

  const docSchema = googleDoc.getDoc();
  if (docSchema === undefined) {
    return {
      notFound: true,
    };
  }

  console.log("Generating Asset Map");
  await googleDoc.generateAssetMap();

  console.log("Generating outline");
  const googleDocOutline = await googleDoc.generateOutline();
  //console.log(googleDocOutline);

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

  const assetMap = await googleDoc.generateAssetMap();
  return {
    props: {
      navTree: navTree,
      doc: docSchema as docs_v1.Schema$Document,
      assetMap: assetMap,
    },
  };
};

export const GoogleDocTest = (props: GoogleDocTestProps) => (
  <>
    <Head>
      <title>Google Doc Test - Level Crush</title>
    </Head>
    <SiteHeader />
    <main>
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

export default GoogleDocTest;
