import { faAdjust } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import ENV from "../core/env";

export type Theme = "light" | "dark" | "system";
export interface ThemeState {
  mode: Theme;
}

export interface ThemeProps {
  className?: string;
}

export class ThemeToggle extends React.Component<ThemeProps, ThemeState> {
  private firstLoad: boolean;
  private mounted: boolean = false;
  public constructor(props: Record<string, never>) {
    super(props);

    this.firstLoad = true;
    this.state = {
      mode: ENV.theme as Theme,
    };

    this.themeCheck = this.themeCheck.bind(this);
    this.themeReset = this.themeReset.bind(this);

    this.onDarkMode = this.onDarkMode.bind(this);
    this.onLightMode = this.onLightMode.bind(this);
  }

  public themeSetLightMode() {
    // Whenever the user explicitly chooses light mode
    document.documentElement.classList.remove("dark");
    localStorage.colorstyle = "light";
    document.dispatchEvent(new CustomEvent("theme_lightmode"));
  }

  public themeSetDarkMode() {
    // Whenever the user explicitly chooses dark mode
    document.documentElement.classList.add("dark");
    localStorage.colorstyle = "dark";
    console.log("Dark Mode enabled");
    document.dispatchEvent(new CustomEvent("theme_darkmode"));
  }

  public themeReset() {
    // Whenever the user explicitly chooses to respect the OS preference
    localStorage.removeItem("theme");
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

      // no theme found.
      if (!("colorstyle" in localStorage)) {
        this.themeSetDarkMode();
      } else {
        if (localStorage.colorstyle === "dark") {
          this.themeSetDarkMode();
        } else {
          this.themeSetLightMode();
        }
      }
    }
  }

  public componentWillUnmount() {
    this.mounted = false;
    this.firstLoad = false;
    document.removeEventListener("theme_darkmode", this.onDarkMode);
    document.removeEventListener("theme_lightmode", this.onLightMode);
  }

  public componentDidMount() {
    if (this.mounted) {
      return;
    }
    this.mounted = true;
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

    document.addEventListener("theme_darkmode", this.onDarkMode);
    document.addEventListener("theme_lightmode", this.onLightMode);
  }

  private onDarkMode() {
    this.setState({
      mode: "dark",
    });
  }

  private onLightMode() {
    this.setState({
      mode: "light",
    });
  }

  public render() {
    return (
      <button
        className={
          "theme-toggle flex-auto text-center " + (this.props.className || "")
        }
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
