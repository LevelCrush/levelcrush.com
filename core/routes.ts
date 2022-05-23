export interface RouteItem {
  url: string;
  name: string;
  offcanvasMenu?: boolean;
  target?: "_blank" | "_self";
  children?: RouteItem[];
}

export const Routes = [
  {
    url: "/",
    name: "Home",
    offcanvasMenu: true,
  },
  {
    url: "/lfg",
    name: "Looking for Group",
  },
  {
    url: "/guides",
    name: "Guides",
    children: [
      {
        url: "/guides/destiny2/votd",
        name: "Destiny 2 - VOTD",
      },
    ],
  },
] as RouteItem[];

export default Routes;
