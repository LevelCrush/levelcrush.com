import Link from "next/link";
import React from "react";
import ENV from "../core/env";

// import the polyfill
// probably should do this in _app for the future but for now this works (i think. 4am me lol)

export interface TableOfContentsNavigationItem {
  url: string;
  text: string;
  target?: "_self" | "_blank";
  subnavigation: TableOfContentsNavigationItem[];
}

export interface TableOfContentsProperties {
  navTree: TableOfContentsNavigationItem[];
}

/**
 * Lol this component needs to be revisted and done correctly. Only did a quick port from the original version
 */
export class TableOfContents extends React.Component<TableOfContentsProperties> {
  public constructor(props: any) {
    super(props);
  }

  public handleToggleCollapseClick(
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    ev.preventDefault();

    const evTarget = ev.target as HTMLElement;
    if (evTarget.parentNode) {
      const evTargetParentNode = evTarget.parentNode as HTMLElement;
      if (evTarget.classList.contains("top-collapse")) {
        const superParent = evTargetParentNode.parentNode as HTMLElement;
        if (superParent) {
          superParent.classList.toggle("expanded");
        }
      } else {
        evTargetParentNode.click();
      }
      evTarget.blur();
    }
    return false;
  }

  public handleListItemClick(ev: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    let evTarget = ev.target as HTMLElement;
    let evCurrentTarget = ev.currentTarget as HTMLElement;
    if (evTarget === evCurrentTarget) {
      if (evCurrentTarget.classList.contains("expanded")) {
        evCurrentTarget.classList.remove("expanded");
      } else {
        const expanded = document.querySelectorAll(
          ".table-of-contents li.expanded"
        );
        for (let i = 0; i < expanded.length; i++) {
          expanded[i].classList.remove("expanded");
        }
        evCurrentTarget.classList.add("expanded");
      }
    }
  }

  public handleLinkIntercept(
    ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    var element = ev.target as HTMLAnchorElement;
    let hashbangSplit = element.href.split("#");
    let hashBang = hashbangSplit.length > 0 ? hashbangSplit[1].trim() : "";
    if (hashBang.trim().length > 0) {
      ev.preventDefault();
      console.log(document.getElementById(hashBang));

      const hashBangElement = document.getElementById(hashBang);
      if (hashBangElement) {
        hashBangElement.scrollIntoView({
          behavior: "smooth",
        });
      }
      if (element.parentNode) {
        const parentNode = element.parentNode as HTMLElement;
        if (parentNode.classList.contains("expanded") === false) {
          parentNode.click();
        }
      }
      return false;
    }
  }

  public render() {
    return (
      <div className="expanded group shadow-[0px_.4rem_0rem_1px_rgba(0,0,0,0.4)] flex-[1_1_auto] lg:flex-[0_1_30%] table-of-contents sticky top-0 self-start z-[9999] transition-all duration-300 ease-in-out  dark:bg-slate-900 border-2 border-solid  dark:border-cyan-900 hover:dark:border-cyan-400  hover:border-gray-400 border-gray-200 bg-white  rounded-xl  rounded-t-none">
        <h2 className="transition-all duration-300 ease-in-out px-4 py-2 dark:bg-slate-900 border-b-2 border-solid  dark:border-cyan-900 dark:group-hover:border-cyan-400  group-hover:border-gray-400 border-gray-200">
          <button
            type="button"
            className="inline-block text-left  w-full collapse-toggle top-collapse align-middle"
            onClick={this.handleToggleCollapseClick}
          >
            <span>Table of Contents</span>
            <i className="fas fa-angle-double-right float-right align-middle relative top-1 "></i>
            <div className="clear-both"></div>
          </button>
        </h2>
        <nav aria-label="Table of Contents">
          <ol data-level="1">
            {this.props.navTree.map((navItem, index) => (
              <li
                key={"navitem_" + index}
                className="mb-2"
                onClick={this.handleListItemClick}
              >
                <Link href={navItem.url} target={navItem.target}>
                  <a
                    onClick={this.handleLinkIntercept}
                    className="hover:underline active:underline text-base"
                  >
                    {navItem.text}
                  </a>
                </Link>
                <button
                  className="float-right inline-block w-auto collapse-toggle"
                  type="button"
                  onClick={this.handleToggleCollapseClick}
                >
                  <i className="fas fa-angle-double-right float-right align-middle relative top-1 "></i>
                </button>
                <nav aria-label={navItem.text + " Sections"}>
                  <ol data-level="2">
                    {navItem.subnavigation.map((subItem, subIndex) => (
                      <li
                        className="mb-1 hover:cursor-default"
                        key={"navitem_" + index + "_" + subIndex}
                      >
                        <Link href={subItem.url} target={subItem.target}>
                          <a
                            onClick={this.handleLinkIntercept}
                            className="hover:underline text-sm"
                          >
                            {subItem.text}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </nav>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    );
  }
}
