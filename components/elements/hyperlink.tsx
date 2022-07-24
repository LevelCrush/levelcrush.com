import Link from "next/link";
import React from "react";

export interface HyperLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  target?: "_self" | "_blank";
}

export const Hyperlink = (props: HyperLinkProps) => (
  <Link href={props.href}>
    <a
      target={
        props.target || (props.href.includes("http") ? "_blank" : "_self")
      }
      className={" hover:underline " + (props.className || "")}
      {...props}
    >
      {props.children}
    </a>
  </Link>
);

export default Hyperlink;
