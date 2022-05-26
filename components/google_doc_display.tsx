import { docs_v1 } from "googleapis";
import React from "react";
import { GoogleDocAssetMap } from "../core/googleDoc";
import { H1, H2, H3, H4, H5, H6 } from "./elements/headings";
import { Hyperlink } from "./elements/hyperlink";

export interface GoogleDocDisplayProps {
  doc: docs_v1.Schema$Document;
  assetMap: GoogleDocAssetMap;
  className?: string;
}

function renderBlock(
  element: docs_v1.Schema$ParagraphElement,
  elementIndex: number,
  structIndex: number,
  assetMap: GoogleDocAssetMap
) {
  if (
    element.inlineObjectElement &&
    element.inlineObjectElement.inlineObjectId &&
    typeof assetMap[element.inlineObjectElement.inlineObjectId] !== "undefined"
  ) {
    const asset = assetMap[element.inlineObjectElement.inlineObjectId];
    const assetSize =
      asset.inlineObject.inlineObjectProperties &&
      asset.inlineObject.inlineObjectProperties.embeddedObject &&
      asset.inlineObject.inlineObjectProperties.embeddedObject.size
        ? asset.inlineObject.inlineObjectProperties.embeddedObject.size
        : undefined;
    let width =
      assetSize && assetSize.width && assetSize.width.magnitude
        ? assetSize.width.magnitude
        : "auto";
    let height =
      assetSize && assetSize.height && assetSize.height.magnitude
        ? assetSize.height.magnitude
        : "auto";
    const ptConversionFactor = 1.3333333333333333;
    let cropProperties =
      asset.inlineObject.inlineObjectProperties &&
      asset.inlineObject.inlineObjectProperties.embeddedObject &&
      asset.inlineObject.inlineObjectProperties.embeddedObject
        .imageProperties &&
      asset.inlineObject.inlineObjectProperties.embeddedObject.imageProperties
        .cropProperties
        ? asset.inlineObject.inlineObjectProperties.embeddedObject
            .imageProperties.cropProperties
        : undefined;

    if (typeof width !== "string") {
      // from what we know so far, ,google stores the size as PT units when coming from google doc
      width = width * ptConversionFactor;
    }
    if (typeof height !== "string") {
      height = height * ptConversionFactor;
    }

    // this is temporarily disabled since we need to modify asset server to get the original width/height of these images via google drive
    // crop offsets are based off the **original** width and height. Without knowing what that is, providing a cropped version is not accurate
    /*
    if (cropProperties && Object.keys(cropProperties).length > 0) {
      const inchToPT = 72;
      height = height as number;
      width = width as number;

      const offsetLeft = cropProperties.offsetLeft
        ? cropProperties.offsetLeft
        : 0;
      const offsetRight = cropProperties.offsetRight
        ? cropProperties.offsetRight
        : 0;
      const offsetTop = cropProperties.offsetTop ? cropProperties.offsetTop : 0;
      const offsetBottom = cropProperties.offsetBottom
        ? cropProperties.offsetBottom
        : 0;

      return (
        <span
          className="inline-block overflow-hidden  mr-8 my-8 align-top"
          key={structIndex + "_block_" + elementIndex + "_image_block"}
          style={{
            width: width,
            height: height,
            position: "relative",
            top: 0,
          }}
        >
          <img
            src={asset.assetUrl}
            key={structIndex + "_block_" + elementIndex + "_image"}
            loading="lazy"
            className="inline-block object-fill"
            style={{
              position: "relative",
              marginTop: offsetTop,
              marginLeft: offsetLeft,
              marginRight: offsetRight,
              marginBottom: offsetBottom,
              maxWidth: "none",
            }}
          />
        </span>
      );
    } else { */
    return (
      <img
        key={structIndex + "_block_" + elementIndex + "_image"}
        src={asset.assetUrl}
        loading="lazy"
        /*  width={width} Disabled for now
        height={height} */
        className="inline-block pr-4 my-8 align-top"
      />
    );
    // }
  } else {
    const textStyle =
      element.textRun && element.textRun.textStyle !== undefined
        ? element.textRun.textStyle
        : undefined;
    const isBold =
      textStyle && textStyle.bold !== undefined ? textStyle.bold : false;
    const isUnderline =
      textStyle && textStyle.underline !== undefined
        ? textStyle.underline
        : false;
    const isStrikeThrough =
      textStyle && textStyle.strikethrough !== undefined
        ? textStyle.strikethrough
        : false;
    const classList = [] as string[];
    if (isBold) {
      classList.push("font-bold");
    }
    if (isUnderline) {
      classList.push("underline");
    }
    if (isStrikeThrough) {
      classList.push("line-through");
    }

    const textUrl =
      textStyle && textStyle.link && textStyle.link.url
        ? textStyle.link.url
        : "";
    const isLink = textUrl.trim().length > 0 ? true : false;
    let videoID = "" as string;
    if (isLink) {
      if (textUrl.includes("youtu")) {
        // looking for matches on both //youtu.be and www.youtube.com or youtube.com
        const youtubeURL = new URL(textUrl);
        videoID = youtubeURL.href.includes("//youtu.be")
          ? (youtubeURL.pathname.split("/")[1] as string)
          : (youtubeURL.searchParams.get("v") as string);
      }
    }

    const textContent =
      element.textRun && element.textRun.content
        ? element.textRun.content
        : "No Text";
    const elementKey =
      "struct_" + structIndex + "_block_" + elementIndex + "_normal";
    if (textContent === "\n") {
      return <br key={elementKey + "_br"} />;
    } else if (isLink) {
      return (
        <>
          <Hyperlink key={elementKey + "_hyperlink"} href={textUrl}>
            {textContent}
          </Hyperlink>
          {videoID && videoID.trim().length > 0 ? (
            <iframe
              key={elementKey + "_iframe"}
              loading="lazy"
              src={"https://www.youtube.com/embed/" + videoID + "?autoplay=0"}
              frameBorder="0"
              width="640"
              height="480"
              className="youtube-player"
            ></iframe>
          ) : (
            <></>
          )}
        </>
      );
    } else if (classList.length > 0) {
      return (
        <span key={elementKey + "_span"} className={classList.join(" ")}>
          {textContent}
        </span>
      );
    } else {
      return <>{textContent}</>;
    }
  }
}

function renderElement(
  structElement: docs_v1.Schema$StructuralElement,
  structIndex: number,
  assetMap: GoogleDocAssetMap
) {
  if (structElement.paragraph && structElement.paragraph.elements) {
    const elements = structElement.paragraph.elements || [];

    if (
      elements.length === 1 &&
      elements[0].textRun &&
      elements[0].textRun.content === "\n"
    ) {
      return <br key={"struct_" + structIndex + "_br_only"} />;
    } else {
      return (
        <p key={"struct_" + structIndex + "_paragraph"}>
          {elements.map((element, elementIndex) =>
            renderBlock(element, elementIndex, structIndex, assetMap)
          )}
        </p>
      );
    }
  } else {
    return <></>;
  }
}

function renderHeading(paragraph: docs_v1.Schema$Paragraph) {
  const elements = paragraph.elements || [];
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
  const id =
    paragraph.paragraphStyle && paragraph.paragraphStyle.headingId
      ? paragraph.paragraphStyle.headingId
      : "";
  if (
    title.length > 0 &&
    paragraph &&
    paragraph.paragraphStyle &&
    paragraph.paragraphStyle.headingId &&
    paragraph.paragraphStyle.namedStyleType
  ) {
    const headingKey = "heading_" + id;
    switch (paragraph.paragraphStyle.namedStyleType) {
      case "HEADING_1":
        return (
          <H1
            id={id}
            key={headingKey}
            minimalCSS={true}
            className="dark:text-yellow-400 text-black  text-5xl font-headline font-bold uppercase tracking-widest mt-8 md:mt-0"
          >
            {title}
          </H1>
        );
      case "HEADING_2":
        return (
          <H2
            id={id}
            key={headingKey}
            minimalCSS={true}
            className="text-4xl dark:text-yellow-400 text-black font-headline font-bold uppercase tracking-widest mt-8 mb-4"
          >
            {title}
          </H2>
        );
      case "HEADING_3":
        return (
          <H3
            id={id}
            key={headingKey}
            minimalCSS={true}
            className="text-xl font-sans font-bold uppercase mb-4"
          >
            {title}
          </H3>
        );
      case "HEADING_4":
        return (
          <H4
            id={id}
            key={headingKey}
            minimalCSS={true}
            className="text-lg font-bold"
          >
            {title}
          </H4>
        );
      case "HEADING_5":
        return (
          <H5 id={id} key={headingKey} minimalCSS={true} className="text-lg">
            {title}
          </H5>
        );
      case "HEADING_6":
        return (
          <H6 id={id} key={headingKey} minimalCSS={true} className="text-base">
            {title}
          </H6>
        );
    }
  } else {
    return <></>;
  }
}

export const GoogleDocDisplay = (props: GoogleDocDisplayProps) => (
  <div
    className={
      "flex-[1_1_auto] lg:flex-[0_1_65%]  relative top-0 self-start guide-content mt-8 lg:mt-0 px-4" +
      " " +
      (props.className || "")
    }
  >
    {props.doc.body?.content?.map((structElement, structIndex) =>
      structElement.paragraph ? (
        structElement.paragraph.paragraphStyle &&
        structElement.paragraph.paragraphStyle &&
        structElement.paragraph.paragraphStyle.headingId &&
        structElement.paragraph.paragraphStyle.namedStyleType ? (
          renderHeading(structElement.paragraph)
        ) : (
          renderElement(structElement, structIndex, props.assetMap)
        )
      ) : (
        <></>
      )
    )}
  </div>
);

export default GoogleDocDisplay;
