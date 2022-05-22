const isBrowser = typeof window !== "undefined";

let theme = "";
let localStorageTheme =
  typeof localStorage !== "undefined" && localStorage["theme"] !== "undefined"
    ? localStorage.getItem("theme")
    : undefined;
if (localStorageTheme !== undefined) {
  theme = localStorageTheme as string;
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
