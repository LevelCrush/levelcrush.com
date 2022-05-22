import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import ENV from "../../../../../core/env";
import GoogleDoc from "../../../../../core/googleDoc";

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
        const googleDoc = new GoogleDoc(
          process.env["GOOGLEDOC_DESTINY2_VOTD"] as string,
          {
            assetUrl: "https://assets.levelcrush.com/guides/destiny2/votd",
          }
        );

        console.log("Pulling fresh copy of google doc and caching");
        await googleDoc.pull(true);
      }

      webhookRunning = false;
    }

    res.status(200).send("200 OK");
  } else {
    res.status(405).send("405 Not Allowed");
  }
}
