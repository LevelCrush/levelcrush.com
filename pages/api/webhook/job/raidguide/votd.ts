import axios from "axios";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import ENV from "../../../../../core/env";
import RaidGuideManager from "../../../../../core/raid_guide";

let webhookRunning = false;

/** probably a way to do this via a class, but its 3am and I dont want to play around */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST" && typeof req.body !== "string") {
    console.log(req.body, typeof req.body);
    const form = req.body as {
      token?: string;
      token_secret?: string;
    };

    let serverResponse = {
      success: true,
      response: {} as { [key: string]: unknown },
      errors: [] as string[],
    };

    if (webhookRunning) {
      serverResponse.success = false;
      serverResponse.errors.push("Already Running");
    } else {
      webhookRunning = true;
      let appToken = form.token !== undefined ? form.token.trim() : "";
      let appTokenSecret =
        form.token_secret !== undefined ? form.token_secret.trim() : "";

      console.log([appToken, appTokenSecret]);
      const axiosResponse = await axios.post(
        ENV.hosts.api + "/application/verify",
        {
          token: appToken,
          token_secret: appTokenSecret,
        }
      );

      let isCallerValid = false;
      if (axiosResponse.data) {
        const apiResponse = axiosResponse.data as {
          success: boolean;
          response: {
            verified: boolean;
            timestamp: number;
          };
          errors: string[];
        };

        isCallerValid = apiResponse.response.verified;
      }

      if (isCallerValid) {
        let raidguide = new RaidGuideManager("votd");

        try {
          console.log("Pulling raid guide from api");
          await raidguide.pull();

          console.log("Pre rendering and downloading assets");
          // download files first
          // now handled by assets.levelcrush.com
          // however we still need to download on our serve side to make sure that
          // we know how what extension to serve when dealing when pre rendering the html
          // we no longer need to do this since our asset server can now auto detect our use case
          //await raidguide.downloadGuideAssets();

          // pre rendering requires us to inspect the file tree. HAVE to run after downloading
          // downloading no longer required 05/15/2022
          await raidguide.prerender();
        } catch (err) {
          console.log(err);
        }
      }

      webhookRunning = false;
    }

    res.status(200).send("200 OK");
  } else {
    res.status(405).send("405 Not Allowed");
  }
}
