import moment from "moment";
import React from "react";
import ENV from "../core/env";
import Embed from "./embed";

export interface EmbedGalleryProperties {
  embeds: string[];
  type: "carousel";
  id?: string;
}

export interface EmbedGalleryState {
  loaded: boolean;
}

export class EmbedGallery extends React.Component<
  EmbedGalleryProperties,
  EmbedGalleryState
> {
  public id = "";

  public constructor(props: EmbedGalleryProperties) {
    super(props);

    this.state = {
      loaded: false,
    };

    this.embedWantsFeature = this.embedWantsFeature.bind(this);
    this.renderCarosouel = this.renderCarosouel.bind(this);
  }

  public componentDidMount() {
    let attempts = 0;
    this.id = "";
    this.id = this.props.id
      ? this.props.id
      : "gallery_" + moment().unix().toString() + "";
    while (document.getElementById(this.id) !== null) {
      attempts++;
      this.id = this.props.id
        ? this.props.id
        : "gallery_" + moment().unix().toString() + +attempts.toString();
    }
    // todo fill
    const embedElements = document.querySelectorAll(
      "#" + this.id + " div.embed"
    );
    this.setState(
      {
        loaded: true,
      },
      () => {
        console.log("Done figuring out embed gallerys");
      }
    );
  }

  public embedWantsFeature(ev: React.MouseEvent) {
    console.log("Here at parent gallery", ev);

    const target = ev.target as HTMLElement;
    const targetEmbed = target.closest("div.embed");
    const gallery = target.closest(".embed-carousel");
    const featuredEmbed = document.querySelector(
      "#" + this.id + " div.embed.scale-100"
    );
    const galleryCenterOrder =
      gallery && gallery.getAttribute("data-center-order")
        ? gallery.getAttribute("data-center-order")
        : "";

    if (featuredEmbed && gallery && targetEmbed && galleryCenterOrder) {
      //featured;
      let currentOrder = "";
      targetEmbed.classList.forEach((val, key) => {
        if (val.toLowerCase().includes("order-")) {
          currentOrder = val.toLowerCase();
        }
      });

      targetEmbed.classList.replace(currentOrder, galleryCenterOrder);
      featuredEmbed.classList.replace(galleryCenterOrder, currentOrder);

      featuredEmbed.classList.replace("scale-100", "scale-75");
      targetEmbed.classList.replace("scale-75", "scale-100");
    }
  }

  public renderCarosouel() {
    const totalEmbeds = this.props.embeds.length;
    const centerEmbedScale = "scale-100";
    const nonCenterScale = "scale-75";

    const startingCenterIndex =
      (totalEmbeds > 1 ? Math.ceil(totalEmbeds / 2) : 1) - 1;

    /**
     * @tailwind hint we need the following classes
     * We need to do it via comments here to trick the tailwind generator into thinking its being used
     * We are setting it dynamically based off index so this is required (it does not work for me yet otherwise)
     * order-1
     * order-2
     * order-3
     * order-4
     * order-5
     * order-6
     * order-7
     * order-8
     * order-9
     * order-10
     */

    if (!this.state.loaded) {
      return <></>;
    }
    return (
      <div
        id={this.id}
        className="embed-carousel flex-auto flex justify-center items-center flex-wrap "
        data-center-order={"order-" + (startingCenterIndex + 1)}
      >
        {this.props.embeds.map((val, index) => (
          <Embed
            className={
              "flex-initial w-full max-w-[40rem] lg:max-w-[33%] 2xl:max-w-[31.25rem]  4k:max-w-[40rem] origin-center transition order-" +
              (index + 1) +
              " " +
              (index === startingCenterIndex
                ? centerEmbedScale
                : nonCenterScale)
            }
            key={index}
            id={"gallery_embed_" + index.toString() + "_" + val}
            platform="twitch"
            width="100%"
            height={480}
            embed={val}
            hideChat={true}
            onRequestFeature={this.embedWantsFeature}
          />
        ))}
      </div>
    );
  }

  public render() {
    return this.renderCarosouel();
  }
}

export default EmbedGallery;
