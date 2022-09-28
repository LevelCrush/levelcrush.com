import axios from "axios";
import ENV from "./env";
if (ENV.isBrowser === false) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
export interface TournamentMatchup {
  "Team A": string;
  "Team B": string;
  Winner: string;
  round: string;
}

export type MatchupMap = { [round: string]: TournamentMatchup[] };
export type Standings = string[];

export interface TournamentFeed {
  matchups: MatchupMap;
  standings: Standings;
}

export class MatchupFeedRequest {
  public readonly feedName: string;
  public constructor(name: string) {
    this.feedName = name;
  }

  public async fetch() {
    const targetHost = ENV.hosts.api;
    let results: TournamentFeed = { matchups: {}, standings: [] };

    try {
      const axiosResponse = await axios.post(targetHost + "/feed/get", {
        application: ENV.api.token,
        name: this.feedName,
      });
      if (
        axiosResponse.data &&
        typeof axiosResponse.data["success"] !== undefined &&
        axiosResponse.data["success"] === true &&
        typeof axiosResponse.data["response"]["feed"] !== "undefined" &&
        typeof axiosResponse.data["response"]["feed"]["data"] !== "undefined"
      ) {
        // todo
        const activityFeedJSON = axiosResponse.data["response"]["feed"]["data"];
        let activityFeed: TournamentFeed | undefined = undefined;
        try {
          activityFeed = JSON.parse(activityFeedJSON);
          results = activityFeed as TournamentFeed;
        } catch {
          console.log("Unable to parse JSON feed");
          results = { matchups: {}, standings: [] };
        }
      } else {
        results = { matchups: {}, standings: [] };
      }
    } catch (err) {
      console.log(err);
      results = { matchups: {}, standings: [] };
    }
    return results;
  }
}

export default MatchupFeedRequest;
