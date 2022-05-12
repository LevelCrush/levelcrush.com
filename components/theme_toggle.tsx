import {
  faAdjust,
  faEye,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Cookies from "universal-cookie";
import ENV from "../core/env";

export type Theme = "light" | "dark" | "system";
export interface ThemeState {
  mode: Theme;
}

export class ThemeToggle extends React.Component<
  Record<string, never>,
  ThemeState
> {
  private firstLoad: boolean;
  private cookies: Cookies;
  public constructor(props: Record<string, never>) {
    super(props);

    this.firstLoad = true;
    this.cookies = new Cookies();

    this.state = {
      mode: ENV.theme as Theme,
    };

    this.themeCheck = this.themeCheck.bind(this);
    this.themeReset = this.themeReset.bind(this);
    this.themeSetDarkMode = this.themeSetDarkMode.bind(this);
    this.themeSetLightMode = this.themeSetLightMode.bind(this);
  }

  public themeSetLightMode() {
    // Whenever the user explicitly chooses light mode
    document.documentElement.classList.remove("dark");
    localStorage.theme = "light";
    this.cookies.set("theme", "light");
    this.setState(
      {
        mode: "light",
      },
      () => {
        document.dispatchEvent(
          new CustomEvent("theme_lightmode", { bubbles: true })
        );
      }
    );
  }

  public themeSetDarkMode() {
    // Whenever the user explicitly chooses dark mode
    document.documentElement.classList.add("dark");

    localStorage.theme = "dark";
    this.cookies.set("theme", "dark");
    this.setState(
      {
        mode: "dark",
      },
      () => {
        console.log("Dark Mode enabled");
        document.dispatchEvent(
          new CustomEvent("theme_darkmode", { bubbles: true })
        );
      }
    );
  }

  public themeReset() {
    // Whenever the user explicitly chooses to respect the OS preference
    localStorage.removeItem("theme");
    this.cookies.remove("theme");
    this.setState(
      {
        mode: "system",
      },
      () => {
        this.themeCheck();
      }
    );
  }

  public themeCheck() {
    if (this.state.mode === "system" || this.firstLoad) {
      this.firstLoad = false;
      if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        this.themeSetDarkMode();
      } else {
        this.themeSetLightMode();
      }
    }
  }

  public componentDidMount() {
    // todo
    this.themeCheck();

    // watch for system dark mode changes
    /* disabled this listener , due to it being inconsistent with expectation
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        //onst newColorScheme = event.matches ? 'dark' : 'light';
        this.themeReset();
      });
      */
  }

  public render() {
    return (
      <button
        className={"theme-toggle flex-auto text-center"}
        onClick={(event) =>
          this.state.mode === "light"
            ? this.themeSetDarkMode()
            : this.themeSetLightMode()
        }
        onDoubleClick={(event) => {
          this.themeReset();
        }}
      >
        <FontAwesomeIcon icon={faAdjust}></FontAwesomeIcon>
      </button>
    );
  }
}

export default ThemeToggle;
