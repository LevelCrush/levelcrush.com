import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Container from "./elements/container";
import { H2 } from "./elements/headings";
import LoginButton from "./login_button";

export interface LoginGuardProperties {
  permissionLevel?: string;
}

export interface LoginGuardState {
  loggedIn: boolean;
}

export class LoginGuard extends React.Component<
  React.PropsWithChildren<LoginGuardProperties>,
  LoginGuardState
> {
  private _mounted = false;
  public constructor(props: any) {
    super(props);
    this.state = {
      loggedIn: false,
    };
    this._mounted = false;
  }

  public componentDidMount() {
    if (this._mounted) {
      return;
    }

    this._mounted = true;

    // append login listeners
    document.addEventListener("levelcrush_login_success", ((
      ev: CustomEvent
    ) => {
      this.setState({
        loggedIn: true,
      });
    }) as EventListener);

    // append login listeners
    document.addEventListener("levelcrush_logout", ((ev: CustomEvent) => {
      this.setState({
        loggedIn: false,
      });
    }) as EventListener);
  }

  public renderNeedsLogin() {
    return (
      <Container
        minimalCSS={true}
        className="mx-auto my-0 flex items-center justify-center self-center min-h-full h-auto"
      >
        <div className="flex-initial w-2/4 h-auto text-center">
          <H2
            minimalCSS={true}
            className="text-6xl text-black dark:text-yellow-400 font-headline font-bold uppercase tracking-widest "
          >
            <FontAwesomeIcon icon={faTriangleExclamation}></FontAwesomeIcon>
            <br />
            <br />
            <span>Please Login</span>
          </H2>
          <p className="text-xl my-8">
            This area is restricted to logged in members only.
          </p>
          <div className="w-auto h-auto inline-block">
            <LoginButton justListen={true} />
          </div>
        </div>
      </Container>
    );
  }

  public renderNormal() {
    return <>{this.props.children}</>;
  }

  public render() {
    return (
      <>{this.state.loggedIn ? this.renderNormal() : this.renderNeedsLogin()}</>
    );
  }
}

export default LoginGuard;