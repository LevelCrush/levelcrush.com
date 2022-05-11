import React, { MouseEventHandler } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faMessage } from "@fortawesome/free-solid-svg-icons";
import ENV from "../core/env";

export interface EmbedProperties {
  platform: "twitch";
  embed: string;
  width: "100%" | number;
  height: number;
  id?: string;
  className?: string;
  hideChat?: boolean;
  onShowChat?: (ev: React.MouseEvent) => void;
  onRequestFeature?: (ev: React.MouseEvent) => void;
}

export interface EmbedState {
  sdkReady: boolean;
}

export interface TwitchEmbedPlayerInterface {
  // todo
  play: () => void;
}
export interface TwitchEmbedInterface {
  VIDEO_READY: "video.ready";
  VIDEO_PLAY: "video.play";
  VIDEO_PAUSE: "video.pause";
  SEEK: "seek";
  READY: "ready";
  PAUSE: "pause";
  ONLINE: "online";
  OFFLINE: "offline";
  ERROR: "error";
  ENDED: "ended";
  CAPTIONS: "captions";
  AUTHENTICATE: "authenticate";
  PLAYBACK_BLOCKED: "playbackBlocked";
  Errors: {
    1: "GeoBlocked";
    2: "UnsupportedDevice";
    3: "AnonymizerBlocked";
    4: "CellularNetworkProhibited";
    5: "UnauthorizationEntitlements";
    6: "VodRestricted";
    509: "LVSCCUCap";
    1000: "Aborted";
    2000: "Network";
    2001: "CCUCapReached";
    3000: "Decode";
    4000: "FormatNotSupported";
    5000: "ContentNotAvailable";
    6000: "RendererNotAvailable";
    7004: "SafariUnsupportedDevice";
    8001: "Fatal";
    8002: "Offline";
    8003: "FatalAuth";
    8004: "WarnAuth";
    ABORTED: 1000;
    Aborted: 1000;
    AnonymizerBlocked: 3;
    CCUCapReached: 2001;
    CONTENT_NOT_AVAILABLE: 5000;
    CellularNetworkProhibited: 4;
    ContentNotAvailable: 5000;
    DECODE: 3000;
    Decode: 3000;
    FORMAT_NOT_SUPPORTED: 4000;
    Fatal: 8001;
    FatalAuth: 8003;
    FormatNotSupported: 4000;
    GeoBlocked: 1;
    LVSCCUCap: 509;
    NETWORK: 2000;
    Network: 2000;
    Offline: 8002;
    RENDERER_NOT_AVAILABLE: 6000;
    RendererNotAvailable: 6000;
    SafariUnsupportedDevice: 7004;
    UnauthorizationEntitlements: 5;
    UnsupportedDevice: 2;
    VodRestricted: 6;
    WarnAuth: 8004;
  };

  addEventListener: (e: Event | string, t: unknown) => unknown;
  buildIframe: () => unknown;
  destroy: () => unknown;
  getPlayer: () => unknown;
  removeEventListener: (e: Event | string, t: unknown) => unknown;
  render: () => unknown;
}

export interface TwitchInterface {
  Embed: TwitchEmbedInterface;
}

export class Embed extends React.Component<EmbedProperties, EmbedState> {
  private readonly elementID: string;
  private readonly chatID: string;
  private readonly containerID: string;

  private embed: TwitchEmbedInterface | undefined;
  private player: TwitchEmbedPlayerInterface | undefined;
  private chat: HTMLIFrameElement | undefined;
  public constructor(props: EmbedProperties) {
    super(props);

    this.createEmbedChat = this.createEmbedChat.bind(this);
    this.createEmbedPlayer = this.createEmbedPlayer.bind(this);
    this.showChat = this.showChat.bind(this);
    this.hideChat = this.hideChat.bind(this);
    this.toggleChat = this.toggleChat.bind(this);
    this.requestFeature = this.requestFeature.bind(this);

    // find an id where this does not match
    // remember, there could be multiple instances of this embed on the page
    // not likely, but possible
    this.elementID = "";
    if (ENV.isBrowser) {
      if (this.props.id === undefined) {
        let i = 0;
        let id =
          this.props.platform + "_" + this.props.embed + (++i).toString();
        while (document.getElementById(id) !== null) {
          id = this.props.platform + "_" + this.props.embed + (++i).toString();
        }
        this.elementID = id + "_embed";
      } else {
        this.elementID = this.props.id;
      }
    }
    this.chatID = this.elementID + "_chat";
    this.containerID = this.elementID + "_container";
    this.chat = undefined;
    this.state = {
      sdkReady: false,
    };
  }

  public componentDidMount() {
    if (this.props.platform === "twitch") {
      // determine if the twitch api is loaded on the page

      const isTwitchSDKIncluded =
        typeof (window as unknown as { [key: string]: unknown })["Twitch"] !==
        "undefined";
      const scriptFound = document.querySelector(
        'script[src="https://embed.twitch.tv/embed/v1.js"]'
      );
      if (!isTwitchSDKIncluded) {
        let scriptElement = document.createElement("script");
        if (scriptFound === null) {
          // insert our twitch embed "sdk"
          scriptElement = document.createElement("script");
          //<script src="https://embed.twitch.tv/embed/v1.js"></script>
          scriptElement.src = "https://embed.twitch.tv/embed/v1.js";
        } else {
          scriptElement = scriptFound as HTMLScriptElement;
        }
        scriptElement.addEventListener("load", () => {
          this.createEmbedPlayer();
        });
        document.head.append(scriptElement);
      } else {
        this.createEmbedPlayer();
      }
    }
  }

  public createEmbedPlayer() {
    const TwitchSDK = (window as unknown as { [key: string]: unknown })[
      "Twitch"
    ] as TwitchInterface;
    this.embed = new (TwitchSDK.Embed as any)(this.elementID, {
      width: "100%",
      height: "480",
      channel: this.props.embed,
      autoplay: true,
      muted: true,
      layout: "video",
    }) as TwitchEmbedInterface;

    this.embed.addEventListener(TwitchSDK.Embed.VIDEO_READY, () => {
      this.player = (
        this.embed as TwitchEmbedInterface
      ).getPlayer() as TwitchEmbedPlayerInterface;
    });

    this.createEmbedChat();

    this.setState({
      sdkReady: true,
    });
  }

  public createEmbedChat() {
    // todo
    this.chat = document.createElement("iframe");

    const options = {
      parent: window.location.hostname,
    };

    const srcQueryParams = new URLSearchParams(options);
    this.chat.src =
      "https://twitch.tv/embed/" +
      encodeURIComponent(this.props.embed) +
      "/chat?" +
      srcQueryParams.toString();
    this.chat.width = "100%";
    this.chat.height = "480";

    document.getElementById(this.chatID)?.append(this.chat);
  }

  public showChat() {
    console.log("Showing Chat Window");
    const chatContainer = document.getElementById(this.chatID);
    if (chatContainer) {
      chatContainer.classList.replace("md:max-w-0", "md:max-w-full");
      chatContainer.classList.replace("max-h-0", "max-h-full");
      chatContainer.classList.add("active");
    }
  }

  public hideChat() {
    console.log("Hiding chat window");
    const chatContainer = document.getElementById(this.chatID);
    if (chatContainer) {
      chatContainer.classList.remove("active");
      chatContainer.classList.replace("md:max-w-full", "md:max-w-0");
      chatContainer.classList.replace("max-h-full", "max-h-0");
    }
  }

  public toggleChat() {
    const chatContainer = document.getElementById(this.chatID);
    if (chatContainer) {
      if (!chatContainer.classList.contains("active")) {
        this.showChat();
      } else {
        this.hideChat();
      }
    }
  }

  public requestFeature(ev: React.MouseEvent) {
    // todo
    console.log("Requesting this embed to have some sort of feature state");
    if (this.props.onRequestFeature !== undefined) {
      this.props.onRequestFeature(ev);
    }
  }

  public render() {
    return (
      <div className={"embed group " + " " + this.props.className}>
        <button
          className="lg:opacity-0 group-focus:opacity-100 group-hover:opacity-100 loat-left inline-block transition m-2 hover:cursor-pointer hover:bg-blue-900 bg-blue-600 text-white text-base px-4 py-2"
          onClick={this.toggleChat}
        >
          <FontAwesomeIcon
            className="mr-4"
            icon={faMessage}
            color="white"
            size="1x"
          />
          <span>Toggle Chat</span>
        </button>
        <button
          className="lg:opacity-0 group-focus:opacity-100 group-hover:opacity-100 float-right inline-block transition m-2 hover:cursor-pointer hover:bg-blue-900 bg-blue-600 text-white text-base px-4 py-2"
          onClick={this.requestFeature}
        >
          <FontAwesomeIcon
            className="mr-4"
            icon={faBookmark}
            color="white"
            size="1x"
          />
          <span>Feature</span>
        </button>

        <div
          id={this.containerID}
          className="flex clear-both flex-wrap md:flex-nowrap"
        >
          <div id={this.elementID} className="flex-auto transition-all"></div>
          <div
            id={this.chatID}
            className={
              "flex-initial basis-full md:basis-2/5 transition-all overflow-hidden" +
              " " +
              (this.props.hideChat ? "md:max-w-0 max-h-0" : "active")
            }
          ></div>
        </div>
      </div>
    );
  }
}

export default Embed;
