import axios from "axios";
import { createWriteStream } from "fs";
import * as fs from "fs";
import * as mime from "mime-types";
import { Magic, MAGIC_MIME_TYPE } from "mmmagic";
import path from "path";
import ENV from "./env";
import { resolve } from "path";
import { stripHtml } from "string-strip-html";

export interface RaidGuideAsset {
  url: string;
  id: string;
  meta: string;
}

export interface RaidGuideEncounterSection {
  title: string;
  id: string;
  content: string;
  contentHtml?: string; // only populated when we are htmlify/prerendering
}

export interface RaidGuideEncounter {
  title: string;
  id: string;
  sections: { [key: string]: RaidGuideEncounterSection };
}

export interface RaidGuide {
  title: string;
  id: string;
  encounters: { [key: string]: RaidGuideEncounter };
  assets: { [key: string]: RaidGuideAsset };
}

export class RaidGuideManager {
  private name: string;
  private baseName: string;
  private guide: RaidGuide | undefined;
  public constructor(name: string) {
    this.name = "raidguide_" + name;
    this.baseName = name;
    this.guide = undefined;
  }

  public raw() {
    return this.guide;
  }

  public async htmlify() {
    if (this.guide) {
      const mediaRegex = /\[\[\{\{\s([0-9a-zA-Z.]+)\s\}\}\]\]/g;
      const assetPath = "./public";
      const guidePath = path.join(assetPath, "guides");
      const gamePath = path.join(guidePath, "destiny2");
      const raidGuidePath = path.join(gamePath, this.baseName);
      console.log(this.guide.assets, "guide assets");
      for (let encounterID in this.guide.encounters) {
        //console.log(this.guide.encounters[encounterID].sections);
        for (let sectionID in this.guide.encounters[encounterID].sections) {
          let section = this.guide.encounters[encounterID].sections[sectionID];
          //console.log(section);

          let sectionContent = section.content;
          let mediaChunks = sectionContent.trim().split(mediaRegex);
          let contentChunks: string[] = [];

          console.log(mediaChunks);

          for (let i = 0; i < mediaChunks.length; i++) {
            let content = mediaChunks[i].trim();

            if (typeof this.guide.assets[content] !== "undefined") {
              // we have a match for asset
              // we have to figure out which to serve
              // the asset can be either a jpg, png or gif
              let assetPath = path.join(raidGuidePath, content);

              let jpgPath = assetPath + ".jpg";
              let jpegPath = assetPath + ".jpeg";
              let pngPath = assetPath + ".png";
              let gifPath = assetPath + ".gif";

              let fsResults = await Promise.all([
                this.fileExists(jpgPath),
                this.fileExists(jpegPath),
                this.fileExists(pngPath),
                this.fileExists(gifPath),
              ]);

              let targetPath = "";
              for (let i = 0; i < fsResults.length; i++) {
                if (fsResults[i].result) {
                  targetPath = fsResults[i].path;
                  break;
                }
              }

              if (targetPath.trim().length > 0) {
                const extension = path.extname(targetPath);
                const urlPath =
                  "https://assets.levelcrush.com/guides/destiny2/votd/" +
                  content.trim() +
                  extension;

                // for now we will put the img element inside a picture element for future case
                contentChunks.push(
                  '<picture><img src="' + urlPath + '" /></picture>'
                );
              }
            } else {
              //replace all __()__ with <under

              // this is a major point of possible optimizaiton in the future
              let foundChange = false;
              let currentIndex = 0;

              content = stripHtml(content).result;
              do {
                // console.log('Swapping underlines', encounterID, sectionID, currentIndex);
                let newContent = this.findUnderlineInstance(
                  content,
                  currentIndex
                );
                foundChange = newContent.changed;
                if (foundChange) {
                  content = newContent.output;
                  currentIndex = newContent.index;
                }
              } while (foundChange);

              // find bold

              foundChange = false;
              currentIndex = 0;
              do {
                //  console.log('Swapping Bolds', encounterID, sectionID, currentIndex);
                let newContent = this.findBoldInstance(content, currentIndex);
                foundChange = newContent.changed;
                if (foundChange) {
                  content = newContent.output;
                  currentIndex = newContent.index;
                }
              } while (foundChange);

              // find italic

              foundChange = false;
              currentIndex = 0;
              do {
                // console.log('Swapping Italics', encounterID, sectionID, currentIndex);
                let newContent = this.findItalicInstance(content, currentIndex);
                foundChange = newContent.changed;
                if (foundChange) {
                  content = newContent.output;
                  currentIndex = newContent.index;
                }
              } while (foundChange);

              // find strikethrough

              foundChange = false;
              currentIndex = 0;
              do {
                // console.log('Swapping Strikethroughs', encounterID, sectionID, currentIndex);
                let newContent = this.findStrikeThroughInstance(
                  content,
                  currentIndex
                );
                foundChange = newContent.changed;
                if (foundChange) {
                  content = newContent.output;
                  currentIndex = newContent.index;
                }
              } while (foundChange);

              // scan and convert links
              content = this.httpTextToLink(content);

              content = this.linkToYouTubeEmbed(content);

              if (content.trim().length > 0) {
                content =
                  "<p>" + content.trim().replace(/\n/g, "<br />") + "</p>";
                contentChunks.push(content.trim());
              }
            }
          }
          (this.guide.encounters[encounterID].sections[sectionID] as any)[
            "contentHtml"
          ] = contentChunks.join("");
          //  console.log(this.guide.encounters[encounterID].sections[sectionID]);
        }
      }
    }
  }

  private linkToYouTubeEmbed(input: string) {
    const regex =
      /(<a(.*)\>http(s?)\:\/\/([wW\.]+)?youtu([a-zA-z\.]+)\/(watch\?v=)?([0-9A-Za-z\-]+)\<\/a>)/;
    const subst = `$1<iframe class="youtube-player" type="text/html" width="640" height="480"  src="https://www.youtube.com/embed/$7?autoplay=0"  frameborder="0"></iframe>`;
    return input.replace(regex, subst);
  }

  private httpTextToLink(input: string) {
    const regex = /(http(s?)\:\/\/[0-9A-Za-z\_\.\/\=\&\;\?\%\:\- ]+)/g;
    const subst = `<a href="$1" target="_blank">$1</a>`;
    return input.replace(regex, subst);
  }

  private swapTokenInstance(
    input: string,
    index: number,
    token: string,
    wrapStart: string,
    wrapEnd: string
  ) {
    let tokenStart = input.indexOf(token, index);
    let tokenEnd = 0;
    let output = "";
    let changed = false;
    if (tokenStart !== -1) {
      tokenEnd = input.indexOf(token, tokenStart + token.length) + token.length;
      if (tokenEnd !== -1) {
        let originalString = input.substring(tokenStart, tokenEnd);
        let newString = originalString
          .replace(token, wrapStart)
          .replace(token, wrapEnd);
        output = input.replace(originalString, newString);
        changed = input !== output;
      }
    }
    return {
      input: input,
      output: output,
      changed: changed,
      index: Math.max(tokenStart, tokenEnd),
    };
  }

  private findStrikeThroughInstance(input: string, index = 0) {
    const token = "~~";
    return this.swapTokenInstance(input, index, token, "<del>", "</del>");
  }

  private findItalicInstance(input: string, index = 0) {
    const token = "*";
    return this.swapTokenInstance(input, index, token, "<em>", "</em>");
  }

  private findBoldInstance(input: string, index = 0) {
    const token = "**";
    return this.swapTokenInstance(input, index, token, "<strong>", "</strong>");
  }

  private findUnderlineInstance(input: string, index = 0) {
    const token = "__";
    return this.swapTokenInstance(input, index, token, "<u>", "</u>");
  }

  private fileExists(
    pathToFile: string
  ): Promise<{ path: string; result: boolean }> {
    return new Promise((resolve) => {
      fs.access(pathToFile, (err) => {
        if (err) {
          resolve({
            path: pathToFile,
            result: false,
          });
        } else {
          resolve({
            path: pathToFile,
            result: true,
          });
        }
      });
    });
  }

  public async pull() {
    console.log("Pulling guide");
    try {
      this.guide = undefined;
      let response = await axios.post(ENV.hosts.api + "/feed/get", {
        application: ENV.api.token,
        name: this.name,
      });

      //  console.log(response.data);

      if (
        response.data &&
        typeof response.data["success"] !== "undefined" &&
        response.data["success"] === true &&
        typeof response.data["response"] !== "undefined" &&
        typeof response.data["response"]["feed"] !== "undefined" &&
        typeof response.data["response"]["feed"]["data"] !== "undefined"
      ) {
        this.guide = JSON.parse(
          response.data["response"]["feed"]["data"]
        ) as RaidGuide;
      }
    } catch (err) {
      console.log(err);
      console.log("An undefined error occurred");
      this.guide = undefined;
    }
  }

  public async prerender() {
    console.log("Pre rendering");
    if (this.guide) {
      await this.htmlify();

      const guideDirPath = "./guideCache";
      const guidePath = path.join(guideDirPath, this.name + ".json");

      await ((targetPath: string): Promise<void> => {
        return new Promise((resolve) => {
          fs.mkdir(targetPath, { recursive: true }, (err) => {
            if (err) {
              console.log("Pre Render Dir Error", err);
            }
            resolve();
          });
        });
      })(guideDirPath);

      console.log("Writing file");
      await fs.promises.writeFile(guidePath, JSON.stringify(this.guide));
    }
    console.log("Done prerendering");
  }

  public async downloadGuideAssets() {
    //
    console.log("Attempting to download guide assets");

    const assetPath = "./public";
    const guidePath = path.join(assetPath, "guides");
    const gamePath = path.join(guidePath, "destiny2");
    const raidGuidePath = path.join(gamePath, this.baseName);
    try {
      await ((raidGuidePath: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          fs.mkdir(raidGuidePath, { recursive: true }, (err) => {
            if (!err) {
              resolve();
            } else {
              console.log("Downoad Guide Assets Dir Error", err);
              reject(err);
            }
          });
        });
      })(raidGuidePath);

      if (this.guide) {
        const magic = new Magic(MAGIC_MIME_TYPE);
        for (let assetID in this.guide.assets) {
          let asset = this.guide.assets[assetID];
          let url = asset.url;

          let outputPath = path.join(raidGuidePath, asset.id);
          console.log("Downloading asset");
          await this.downloadFile(url, outputPath);

          let mimeType = await ((): Promise<string> => {
            return new Promise((resolve) => {
              magic.detectFile(outputPath, (err: any, result: any) => {
                if (err) {
                  console.log("Mime Type Error", err);
                  resolve("");
                } else {
                  resolve((result as string).trim());
                }
              });
            });
          })();

          // this is wrong.techinically. But we hope it never breaks. l o l
          let extension = mime.extension(mimeType) as string;
          let newPath = outputPath + "." + extension.trim();
          //fs.renameSync(outputPath, newPath);
          await (() => {
            return new Promise((resolve) => {
              fs.rename(outputPath, newPath, (err) => {
                if (err) {
                  console.log("Rename File err", err);
                }
                resolve(true);
              });
            });
          })();
          outputPath = newPath;
          console.log("Renamed download to : " + outputPath);
        }
      } else {
        console.log("Please pull guide");
      }
    } catch (err) {
      console.log(err);
    }

    console.log("Done attempting to download guide");
  }

  private async downloadFile(url: string, output: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const writer = createWriteStream(output);

      axios
        .get(url, { responseType: "stream" })
        .then((response) => {
          response.data.pipe(writer);

          let error: Error | undefined = undefined;
          writer.on("error", (err) => {
            error = err;
            console.log("Axios Writer Error", error);
            reject(err);
          });

          writer.on("close", () => {
            if (error === undefined) {
              resolve();
            }
          });
        })
        .catch((err) => {
          console.log("Axios Download Error", err);
          reject(err);
        });
    });
  }
}

export default RaidGuideManager;
