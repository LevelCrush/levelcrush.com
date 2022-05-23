import React from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Routes, RouteItem } from "../core/routes";
import Hyperlink from "./elements/hyperlink";
import { off } from "process";

export const OffCanvasToggle = (props: any) => (
  <button
    className="mr-4"
    onClick={(ev) => {
      console.log("Toggle clicked");
      document.dispatchEvent(
        new CustomEvent("offcanvas_request_toggle", {
          bubbles: true,
        })
      );
    }}
  >
    <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
  </button>
);

export interface OffCanvasProps {
  routes?: RouteItem[];
}

export interface OffCanvasState {
  showing: boolean;
  routes: RouteItem[];
}

export class OffCanvas extends React.Component<
  React.PropsWithChildren<OffCanvasProps>,
  OffCanvasState
> {
  public constructor(props: React.PropsWithChildren<OffCanvasProps>) {
    // run the parent constructor
    super(props);

    // in our case we always want to have something rendered for our route items
    // if none are specified, load in the core routes into our state
    this.state = {
      showing: false,
      routes: this.props.routes || Routes,
    };
  }

  public componentDidMount() {
    document.addEventListener("offcanvas_request_toggle", (ev) => {
      // an event was dispatched to request either showing/hiding of the offcanvas
      // handle within this component as a "master control" since we are managing visual state here
      console.log("A toggle request was made", this.state.showing);
      if (this.state.showing) {
        document.dispatchEvent(
          new CustomEvent("offcanvas_hide", { bubbles: true })
        );
      } else {
        document.dispatchEvent(
          new CustomEvent("offcanvas_show", { bubbles: true })
        );
      }
    });
    document.addEventListener("offcanvas_show", (ev) => {
      this.setState({
        showing: true,
      });
    });
    document.addEventListener("offcanvas_hide", (ev) => {
      this.setState({
        showing: false,
      });
    });
  }

  public render() {
    return (
      <div
        className="offcanvas group relative top-0"
        data-showing={this.state.showing ? "1" : "0"}
      >
        <nav
          data-offcanvas="main"
          className="offcanvas-menu  bg-black text-white fixed z-[99999] top-0 -translate-x-full offcanvas-opened:-translate-x-0 w-[20rem]  transition-all duration-300 h-screen overflow-auto"
        >
          <ul className="text-white font-semibold">
            {(this.state.routes || []).map((routeItem, routeItemIndex) => (
              <li
                className="text-white p-4"
                key={"routeitem_" + routeItemIndex + "_" + routeItem.name}
              >
                <Hyperlink href={routeItem.url}>{routeItem.name}</Hyperlink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="offcanvas-content block transition-all duration-300">
          {this.props.children}
        </div>
        <div
          className="offcanvas-background hidden transition-all duration-30 h-screen w-screen fixed opacity-0 top-0 bg-black offcanvas-opened:opacity-75 offcanvas-opened:block z-[99998]"
          onClick={(ev) => {
            document.dispatchEvent(
              new CustomEvent("offcanvas_hide", { bubbles: true })
            );
          }}
        ></div>
      </div>
    );
  }
}

export default OffCanvas;
