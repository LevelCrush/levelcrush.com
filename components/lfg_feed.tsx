import React from "react";
import axios from "axios";
import ENV from "../core/env";

import LFGActivity from "../core/lfg_activity";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrows, faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import LFGFeedRequest from "../core/lfg_feed_request";

export interface FeedProperties {
  name: string;
  interval: number;
  className?: string;
  lfgs?: LFGActivity[];
}

export interface FeedState {
  setup: boolean;
  lfgs: LFGActivity[];
  refreshing: boolean;
}

export class LFGFeed extends React.Component<FeedProperties, FeedState> {
  private colorMap = {
    0: {
      normal: "bg-[#E5572E] text-white dark:text-white dark:bg-[#9E3D20]",
      hover: "",
    },
    1: {
      normal: "bg-[#993417] text-white dark:text-white dark:bg-[#521C0C]",
      hover: "",
    },
    2: {
      normal: "bg-[#0F7499] text-white dark:text-white dark:bg-[#083E52]",
      hover: "",
    },
    3: {
      normal: "bg-[#C79200] text-white dark:text-white dark:bg-[#805E00]",
      hover: "",
    },
    4: {
      normal: "bg-[#997308] text-white dark:text-white dark:bg-[#523D04]",
      hover: "",
    },
  };

  public constructor(props: FeedProperties) {
    super(props);

    this.state = {
      setup: props.lfgs === undefined ? true : false,
      lfgs: props.lfgs !== undefined ? props.lfgs : [],
      refreshing: false,
    };

    this.requestFeed = this.requestFeed.bind(this);
    this.triggerRefresh = this.triggerRefresh.bind(this);
  }

  public requestFeed() {
    const timeStart = Date.now();
    let feedRequest = new LFGFeedRequest(this.props.name);
    feedRequest
      .fetch()
      .then((activityFeed) => {
        const timeEnd = Date.now();
        setTimeout(() => {
          if (activityFeed !== undefined) {
            this.setState({
              setup: false,
              refreshing: false,
              lfgs: activityFeed,
            });
          }
        }, Math.min(1500, Math.max(0, 1500 - (timeEnd - timeStart))));
      })
      .catch((err) => {
        console.log("Unable to fetch feed", err);
      });
  }

  public componentDidMount() {
    //if (this.props.lfgs === undefined) {
    console.log("Need lfg feed, requesting feed", this.props.name);
    this.requestFeed();
    //}
  }

  public triggerRefresh() {
    if (this.state.refreshing === false) {
      console.log("Refreshing", this.props.name);
      this.setState(
        {
          refreshing: true,
        },
        () => {
          console.log("we are here", this.props.name);
          this.requestFeed();
        }
      );
    }
  }

  public renderSetup() {
    console.log("Loading in feed");
    return (
      <div
        className="animate-pulse feed p-4 sticky top-0"
        data-name={this.props.name}
      >
        <h3 className="text-2xl  md:text-2xl  lg:text-3xl  font-sans font-bold uppercase mb-2 dark:text-white rounded-lg p-2 py-4 dark:bg-gradient-to-t dark:bg-slate-900 dark:from-black dark:to-slate-800 transition-all duration-300">
          {"#" + this.props.name}
        </h3>
        <div className="activities">
          <div className="activity p-4 my-4 mx-auto bg-white dark:bg-gradient-to-t dark:bg-slate-900 dark:from-black dark:to-slate-800 border-solid border-[1px] dark:border-[1px] dark:border-gray-800 rounded-lg  transition-all duration-300">
            <h4 className="text-2xl dark:text-white font-sans font-bold uppercase mb-4 transition duration-300">
              Loading In...
            </h4>
            <p className="border-b-2 dark:text-white border-b-slate-300 text-sm mb-4 pb-4 transition duration-300">
              <span className="mr-2 font-bold">&nbsp;</span>
              <span className="mr-4">&nbsp;</span>
              <span className="font-bold mr-2">&nbsp;</span>
              <span className="mr-4">&nbsp;</span>
            </p>
            <p className="p-4 bg-slate-600 text-white rounded-t">&nbsp;</p>
          </div>
        </div>
      </div>
    );
  }

  public renderFeed() {
    const targetTimezone = moment.tz.guess();

    const totalKeys = Object.keys(this.colorMap).length;

    if (this.state.lfgs.length === 0) {
      this.state.lfgs.push({
        joinID: "0",
        activity: "No Activity Found",
        startTime: moment().unix(),
        amountJoined: 0,
        amountNeeded: 0,
        description: "No Activity could be found. Why not make one?",
        whoJoined: [],
      });
    }
    return (
      <div
        className={
          (this.props.className ? this.props.className : "") +
          " feed relative lg:sticky top-0 mt-24 first:mt-0 lg:mt-0 " +
          (this.state.refreshing === true ? "animate-pulse" : "")
        }
        data-name={this.props.name}
      >
        <h3 className="text-2xl  md:text-2xl  lg:text-3xl font-sans font-bold uppercase mb-2 dark:text-white rounded-lg p-2 py-4 dark:bg-gradient-to-t dark:bg-slate-900 dark:from-black dark:to-slate-800 transition-all duration-300">
          <span className="float-left">{"#" + this.props.name}</span>
          <button
            className="mx-4 text-lg float-right"
            disabled={this.state.refreshing === true}
          >
            <FontAwesomeIcon
              icon={faArrowsRotate}
              className={this.state.refreshing ? "animate-spin" : ""}
              onClick={(event) => this.triggerRefresh()}
              size="1x"
              title="Refresh the feed"
            ></FontAwesomeIcon>
          </button>
          <div className="clear-both"></div>
        </h3>
        <div className="activities">
          {this.state.lfgs.map((activity, index) => (
            <div
              className="activity p-4 my-4 mx-auto bg-white dark:bg-gradient-to-t dark:bg-slate-900 dark:from-black dark:to-slate-800 border-solid border-[1px] dark:border-[1px] dark:border-gray-800 rounded-lg  transition-all duration-300"
              key={index}
              data-index={index}
            >
              <h4 className="text-2xl dark:text-white font-sans font-bold uppercase mb-4 transition duration-300">
                {activity.activity}
              </h4>
              <p className="border-b-2 dark:text-white border-b-slate-300 text-sm mb-4 pb-4 transition duration-300">
                <span className="mr-2 font-bold  ">Start Time:</span>
                <span className="mr-4">
                  {moment
                    .unix(activity.startTime)
                    .tz(targetTimezone)
                    .format("MMMM Do YYYY, h:mm A zz")}
                </span>
                <br className="block md:hidden" />
                <span className="font-bold mr-2">Guardians:</span>
                <span className="mr-4">
                  {activity.amountJoined} / {activity.amountNeeded}
                </span>
              </p>
              <p className="p-4 bg-slate-600 text-white rounded-t">
                {activity.description}
              </p>
              <ol className="flex flex-wrap">
                {activity.whoJoined.map((guardian, guardianIndex) => (
                  <li
                    className={
                      "flex-auto px-4 py-2 text-center break-all transition duration-300 " +
                      (this.colorMap as any)[guardianIndex % totalKeys].normal
                    }
                    key={guardianIndex}
                  >
                    {guardian}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    );
  }

  public render() {
    const isSetup = this.state.setup;
    if (isSetup) {
      return this.renderSetup();
    } else {
      return this.renderFeed();
    }
  }
}

export default LFGFeed;
