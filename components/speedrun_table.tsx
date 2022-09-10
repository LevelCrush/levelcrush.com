import React from "react";
import Hyperlink from "./elements/hyperlink";

export interface SpeedRunProps {
  id: string;
  addlHeaders: string[];
  data: {
    duration: string;
    video: string;
    verified: boolean;
    [header: string]: string | boolean;
  }[];
}

function render_field_value(value: string) {
  const isHyperlink = value.indexOf("http") === 0;

  if (isHyperlink) {
    return (
      <Hyperlink target="_blank" href={value}>
        {value}
      </Hyperlink>
    );
  } else {
    return <>{value}</>;
  }
}

export const SpeedRunTable = (props: SpeedRunProps) => (
  <div className="container mx-auto speedrun-table" id={props.id}>
    <table className="table-auto w-full border-black dark:border-white border-[1px] border-solid ">
      <thead>
        <tr className="border-b-[1px] dark:border-b-white border-b-black">
          <td className="text-left py-1 pl-2">Duration</td>
          <td className="text-center py-1">Video</td>
          {props.addlHeaders.map((header, header_index) => (
            <td
              className="text-center py-1 "
              key={"speedrun_" + props.id + "_header_" + header_index}
            >
              {header}
            </td>
          ))}
          <td className="text-right py-1 pr-2">Verified</td>
        </tr>
      </thead>
      <tbody>
        {props.data.map((speedrun, speedrun_index) => (
          <tr key={"speedrun_" + props.id + "_row_" + speedrun_index}>
            <td className="text-left py-1 pl-2">{speedrun.duration}</td>
            <td className="text-center py-1">
              {render_field_value(speedrun.video)}
            </td>
            {props.addlHeaders.map((header, header_index) =>
              typeof speedrun[header] !== "undefined" ? (
                <td
                  className="text-center py-1"
                  key={
                    "speedrun_" +
                    props.id +
                    "_row_" +
                    speedrun_index +
                    "_header_" +
                    header_index
                  }
                >
                  {typeof speedrun[header] === "string" ? (
                    render_field_value(speedrun[header] as string)
                  ) : (
                    <span>{speedrun[header] === true ? "Yes" : "No"}</span>
                  )}
                </td>
              ) : (
                // no need
                <></>
              )
            )}
            <td className="text-right py-1 pr-2">
              {speedrun.verified ? "Verified" : "Unverified"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SpeedRunTable;
