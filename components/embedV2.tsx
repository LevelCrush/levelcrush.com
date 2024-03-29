import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faMessage } from "@fortawesome/free-solid-svg-icons";
import ENV from "../core/env";
import { H2 } from "./elements/headings";

export interface EmbedProperties {
  platform: "twitch";
  embed: string;
  creator?: string;
  width: "100%" | string | number;
  height: string | number;
  embedID: string;
  className?: string;
  hideChat?: boolean;
  poster: string;
  onShowChat?: (ev: React.MouseEvent) => void;
  onRequestFeature?: (ev: React.MouseEvent) => void;
}

export interface EmbedState {
  sdkReady: boolean;
  playerReady: boolean;
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
  private _mounted: boolean;
  public constructor(props: EmbedProperties) {
    super(props);

    this.createEmbedChat = this.createEmbedChat.bind(this);
    this.createEmbedPlayer = this.createEmbedPlayer.bind(this);
    this.showChat = this.showChat.bind(this);
    this.hideChat = this.hideChat.bind(this);
    this.toggleChat = this.toggleChat.bind(this);
    this.requestFeature = this.requestFeature.bind(this);
    this._mounted = false;

    // find an id where this does not match
    // remember, there could be multiple instances of this embed on the page
    // not likely, but possible
    this.elementID = "";
    if (this.props.embedID === undefined) {
      let i = 0;
      let id = this.props.platform + "_" + this.props.embed + (++i).toString();
      while (document.getElementById(id) !== null) {
        id = this.props.platform + "_" + this.props.embed + (++i).toString();
      }
      this.elementID = id + "_embed";
    } else {
      this.elementID = this.props.embedID;
    }

    this.chatID = this.elementID + "_chat";
    this.containerID = this.elementID + "_container";
    this.chat = undefined;
    this.state = {
      sdkReady: false,
      playerReady: false,
    };

    this.handleVideoReady = this.handleVideoReady.bind(this);
  }

  public componentDidMount() {
    if (this._mounted) {
      return;
    }
    // nextjs will mount twice in dev mode(this is due to how react works when hydrating)
    // since this is not a typical react style component, we'll track componentDidMount to make sure we dont duplicate
    this._mounted = true;
    if (this.props.platform === "twitch") {
      // determine if the twitch api is loaded on the page
      console.log("Waiting to load...", this.props.embed);
      setTimeout(() => {
        console.log("Trigger load for embed", this.props.embed);
        this.createEmbedPlayer();
      }, 2000);
    }
  }

  public componentWillUnmount() {
    if (this.embed) {
      const TwitchSDK = (window as unknown as { [key: string]: unknown })[
        "Twitch"
      ] as TwitchInterface;
      this.embed.removeEventListener(
        TwitchSDK.Embed.VIDEO_READY,
        this.handleVideoReady
      );
    }
  }

  public createEmbedPlayer() {
    if (ENV.isBrowser) {
      const TwitchSDK = (window as unknown as { [key: string]: unknown })[
        "Twitch"
      ] as TwitchInterface;
      this.embed = new (TwitchSDK.Embed as any)(this.elementID, {
        width: this.props.width.toString(),
        height: this.props.height.toString(),
        channel: this.props.embed,
        autoplay: true,
        muted: true,
        layout: "video",
      }) as TwitchEmbedInterface;

      this.embed.addEventListener(
        TwitchSDK.Embed.VIDEO_READY,
        this.handleVideoReady
      );

      this.createEmbedChat();

      this.setState({
        sdkReady: true,
      });
    }
  }

  private handleVideoReady() {
    this.player = (
      this.embed as TwitchEmbedInterface
    ).getPlayer() as TwitchEmbedPlayerInterface;
    console.log("Player ready", this.props.embed);
    this.setState({
      playerReady: true,
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
    this.chat.height = this.props.height.toString();
    (this.chat as any).loading = "lazy";

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
      <div className={"embed group " + " " + (this.props.className || "")}>
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
          className="embed-loading relative top-0 h-[30rem] items-center justify-center flex"
          style={{
            display: this.state.playerReady ? "none" : "flex",
            backgroundImage: "url(" + this.props.poster + ")",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
        >
          <div className="embed-loading-messsage bg-white p-8 flex-initial">
            <H2
              className="text-black text-2xl font-sans font-bold  "
              minimalCSS={true}
            >
              <span className="text-purple-500 text-3xl">
                {this.props.creator || this.props.embed}
              </span>{" "}
              is loading!
            </H2>
          </div>
        </div>
        <div
          id={this.containerID}
          className="flex clear-both flex-wrap md:flex-nowrap"
          style={{
            display: this.state.playerReady ? "flex" : "none",
          }}
        >
          <div id={this.elementID} className="flex-auto transition-all"></div>
          <div
            id={this.chatID}
            className={
              "flex-initial basis-full md:basis-2/5 transition-all overflow-hidden " +
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
