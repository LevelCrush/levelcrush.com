import React from "react";
import { TournamentFeed } from "../core/matchup_feed_request";
import { H3 } from "./elements/headings";

export interface MatchupFeedProperties {
  name: string;
  className?: string;
  feed?: TournamentFeed;
}

export class MatchupFeedDisplay extends React.Component<
  MatchupFeedProperties,
  {}
> {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div className="container mx-auto flex flex-wrap justify-between relative top-0 guide pt-0 pb-8 lg:pt-8">
        <div className="container flex-initial w-full lg:w-[20%] mb-8">
          <H3>Standings</H3>
          <ul className="list-inside list-decimal">
            {this.props.feed ? (
              this.props.feed.standings.map((standing, standing_index) => (
                <li key={"standings_" + standing_index}>{standing}</li>
              ))
            ) : (
              <li>No current standing...</li>
            )}
          </ul>
        </div>
        <div className="container flex-initial w-full lg:w-[70%]">
          {this.props.feed && this.props.feed.matchups ? (
            <>
              <H3>Matchups as reported</H3>
              {Object.keys(this.props.feed.matchups).map(
                (round, round_index) => (
                  <div
                    className="matchup-round my-8"
                    key={"round_" + round_index}
                  >
                    <H3>{round}</H3>
                    {this.props.feed?.matchups[round].map(
                      (matchup, matchup_index) => (
                        <div
                          className="matchup container flex items-center flex-wrap my-2 md:my-4"
                          key={
                            "round_" + round_index + "_matchup_" + matchup_index
                          }
                        >
                          <div
                            title={
                              matchup["Team A"] + " vs " + matchup["Team B"]
                            }
                            className=" flex-[0_0_100%]  md:flex-[1_1_50%]  py-2 md:py-0 md:pr-4  border-b-[1px] md:border-b-[0px] md:border-r-[1px] border-solid border-black dark:border-white w:2/4 truncate"
                          >
                            <span>{matchup["Team A"]}</span> vs{" "}
                            <span>{matchup["Team B"]}</span>
                          </div>
                          <div className="flex-[0_0_100%]  md:flex-[1_1_50%] truncate md:pl-4 w-full md:w:2/4">
                            <strong>Winner: </strong>
                            <span>{matchup["Winner"]}</span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )
              )}
            </>
          ) : (
            <H3>No matchups yet...</H3>
          )}
        </div>
      </div>
    );
  }
}
