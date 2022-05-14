import Head from "next/head";
import SiteHeader from "../components/site_header";
import {
  TableOfContents,
  TableOfContentsNavigationItem,
} from "../components/table_of_contents";
import GoogleDoc from "../core/googleDoc";

export interface GoogleDocTestProps {
  navTree: TableOfContentsNavigationItem[];
}

export async function getServerSideProps() {
  const googleDoc = new GoogleDoc(
    process.env["GOOGLEDOC_DESTINY2_VOTD"] as string
  );

  console.log("Pulling google doc");
  await googleDoc.pull();

  console.log("Generating outline");
  const googleDocOutline = await googleDoc.generateOutline();
  console.log(googleDocOutline);
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

  return {
    props: {
      navTree: navTree,
    },
  };
}

export const GoogleDocTest = (props: GoogleDocTestProps) => (
  <>
    <Head>
      <title>Looking For Group - Level Crush</title>
    </Head>
    <SiteHeader />
    <main>
      <TableOfContents navTree={props.navTree}></TableOfContents>
    </main>
  </>
);

export default GoogleDocTest;
