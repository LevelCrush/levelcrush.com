import React from "react";

export interface HeroProps {
  backgroundUrl?: string;
  className?: string;
}

export class Hero extends React.Component<React.PropsWithChildren<HeroProps>> {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div
        className={
          "flex-auto basis-full relative top-0 left-0 hero bg-cover bg-center  h-auto flex flex-col items-center justify-center border-b-8 border-solid border-cyan-400 shadow-[0px_.3rem_1rem_2px_rgba(0,0,0,0.4)] " +
          (this.props.className !== undefined ? this.props.className + " " : "")
        }
      >
        {this.props.children}
      </div>
    );
  }
}

export default Hero;
