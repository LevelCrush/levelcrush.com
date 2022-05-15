import axios from "axios";
import { docs_v1 } from "googleapis";
import ENV from "./env";

export interface GoogleDocAsset {
  googleUrl: string;
  assetUrl: string;
  assetID: string;
  inlineObject: docs_v1.Schema$InlineObject;
}

export interface GoogleDocAssetMap {
  [key: string]: GoogleDocAsset;
}

export interface GoogleDocOutlineEntry {
  title: string; // comes from the text value of the heading
  headingID: string; // the id that is associated with the heading
  entries: GoogleDocOutlineEntry[];
}

export interface GoogleDocOutline extends GoogleDocOutlineEntry {
  documentID: string;
}

export interface GoogleDocParseConfig {
  assetUrl: string;
  fresh: boolean;
  cacheSeconds: number;
}

const DefaultGoogleDocParseConfig: GoogleDocParseConfig = {
  assetUrl: "https://assets.levelcrush.com/docImages", // use our dedicated asset server to pull from
  fresh: false, // pull from cache if possible
  cacheSeconds: 86400, // invalidate cache result after one day
};

export class GoogleDoc {
  private readonly docID;
  private doc: docs_v1.Schema$Document | undefined;
  private config: GoogleDocParseConfig;
  public constructor(
    googleDoc: string | docs_v1.Schema$Document,
    config: Partial<GoogleDocParseConfig> = DefaultGoogleDocParseConfig
  ) {
    this.config = { ...DefaultGoogleDocParseConfig, ...config };
    console.log(config);
    console.log(this.config);
    if (typeof googleDoc === "string") {
      this.docID = googleDoc;
    } else if (typeof googleDoc === "object") {
      // assume it was passed as a valid docs_v1.Schema$Document
      this.doc = googleDoc as docs_v1.Schema$Document;
    } else {
      this.docID = "";
      this.doc = undefined;
    }

    if (this.doc !== undefined) {
      this.docID = this.doc.documentId || "";
    }
  }

  /**
   * Gets the google doc value (raw)
   * @returns Google Doc Schema.
   */
  public getDoc() {
    return this.doc;
  }

  public async pull() {
    if (this.doc === undefined) {
      const request = await axios.post(ENV.hosts.api + "/feed/get", {
        application: ENV.api.token,
        name: "googledoc_" + this.docID,
      });

      if (
        request.data &&
        request.data.success &&
        request.data.response &&
        request.data["response"] &&
        request.data["response"]["feed"] &&
        request.data["response"]["feed"]["data"]
      ) {
        this.doc = JSON.parse(
          request.data["response"]["feed"]["data"]
        ) as docs_v1.Schema$Document;
      }
    }
  }

  public async generateOutline() {
    let outline: GoogleDocOutline = {
      documentID: "",
      title: "",
      headingID: "",
      entries: [],
    };

    if (this.doc && this.doc.body && this.doc.body.content) {
      outline.documentID = this.doc.documentId || "";
      // scan first for only the first Heading 1 element we find
      for (let i = 0; i < this.doc.body.content.length; i++) {
        let contentItem = this.doc.body.content[i];
        if (
          contentItem.paragraph &&
          contentItem.paragraph.paragraphStyle &&
          contentItem.paragraph.paragraphStyle.headingId &&
          contentItem.paragraph.paragraphStyle.namedStyleType &&
          contentItem.paragraph.paragraphStyle.namedStyleType === "HEADING_1"
        ) {
          const elements = contentItem.paragraph.elements || [];
          if (elements.length > 0) {
            outline.title =
              elements[0].textRun &&
              elements[0].textRun.content &&
              elements[0].textRun.content.trim().length > 0
                ? elements[0].textRun.content.trim()
                : "";
            outline.headingID = contentItem.paragraph.paragraphStyle.headingId;
          }

          if (outline.title.length > 0) {
            break;
          }
        }
      }

      if (outline.title.length > 0) {
        // we can continue

        const headingMatches = ["HEADING_2", "HEADING_3"];
        let activeEntry: GoogleDocOutlineEntry | undefined = undefined;
        let activeHeading2: GoogleDocOutlineEntry | undefined = undefined;
        let activeHeading3: GoogleDocOutlineEntry | undefined = undefined;
        for (let i = 0; i < this.doc.body.content.length; i++) {
          let contentItem = this.doc.body.content[i];
          if (
            contentItem.paragraph &&
            contentItem.paragraph.paragraphStyle &&
            contentItem.paragraph.paragraphStyle.headingId &&
            contentItem.paragraph.paragraphStyle.namedStyleType
          ) {
            // now determine what entry w e are working with
            if (
              headingMatches.includes(
                contentItem.paragraph.paragraphStyle.namedStyleType
              )
            ) {
              const elements = contentItem.paragraph.elements || [];
              const textRuns: string[] = [];
              elements.forEach((textElement) => {
                const text =
                  textElement.textRun && textElement.textRun.content
                    ? textElement.textRun.content.trim()
                    : "";

                if (text.length > 0) {
                  textRuns.push(text);
                }
              });
              const title = textRuns.join(" ").trim();

              switch (contentItem.paragraph.paragraphStyle.namedStyleType) {
                case "HEADING_2":
                  if (
                    activeHeading3 !== undefined &&
                    activeHeading2 !== undefined
                  ) {
                    activeHeading2.entries.push(activeHeading3);
                    activeHeading3 = undefined;
                  }
                  if (activeHeading2 !== undefined) {
                    outline.entries.push(activeHeading2);
                    activeHeading2 = undefined;
                  }
                  if (title.length > 0) {
                    activeHeading2 = {
                      title: title,
                      headingID: contentItem.paragraph.paragraphStyle.headingId,
                      entries: [],
                    };
                  }
                  break;
                case "HEADING_3":
                  if (
                    activeHeading2 !== undefined &&
                    activeHeading3 !== undefined
                  ) {
                    activeHeading2.entries.push(activeHeading3);
                    activeHeading3 = undefined;
                  }
                  if (title.length > 0) {
                    activeHeading3 = {
                      title: title,
                      headingID: contentItem.paragraph.paragraphStyle.headingId,
                      entries: [],
                    };
                  }
                  break;
              }
            }
          }
        }

        // insert latest heading 3
        if (activeHeading2 !== undefined && activeHeading3 !== undefined) {
          activeHeading2.entries.push(activeHeading3);
          activeHeading3 = undefined;
        }

        // insert latest heading 2
        if (activeHeading2 !== undefined) {
          outline.entries.push(activeHeading2);
          activeHeading2 = undefined;
        }
      }
    }
    return outline;
  }

  /** loop through the document and get **just the assets**  */
  public async generateAssetMap() {
    let assetMap: GoogleDocAssetMap = {};
    if (this.doc) {
      for (let assetID in this.doc.inlineObjects) {
        const inlineObject = this.doc.inlineObjects[assetID];
        if (
          inlineObject.inlineObjectProperties &&
          inlineObject.inlineObjectProperties.embeddedObject
        ) {
          let googleUrl = "";
          if (
            inlineObject.inlineObjectProperties.embeddedObject
              .imageProperties &&
            inlineObject.inlineObjectProperties.embeddedObject.imageProperties
              .contentUri
          ) {
            googleUrl =
              inlineObject.inlineObjectProperties.embeddedObject.imageProperties
                .contentUri;
          }

          assetMap[assetID] = {
            assetID: assetID,
            googleUrl: googleUrl,
            assetUrl: this.config.assetUrl + "/" + assetID,
            inlineObject: inlineObject,
          };
        }
      }
    }
    //await fs.promises.writeFile("assetMap.json", JSON.stringify(assetMap));
    return assetMap;
  }
}

export default GoogleDoc;
