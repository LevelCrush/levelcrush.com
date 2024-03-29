export interface RouteItem {
  url: string;
  name: string;
  pullMenuOnly?: boolean;
  loginOnly?: boolean;
  target?: "_blank" | "_self";
  children?: RouteItem[];
}

/** These are the standard routes, intended for top level site navigation  */
export const Routes = [
  {
    url: "/",
    name: "Home",
    pullMenuOnly: true,
  },

  {
    url: "/tournament/matchups",
    name: "Tournament",
    children: [
      {
        url: "/tournament/matchups",
        name: "Matchups",
      },
      {
        url: "/tournament/rules",
        name: "Rules",
      },
    ],
  },
  {
    url: "/leaderboards/destiny",
    name: "Leaderboards",
  },
  {
    url: "/guides",
    name: "Guides",
    children: [
      {
        url: "/guides",
        name: "Guides",
      },
      {
        url: "/guides/destiny2/votd",
        name: "Destiny 2 - VOTD",
      },
    ],
  },
  {
    url: "/members",
    name: "Member Dashboard",
    loginOnly: true,
    pullMenuOnly: true,
    children: [
      {
        url: "/members",
        name: "Dashboard",
      },
      {
        url: "/members/profile",
        name: "Profile",
      },
    ],
  },
] as RouteItem[];

export default Routes;
