import { docs_v1 } from "googleapis";
import Image from "next/image";
import React, { useState } from "react";
import { GoogleDocAssetMap } from "../core/googleDoc";
import { H1, H2, H3, H4, H5, H6 } from "./elements/headings";

export interface GoogleDocDisplayProps {
  doc: docs_v1.Schema$Document;
  assetMap: GoogleDocAssetMap;
  className?: string;
}

function renderBlock(
  block: string,
  structIndex: number,
  blockIndex: number,
  assetMap: GoogleDocAssetMap
) {
  if (typeof assetMap[block.trim()] !== "undefined") {
    const asset = assetMap[block.trim()];
    console.log("Asset Url: ", asset.assetUrl);
    return (
      <img
        key={structIndex + "_block_" + blockIndex + "_image"}
        src={asset.assetUrl}
        loading="lazy"
        className="inline-block w-auto h-auto"
      />
    );
  }

  return <>{block}</>;
}

function renderElement(
  structElement: docs_v1.Schema$StructuralElement,
  structIndex: number,
  assetMap: GoogleDocAssetMap
) {
  if (structElement.paragraph && structElement.paragraph.elements) {
    const elements = structElement.paragraph.elements || [];
    const textRuns: string[] = [];
    elements.forEach((textElement) => {
      const text =
        textElement.textRun && textElement.textRun.content
          ? textElement.textRun.content
          : "";
      if (
        textElement.inlineObjectElement &&
        textElement.inlineObjectElement.inlineObjectId
      ) {
        textRuns.push(textElement.inlineObjectElement.inlineObjectId);
      }

      if (text.length > 0) {
        textRuns.push(text);
      }
    });

    return (
      <>
        {textRuns.map((block, blockIndex) =>
          block === "\n" ? (
            <br key={structIndex + "_block_" + blockIndex} />
          ) : (
            renderBlock(block, structIndex, blockIndex, assetMap)
          )
        )}
      </>
    );
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
          <H1 id={id} key={headingKey}>
            {title}
          </H1>
        );
      case "HEADING_2":
        return (
          <H2 id={id} key={headingKey}>
            {title}
          </H2>
        );
      case "HEADING_3":
        return (
          <H3 id={id} key={headingKey}>
            {title}
          </H3>
        );
      case "HEADING_4":
        return (
          <H4 id={id} key={headingKey}>
            {title}
          </H4>
        );
      case "HEADING_5":
        return (
          <H5 id={id} key={headingKey}>
            {title}
          </H5>
        );
      case "HEADING_6":
        return (
          <H6 id={id} key={headingKey}>
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
      "flex-[1_1_auto] lg:flex-[0_1_65%]  relative top-0 self-start guide-content mt-8 lg:mt-0" +
      " " +
      (props.className || "")
    }
  >
    {props.doc.body?.content?.map((structElement, structIndex) => (
      <>
        {structElement.paragraph ? (
          <>
            {structElement.paragraph.paragraphStyle &&
            structElement.paragraph.paragraphStyle &&
            structElement.paragraph.paragraphStyle.headingId &&
            structElement.paragraph.paragraphStyle.namedStyleType
              ? renderHeading(structElement.paragraph)
              : renderElement(structElement, structIndex, props.assetMap)}
          </>
        ) : (
          <></>
        )}
      </>
    ))}
  </div>
);

export default GoogleDocDisplay;
