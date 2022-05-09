import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import Hero from "../components/hero";
import LFGFeed from "../components/lfg_feed";
import SiteHead from "../components/site_head";
import { SiteHeader } from "../components/site_header";
import LFGActivity from "../core/lfg_activity";
import LFGFeedRequest from "../core/lfg_feed_request";

export interface LFGPageProps {
  lfgs?: LFGActivity[];
  scheduledLfgs?: LFGActivity[];
}
export async function getServerSideProps() {
  // on the server side provide the initial data required for the feed request
  const feedRequest = new LFGFeedRequest("destiny-lfg");
  const lfgs = await feedRequest.fetch();

  const scheduledLFGRequest = new LFGFeedRequest("destiny-scheduled-lfg");
  const scheduledLfgs = await scheduledLFGRequest.fetch();

  return {
    props: {
      lfgs: lfgs,
      scheduledLfgs: scheduledLfgs,
    },
  };
}

export class LFGPage extends React.Component<LFGPageProps> {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div>
        <SiteHead title="Level Crush - Looking for Group" />
        <SiteHeader />
        <main>
          <Hero className="bg-[url('/images/banner_background.jpg')] min-h-[20rem]">
            <div className="absolute top-0 left-0 bg-black opacity-[.65] w-full h-full"></div>
            <div className="container px-4 mx-auto flex-initial">
              <h2 className="drop-shadow text-6xl text-yellow-400 font-headline font-bold uppercase tracking-widest text-center">
                Looking for a group?
              </h2>
            </div>
          </Hero>
          <div className="container  px-4 mx-auto mt-8 mb-16">
            <div className="flex flex-wrap  self-start">
              <LFGFeed
                className="flex-auto lg:w-6/12"
                interval={30}
                name="destiny-lfg"
                lfgs={this.props.lfgs !== undefined ? this.props.lfgs : []}
              ></LFGFeed>
              <LFGFeed
                className="flex-auto lg:w-6/12  self-start"
                interval={30}
                name="destiny-scheduled-lfg"
                lfgs={
                  this.props.scheduledLfgs !== undefined
                    ? this.props.scheduledLfgs
                    : []
                }
              ></LFGFeed>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default LFGPage;
