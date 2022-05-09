import axios from "axios";
import ENV from "./env";
import LFGActivity from "./lfg_activity";

export class LFGFeedRequest {
  public readonly feedName: string;
  public constructor(name: string) {
    this.feedName = name;
  }

  public async fetch() {
    const targetHost = ENV.hosts.api;
    let results: LFGActivity[] = [];

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
        let activityFeed: LFGActivity[] | undefined = undefined;
        try {
          activityFeed = JSON.parse(activityFeedJSON);
          results = activityFeed as LFGActivity[];
        } catch {
          console.log("Unable to parse JSON feed");
          results = [];
        }
      } else {
        results = [];
      }
    } catch (err) {
      console.log(err);
      results = [];
    }
    return results;
  }
}

export default LFGFeedRequest;
