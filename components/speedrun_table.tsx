import React from "react";
import Hyperlink from "./elements/hyperlink";

export interface SpeedRunProps {
  id: string;
  title: string;
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
    <table className="block lg:table  table-auto w-full border-black dark:border-white lg:border-[1px] border-solid ">
      <thead className="hidden lg:table-header-group">
        <tr className="block bg-white even:bg-slate-100 dark:bg-black dark:even:bg-slate-900 lg:table-row border-b-[1px] dark:border-b-white border-b-black">
          <td className="text-center border-r-none lg:border-r-[1px] border-r-black dark:border-r-white  pl-2 block lg:table-cell lg:text-left ">
            #
          </td>
          <td className="block lg:table-cell text-left py-1 lg:pl-2">
            Duration
          </td>
          <td className="block lg:table-cell text-center py-1">Video</td>
          {props.addlHeaders.map((header, header_index) => (
            <td
              className="block lg:table-cell text-center py-1 "
              key={"speedrun_" + props.id + "_header_" + header_index}
            >
              {header}
            </td>
          ))}
          <td className="block lg:table-cell text-right py-1 pr-2">Verified</td>
        </tr>
      </thead>
      <tbody className="block lg:table-row-group">
        {props.data.length === 0 ? (
          <tr className="bg-white even:bg-slate-100 dark:bg-black dark:even:bg-slate-900 block border-[1px] border-black dark:border-white lg:table-row my-4 border-t-[1px] border-t-black dark:border-t-white">
            <td
              className="text-center  pl-2 block lg:table-cell py-2   border-b-[1px] border-b-black dark:border-b-white lg:bg-transparent "
              colSpan={3 + props.addlHeaders.length}
            >
              Submit your entry by joining the discord and then DMing
              Primal#7344 on discord.
            </td>
          </tr>
        ) : (
          props.data.map((speedrun, speedrun_index) => (
            <tr
              className="bg-white even:bg-slate-100 dark:bg-black dark:even:bg-slate-900 block border-[1px] border-black dark:border-white lg:table-row my-4 border-t-[1px] border-t-black dark:border-t-white"
              key={"speedrun_" + props.id + "_row_" + speedrun_index}
            >
              <td className="text-center  pl-2 block lg:table-cell lg:text-left py-2 border-r-none lg:border-r-[1px] border-r-black dark:border-r-white border-b-[1px] border-b-black dark:border-b-white lg:bg-transparent ">
                # {(speedrun_index + 1).toString().padStart(2, "0")}
              </td>
              <td className="block lg:table-cell  lg:text-left text-center  lg:pl-2 py-1">
                {speedrun.duration}
              </td>
              <td className="block lg:table-cell text-center py-1">
                {render_field_value(speedrun.video)}
              </td>
              {props.addlHeaders.map((header, header_index) =>
                typeof speedrun[header] !== "undefined" ? (
                  <td
                    className="block lg:table-cell text-center py-1"
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
              <td
                className={
                  (speedrun.verified ? "bg-green-600" : "bg-yellow-600") +
                  " block lg:table-cell text-center sm:text-white md:text-white lg:text-black lg:dark:text-white border-t-[1px] border-t-black dark:border-t-white lg:bg-transparent lg:text-right py-1 lg:pr-2"
                }
              >
                {speedrun.verified ? "Verified" : "Unverified"}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default SpeedRunTable;
