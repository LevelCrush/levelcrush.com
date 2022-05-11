import React from "react";

export interface HeadingProps {
  className?: string;
  minimalCSS?: boolean;
}

export const H1 = (props: React.PropsWithChildren<HeadingProps>) => (
  <h1
    className={
      (props.minimalCSS
        ? ""
        : " align-middle text-yellow-400  text-4xl font-headline font-bold uppercase tracking-widest mt-8 md:mt-0 ") +
      (props.className || "")
    }
  >
    {props.children}
  </h1>
);

export const H2 = (props: React.PropsWithChildren<HeadingProps>) => (
  <h2
    className={
      (props.minimalCSS
        ? ""
        : " text-6xl text-yellow-400 font-headline font-bold uppercase tracking-widest ") +
      (props.className || "")
    }
  >
    {props.children}
  </h2>
);

export const H3 = (props: React.PropsWithChildren<HeadingProps>) => (
  <h3
    className={
      (props.minimalCSS
        ? ""
        : " text-3xl font-sans font-bold uppercase mb-4 ") +
      (props.className || "")
    }
  >
    {props.children}
  </h3>
);

export const H4 = (props: React.PropsWithChildren<HeadingProps>) => (
  <h4
    className={(props.minimalCSS ? "" : " text-2xl ") + (props.className || "")}
  >
    {props.children}
  </h4>
);
