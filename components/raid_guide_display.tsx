import React from "react";
import { RaidGuide } from "../core/raid_guide";

export interface RaidGuideDisplayProps {
  guide: RaidGuide;
}

export class RaidGuideDisplay extends React.Component<RaidGuideDisplayProps> {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div
        id="slides"
        className="flex-[1_1_auto] lg:flex-[0_1_65%]  relative top-0 self-start guide-content mt-8 lg:mt-0"
      >
        {Object.keys(this.props.guide.encounters).map(
          (encounterID, encounterIndex) => (
            <article className="slide px-4" key={"encounter_" + encounterIndex}>
              <h2
                id={encounterID}
                className="text-2xl lg:text-3xl underline font-bold uppercase font-sans"
              >
                {this.props.guide.encounters[encounterID].title}
              </h2>
              {Object.keys(
                this.props.guide.encounters[encounterID].sections
              ).map((sectionID, sectionIndex) => (
                <section
                  key={
                    "encounter_" + encounterIndex + "_section_" + sectionIndex
                  }
                >
                  <h3
                    id={sectionID}
                    className="text-xl underline uppercase font-bold font-sans"
                  >
                    {
                      this.props.guide.encounters[encounterID].sections[
                        sectionID
                      ].title
                    }
                  </h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.props.guide.encounters[encounterID].sections[
                        sectionID
                      ].contentHtml as string,
                    }}
                  ></div>
                </section>
              ))}
            </article>
          )
        )}
      </div>
    );
  }
}
