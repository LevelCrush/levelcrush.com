import Link from "next/link";
import React from "react";
import Container from "./elements/container";
import { H1 } from "./elements/headings";
import LoginButton from "./login_button";
import ThemeToggle from "./theme_toggle";

export const SiteHeader = (props: any) => (
  <header>
    <div className="min-h-[4.5rem] h-auto bg-[#003134] border-b-8 border-solid border-cyan-400 shadow-[0px_.5rem_.5rem_2px_rgba(0,0,0,0.7)] relative z-[99] ">
      <Container
        minimalCSS={true}
        className="px-4 flex mx-auto my-0 justify-between items-center flex-wrap md:flex-nowrap"
      >
        <H1 className="flex-auto text-center md:text-left  basis-full md:basis-auto  md:flex-initial">
          <Link href="/" title="Go home">
            Level Crush
          </Link>
          <div
            className="inline-block w-auto h-auto text-lg ml-4"
            title="Toggle Dark/Light Mode"
          >
            <ThemeToggle />
          </div>
        </H1>
        <nav className="flex-auto basis-full  md:flex-auto mt-8 md:mt-0">
          <ul className="flex justify-center text-lg md:text-sm lg:text-lg text-white font-semibold">
            <li className="flex-initial hover:underline hover:cursor-pointer px-4">
              <Link href="/lfg">Looking For Group</Link>
            </li>
            <li className="flex-initial hover:underline hover:cursor-pointer px-4">
              <Link href="/guides">Guides</Link>
            </li>
          </ul>
        </nav>
        <div className="flex-auto basis-full md:basis-auto  text-center mt-8 mb-8 md:mt-0 md:mb-0 md:flex-initial md:text-right levelcrush-login">
          <LoginButton />
        </div>
      </Container>
    </div>
  </header>
);

export default SiteHeader;
