import React from "react";
import { faAngleDoubleRight, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Routes, RouteItem } from "../core/routes";
import Hyperlink from "./elements/hyperlink";
import { off } from "process";
import ThemeToggle from "./theme_toggle";
import { H1 } from "./elements/headings";
import LoginButton from "./login_button";

export interface OffCanvasToggleProps {
  className?: string;
}

export const OffCanvasToggle = (props: OffCanvasToggleProps) => (
  <button
    className={"mr-4 " + (props.className || "")}
    onClick={(ev) => {
      document.dispatchEvent(new CustomEvent("offcanvas_request_toggle"));
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
  isMember: boolean;
  routes: RouteItem[];
}

export class OffCanvas extends React.Component<
  React.PropsWithChildren<OffCanvasProps>,
  OffCanvasState
> {
  private mounted = false;
  public constructor(props: React.PropsWithChildren<OffCanvasProps>) {
    // run the parent constructor
    super(props);

    // in our case we always want to have something rendered for our route items
    // if none are specified, load in the core routes into our state
    this.state = {
      showing: false,
      routes: this.props.routes || Routes,
      isMember: false,
    };

    // bind
    this.onCanvasHide = this.onCanvasHide.bind(this);
    this.onCanvasShow = this.onCanvasShow.bind(this);
    this.onCanvasToggle = this.onCanvasToggle.bind(this);
    this.onMemberLogin = this.onMemberLogin.bind(this);
    this.onMemberLogout = this.onMemberLogout.bind(this);
  }

  public componentWillUnmount() {
    document.removeEventListener(
      "offcanvas_request_toggle",
      this.onCanvasToggle
    );
    document.removeEventListener("offcanvas_show", this.onCanvasShow);
    document.removeEventListener("offcanvas_hide", this.onCanvasHide);

    // we have logged in as  a member
    document.removeEventListener(
      "levelcrush_login_success",
      this.onMemberLogin
    );

    // we have logged out.
    document.removeEventListener("levelcrush_logout", this.onMemberLogout);
    this.mounted = false;
  }

  public componentDidMount() {
    if (this.mounted) {
      return;
    }
    this.mounted = true;
    document.addEventListener("offcanvas_request_toggle", this.onCanvasToggle);
    document.addEventListener("offcanvas_show", this.onCanvasShow);
    document.addEventListener("offcanvas_hide", this.onCanvasHide);

    // we have logged in as  a member
    document.addEventListener("levelcrush_login_success", this.onMemberLogin);

    // we have logged out.
    document.addEventListener("levelcrush_logout", this.onMemberLogout);
  }
  public onCanvasToggle() {
    // an event was dispatched to request either showing/hiding of the offcanvas
    // handle within this component as a "master control" since we are managing visual state here
    if (this.state.showing) {
      document.dispatchEvent(new CustomEvent("offcanvas_hide"));
    } else {
      document.dispatchEvent(new CustomEvent("offcanvas_show"));
    }
  }
  public onCanvasShow() {
    this.setState({
      showing: true,
    });
  }

  public onCanvasHide() {
    this.setState({
      showing: false,
    });
  }

  public onMemberLogin() {
    console.log("Off Canvas detected Member Login");
    this.setState({
      isMember: true,
    });
  }

  public onMemberLogout() {
    console.log("Off Canvas detected Member Logout");
    this.setState({
      isMember: false,
    });
  }

  public render() {
    return (
      <div
        className="offcanvas relative top-0 min-h-screen h-auto"
        data-showing={this.state.showing ? "1" : "0"}
        data-is-member={this.state.isMember ? "1" : "0"}
      >
        <nav
          data-offcanvas="main"
          className="offcanvas-menu bg-gradient-to-b from-white  to-slate-300 dark:bg-slate-900 dark:from-slate-800 dark:to-slate-900   shadow-[0px_1rem_1rem_2px_rgba(0,0,0,0.7)] border-r-cyan-400 border-r-2 border-r-solid bg-black text-black dark:text-white fixed z-[99999] top-0 -translate-x-full offcanvas-opened:-translate-x-0 w-[20rem]  transition-all duration-300 h-screen overflow-auto"
        >
          <H1
            className="align-middle text-black dark:text-yellow-400 text-center text-4xl font-headline font-bold uppercase tracking-widest my-4 transition duration-300"
            minimalCSS={true}
          >
            <Hyperlink className="!hover:no-underline" href="/" title="Go home">
              Level Crush
            </Hyperlink>
            <div
              className="inline-block w-auto h-auto text-lg ml-4 relative bottom-1"
              title="Toggle Dark/Light Mode"
            >
              <ThemeToggle />
            </div>
          </H1>
          <ul className="text-white font-bold">
            {(this.state.routes || []).map((routeItem, routeItemIndex) => {
              if (routeItem.loginOnly && this.state.isMember === false) {
                return <></>;
              }
              return (
                <li
                  className="group text-black dark:text-white border-b-[1px] first:border-t-[1px] border-solid border-black dark:border-cyan-500"
                  key={"routeitem_" + routeItemIndex + "_" + routeItem.url}
                >
                  <Hyperlink
                    className="p-4 block hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 transition duration-300"
                    href={routeItem.url}
                    data-has-sub={
                      (routeItem.children || []).length > 0 ? "1" : "0"
                    }
                    onClick={
                      routeItem.children
                        ? (ev) => {
                            if (ev.target) {
                              const closetLi = (
                                ev.target as HTMLAnchorElement
                              ).closest("li");
                              if (closetLi) {
                                closetLi.classList.toggle("expanded");
                                ev.preventDefault();
                                return false;
                              }
                            }
                          }
                        : undefined
                    }
                  >
                    {(routeItem.children || []).length > 0 ? (
                      <div
                        className="inline-block float-right px-4"
                        key={"routeitem_" + routeItem.url + "_expansion_toggle"}
                      >
                        <FontAwesomeIcon
                          className="expanded:rotate-90 group-hover:rotate-90 transition-all duration-300"
                          icon={faAngleDoubleRight}
                        ></FontAwesomeIcon>
                      </div>
                    ) : (
                      <></>
                    )}
                    {routeItem.name}
                    <div className="clear-both"></div>
                  </Hyperlink>

                  <nav className="offcanvas-sub-menu max-h-0 h-auto overflow-hidden transition-all duration-300 ease-in-out expanded:max-h-[100rem]">
                    <ul className="text-white font-bold">
                      {(routeItem.children || []).map(
                        (subChild, subChildIndex) => (
                          <li
                            className="text-black dark:bg-slate-900 bg-yellow-100  dark:text-white border-b-[1px] last:border-b-0 first:border-t-[1px] border-black dark:border-cyan-500 border-solid"
                            key={
                              "route_item" +
                              routeItemIndex +
                              "_" +
                              routeItem.url +
                              "_sub_" +
                              subChild.url +
                              "_" +
                              subChildIndex
                            }
                          >
                            <Hyperlink
                              className="p-4 block hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 transition duration-300"
                              href={subChild.url}
                            >
                              <span className="block border-l-2  border-solid border-black dark:border-cyan-500 pl-4">
                                {subChild.name}
                              </span>
                            </Hyperlink>
                          </li>
                        )
                      )}
                    </ul>
                  </nav>
                </li>
              );
            })}
          </ul>
          <div className="w-full h-auto p-4">
            <LoginButton></LoginButton>
          </div>
        </nav>
        <div className="offcanvas-content min-h-screen h-auto  block transition-all duration-300">
          {this.props.children}
        </div>
        <div
          className="offcanvas-background hidden transition-all duration-300 h-screen w-screen fixed opacity-0 top-0 bg-black offcanvas-opened:opacity-75 offcanvas-opened:block z-[99998]"
          onClick={(ev) => {
            document.dispatchEvent(new CustomEvent("offcanvas_hide"));
          }}
        ></div>
      </div>
    );
  }
}

export default OffCanvas;
