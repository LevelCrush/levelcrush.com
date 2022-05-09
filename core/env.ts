import Cookies from "universal-cookie";
import { Theme } from "../components/theme_toggle";

const isBrowser = typeof window !== "undefined";

const docCookie = new Cookies();
let theme = "";
let localStorageTheme =
  typeof localStorage !== "undefined" && localStorage["theme"] !== "undefined"
    ? (localStorage.getItem("theme") as Theme)
    : undefined;
let cookieTheme = docCookie.get("theme") ? docCookie.get("theme") : undefined;
if (localStorageTheme !== undefined) {
  theme = localStorageTheme;
} else if (cookieTheme !== undefined) {
  theme = cookieTheme;
} else {
  theme = "system";
}

export const ENV = {
  isBrowser: isBrowser,
  theme: theme,
  hosts: {
    api: process.env["NEXT_PUBLIC_HOST_API"],
    frontend: process.env["NEXT_PUBLIC_HOST_FRONTEND"],
    login: process.env["NEXT_PUBLIC_HOST_LOGIN"],
  },
  api: {
    token: isBrowser
      ? process.env["NEXT_PUBLIC_API_TOKEN"]
      : process.env["PLATFORM_API_TOKEN"],
    token_secret: isBrowser ? "" : process.env["PLATFORM_API_TOKEN_SECRET"],
  },
};

export default ENV;
