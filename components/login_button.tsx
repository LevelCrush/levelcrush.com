import React, { useState } from "react";

import Axios from "axios";
import ENV from "../core/env";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faTwitch } from "@fortawesome/free-brands-svg-icons";

export interface LoginProperties {
  display?: "default" | "full" | "events-only" | string;
  justListen?: boolean;
}

export interface LoginState {
  loggedIn: boolean;
  setup: boolean;
  requesting: boolean;
  displayName: string | undefined;
  displayNameTwitch: string | undefined;
  displayNameBungie: string | undefined;
}

// event list
/*
levelcrush_login_init -> occurs when component mounts
levelcrush_login_check -> occurs whenever the component is done checking to see if we have a session still with login.levelcrush . Th
levelcrush_login_success -> occurs whenever the user successfully logs in
levelcrush_logout -> occurs when we have logged out of the application

*/

export class LoginButton extends React.Component<LoginProperties, LoginState> {
  public loginBroadcastChannel: BroadcastChannel | undefined;
  private readonly version: string;
  private _mounted = false;
  private _sessionTimer: number | undefined | NodeJS.Timer = undefined;
  private myRef;
  private makingLoginCheck = false;
  private makingApiLogin = false;
  public constructor(props: LoginProperties) {
    super(props);

    this.state = {
      loggedIn: false,
      setup: true,
      requesting: props.justListen ? false : true,
      displayName: "",
      displayNameBungie: "",
      displayNameTwitch: "",
    };

    this.myRef = React.createRef<HTMLDivElement>();

    this._mounted = false;
    this.makingLoginCheck = false;
    this.makingApiLogin = false;

    // specify version
    this.version = "1.1.0";

    this.startLogin = this.startLogin.bind(this);
    this.loginCheck = this.loginCheck.bind(this);
    this.apiLogin = this.apiLogin.bind(this);
    this.applicationLogin = this.applicationLogin.bind(this);
    this.applicationLogout = this.applicationLogout.bind(this);
    this.pingHosts = this.pingHosts.bind(this);
    this.apiGetSession = this.apiGetSession.bind(this);

    // event listeners
    this.onLoginCheck = this.onLoginCheck.bind(this);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.onLoginSession = this.onLoginSession.bind(this);
  }

  public componentWillUnmount() {
    if (this.props.justListen) {
      document.removeEventListener(
        "levelcrush_login_session",
        this.onLoginSession as EventListener
      );
    }

    clearInterval(this._sessionTimer as any);
    this._mounted = false;

    // setup logout event handler
    document.removeEventListener(
      "levelcrush_logout",
      this.onLogout as EventListener
    );

    // when we have successfully logged in update our state
    document.removeEventListener(
      "levelcrush_login_success",
      this.onLoginSuccess as EventListener
    );

    // listen for any login checks and if we are no longer logged in,
    document.removeEventListener(
      "levelcrush_login_check",
      this.onLoginCheck as EventListener
    );

    if (ENV.isBrowser) {
      if (this.loginBroadcastChannel) {
        this.loginBroadcastChannel.close();
      }
    }

    this.makingApiLogin = false;
    this.makingLoginCheck = false;
  }

  // we have mounted , perform login check
  public componentDidMount() {
    if (this._mounted) {
      console.log("Has already been mounted", this.myRef);
      return;
    }

    this._mounted = true;

    if (ENV.isBrowser) {
      // setup broadcast channel
      if (typeof window["BroadcastChannel"] !== "undefined") {
        this.loginBroadcastChannel = new BroadcastChannel("LevelCrush-Login");
      } else {
        this.loginBroadcastChannel = undefined;
      }
    }

    // setup broadcast channel
    if (this.loginBroadcastChannel && !this.props.justListen) {
      this.loginBroadcastChannel.addEventListener("message", (ev) => {
        // todo
        const messageData = ev.data as {
          command?: "logout" | "login";
          meta?: { [key: string]: string };
        };

        switch (messageData.command) {
          case "logout":
            console.log("Logout command received. Updating UI");
            document.dispatchEvent(new CustomEvent("levelcrush_logout"));
            break;
          case "login":
            console.log("Login command received. Performing check in tab");
            // we need to run the whole routine of check, saying false here means we will trigger the entire routine and specifiying true as the second parameter signals that this is a broadcast message
            // the second parameter is important to avoid recursion in updates
            this.makingApiLogin = false;
            this.makingLoginCheck = false;
            this.loginCheck(false, true);
            break;
          default:
            console.log("Unknown command: ", messageData.command);
            break;
        }
      });
    }

    // setup logout event handler
    document.addEventListener("levelcrush_logout", this.onLogout);

    // when we have successfully logged in update our state
    document.addEventListener("levelcrush_login_success", this.onLoginSuccess);

    // listen for any login checks and if we are no longer logged in,
    document.addEventListener(
      "levelcrush_login_check",
      this.onLoginCheck as EventListener
    );

    // check for login every 2 minutes if possible
    if (!this.props.justListen) {
      this._sessionTimer = setInterval(() => {
        console.log("Interval based Login Check", this.myRef);
        this.makingApiLogin = false;
        this.makingLoginCheck = false;
        this.loginCheck();
      }, 120000);

      // we want to run through our entire routine, so dont just only check for a login
      // perform the entire login routine if need be automatically
      console.log("Mounted: Starting login check", this.myRef);
      this.loginCheck(false);

      // let the document know we have initialized fully and run any setups
      document.dispatchEvent(new CustomEvent("levelcrush_login_init"));
    }

    if (this.props.justListen) {
      document.addEventListener(
        "levelcrush_login_session",
        this.onLoginSession as EventListener
      );
    }
  }

  public onLoginSession(ev: CustomEvent) {
    this.setState({
      displayName: ev.detail["displayName"] as string,
      displayNameTwitch: (ev.detail["displayNameTwitch"] as string) || "",
      displayNameBungie: (ev.detail["displayNameBungie"] as string) || "",
      setup: false,
    });
  }
  public onLoginSuccess() {
    this.setState({
      loggedIn: true,
      requesting: this.props.justListen ? false : true,
      setup: false,
    });
    // any successful login will trigger us to get the current session
    if (!this.props.justListen) {
      this.apiGetSession();
    }
  }
  public onLoginCheck(ev: CustomEvent) {
    if (!this.props.justListen) {
      if (ev.detail["loggedIn"] !== true && this.state.loggedIn === true) {
        document.dispatchEvent(new CustomEvent("levelcrush_logout"));
      } else if (
        ev.detail["loggedIn"] === true &&
        this.state.loggedIn === false
      ) {
        document.dispatchEvent(new CustomEvent("levelcrush_login_success"));
      }
    } else {
      this.setState({
        setup: false,
      });
    }
  }

  public onLogout() {
    console.log("Logout request detected. Updating UI");
    this.setState({
      requesting: false,
      setup: false,
      loggedIn: false,
    });
  }

  public loginCheck(onlyCheck = true, broadcastCheck = false) {
    if (this.props.justListen) {
      return;
    }
    if (this.makingLoginCheck) {
      return;
    }
    this.makingLoginCheck = true;
    // check login.levelcrush first
    console.log("Checking if logged into ", ENV.hosts.login, this.myRef);
    this.setState({
      requesting: true,
    });
    Axios({
      url: ENV.hosts.login + "/session",
      method: "GET",
      withCredentials: true,
    }).then((response) => {
      //   console.log(response);
      const sessionResponse = response.data as {
        success: boolean;
        response: {
          user: string;
          application: string;
        };
        errors: unknown[];
      };

      //   console.log(sessionResponse);

      if (onlyCheck === false) {
        if (
          sessionResponse.success &&
          sessionResponse.response.user.length > 0
        ) {
          console.log("Now running API Login");
          this.apiLogin(
            sessionResponse.response.user,
            sessionResponse.response.application,
            broadcastCheck
          );
        } else {
          this.setState({
            loggedIn: false,
            requesting: false,
            setup: false,
          });
        }
      } else {
        this.setState({
          loggedIn:
            sessionResponse.success && sessionResponse.response.user.length > 0,
          requesting: false,
          setup: false,
        });
      }

      document.dispatchEvent(
        new CustomEvent("levelcrush_login_check", {
          detail: {
            loggedIn:
              sessionResponse.success &&
              sessionResponse.response.user.length > 0,
            xhr: sessionResponse,
          },
        })
      );
    });
  }

  public apiLogin(user: string, application: string, broadcastCheck = false) {
    if (this.props.justListen) {
      return;
    }
    if (this.makingApiLogin) {
      return;
    }
    this.makingApiLogin = true;
    // todo connect and login with api
    console.log("Attempting to finish login at ", ENV.hosts.api);
    Axios({
      url: ENV.hosts.api + "/user/login",
      data: {
        method: "token",
        email: "",
        password: user,
        app_token: application,
      },
      method: "POST",
      withCredentials: true,
    }).then((response) => {
      // figure out if we have logged in

      const serverResponse = response.data as {
        success: boolean;
        response: {
          user: {
            token: string;
            display_name: string;
            display_name_full: string;
            last_login_at: number;
            banned_at: number;
            verified_at: number;
          };
          loginMethod: string;
        };
        errors: unknown[];
      };

      // make sure we have a response we are expecting
      if (
        serverResponse.success &&
        serverResponse.response &&
        serverResponse.response.user &&
        serverResponse.response.user.token
      ) {
        console.log("Handshake complete. Moving on");
        this.applicationLogin(
          serverResponse.response.user.token,
          application,
          broadcastCheck
        );
      } else {
        this.setState({
          loggedIn: false,
          requesting: false,
          setup: false,
        });
      }
    });
  }

  public applicationLogin(
    user: string,
    application: string,
    broadcastCheck = false
  ) {
    console.log(this.props, this.myRef.current);
    if (this.props.justListen) {
      console.log("Just listening. Ignoring");
      return;
    }
    console.log("Using API to login with application");
    Axios({
      url: ENV.hosts.api + "/application/login",
      method: "POST",
      data: {
        application: application,
        user: user,
      },
      withCredentials: true,
    }).then((response) => {
      // login to our application finally
      const serverResponse = response.data as {
        success: boolean;
        response: {
          valid: boolean;
          firstLoad: boolean;
          token: string;
          application: string;
          user: string;
          timestamp: number;
        };
        errors: unknown[];
      };

      if (
        serverResponse.success &&
        serverResponse.response &&
        serverResponse.response.token.length > 0
      ) {
        // broadcast
        // logout on our end and then tell other contexts to logout on the client
        if (!broadcastCheck) {
          // if this was not  a broadcast check, then post message to broadcast
          if (this.loginBroadcastChannel) {
            this.loginBroadcastChannel.postMessage({
              command: "login",
            });
          }
        }

        document.dispatchEvent(
          new CustomEvent("levelcrush_login_success", {
            detail: { xhr: serverResponse },
          })
        );
      } else {
        this.setState({
          loggedIn: false,
          requesting: false,
          setup: false,
        });
      }
    });
  }

  public startLogin() {
    // start login procedure
    console.log("Storing current page");
    /*
    Axios({
      url:
        ENV.hosts.login +
        "/discord/login?redirect=" +
        encodeURIComponent(window.location.href),
      method: "GET",
      withCredentials: true,
      headers: { "X-Requested-With": "XMLHttpRequest" },
    }).then((response) => {
      const redirect = response.data["redirect"];
      window.location.href = redirect;
    }); */

    window.location.href =
      ENV.hosts.login +
      "/discord/login?redirect=" +
      encodeURIComponent(window.location.href);

    // navigate to server api login
  }

  public applicationLogout() {
    // logout of the api and login.levelcrush
    const apiLogoutRequest = Axios.get(ENV.hosts.api + "/user/logout", {
      withCredentials: true,
    });
    const loginLogoutRequest = Axios.get(ENV.hosts.login + "/logout", {
      withCredentials: true,
    });

    console.log("Sending logout request");
    Promise.all([apiLogoutRequest, loginLogoutRequest]).then(() => {
      document.dispatchEvent(new CustomEvent("levelcrush_logout"));
    });

    // broadcast
    // logout on our end and then tell other contexts to logout on the client
    if (this.loginBroadcastChannel) {
      this.loginBroadcastChannel.postMessage({
        command: "logout",
      });
    }
  }

  public pingHosts() {
    if (this.props.justListen) {
      return;
    }
    const apiRequest = Axios.get(ENV.hosts.api + "/ping", {
      withCredentials: true,
    });
    const loginRequest = Axios.get(ENV.hosts.login + "/ping", {
      withCredentials: true,
    });

    console.log("Pinging host");
    Promise.all([apiRequest, loginRequest]).then(() => {
      document.dispatchEvent(new CustomEvent("levelcrush_login_ping"));
    });
  }

  public apiGetSession() {
    if (this.props.justListen) {
      return;
    }
    Axios.get(ENV.hosts.api + "/user/session", {
      withCredentials: true,
    }).then((xhr) => {
      // console.log(xhr);
      const apiRequest = xhr.data as {
        success: boolean;
        response: {
          applications: {
            hub: {
              token: string;
              display_name: string;
              display_name_full: string;
              verified_at: number;
            };
          };
          user: string;
          valid: boolean;
        };
        errors: unknown[];
      };

      Axios.get(ENV.hosts.login + "/profile/get", {
        withCredentials: true,
      })
        .then((profile_request) => {
          console.log("Profile Response:", profile_request.data.response);
          this.setState(
            {
              requesting: false,
              displayName:
                apiRequest.success &&
                apiRequest.response &&
                apiRequest.response.applications &&
                apiRequest.response.applications.hub.display_name_full
                  ? apiRequest.response.applications.hub.display_name_full
                  : "Unknown#Potatoe",
              displayNameBungie:
                profile_request.data &&
                profile_request.data.success &&
                profile_request.data.response &&
                profile_request.data.response.bungie
                  ? profile_request.data.response.bungie
                  : "",
              displayNameTwitch:
                profile_request.data &&
                profile_request.data.success &&
                profile_request.data.response &&
                profile_request.data.response.twitch
                  ? profile_request.data.response.twitch
                  : "",
            },
            () => {
              document.dispatchEvent(
                new CustomEvent("levelcrush_login_session", {
                  detail: {
                    displayName: this.state.displayName,
                    displayNameTwitch: this.state.displayNameTwitch,
                    displayNameBungie: this.state.displayNameBungie,
                  },
                })
              );
            }
          );
        })
        .catch(() => {
          console.log("Failed to get profile information...");
        });
    });
  }

  /**  */
  private buttonCoreStyle =
    "block w-full  text-white bg-blue-600 hover:bg-blue-900 hover:cursor-pointer  px-4 py-2 mx-auto relative top-0";
  private buttonStyle = this.buttonCoreStyle + " rounded mx-auto  my-4 ";
  private buttonSubStyle =
    this.buttonCoreStyle + " border-t-[1px] border-blue-300 border-solid";

  public render_link_twitch() {
    return (
      <button
        type="button"
        onClick={(ev) => {
          window.location.href =
            ENV.hosts.login +
            "/twitch/login?redirect=" +
            encodeURIComponent(window.location.href);
        }}
        className="block w-full bg-[#9146FF] hover:bg-[#6534ad] border-[#cba9ff] border-t-[1px]  hover:cursor-pointer px-4 py-2 mx-auto relative top-0"
      >
        <FontAwesomeIcon
          icon={faTwitch}
          className="float-left mr-2 relative top-1 align-middle"
        />
        <span>Link Twitch</span>
      </button>
    );
  }

  public render_show_twitch() {
    return (
      <button
        type="button"
        className="block w-full bg-[#9146FF] hover:bg-[#6534ad] border-[#cba9ff] border-t-[1px]  hover:cursor-pointer px-4 py-2 mx-auto relative top-0"
      >
        <FontAwesomeIcon
          icon={faTwitch}
          className="float-left mr-2 relative top-1 align-middle"
        />
        <span>{this.state.displayNameTwitch}</span>
      </button>
    );
  }

  public render_needs_login() {
    return (
      <button
        disabled={this.state.setup}
        className={this.buttonStyle}
        type="button"
        onClick={this.startLogin}
      >
        Login with Discord
      </button>
    );
  }

  public render_is_logged_in() {
    return (
      <>
        <button
          onClick={(ev) => {
            const targ = ev.currentTarget as HTMLButtonElement;
            targ.classList.toggle("dropdown");
          }}
          disabled={this.state.requesting}
          className={this.buttonCoreStyle + " mx-auto mb-0 mt-4 rounded "}
          type="button"
        >
          <span>{this.state.displayName}</span>
          <FontAwesomeIcon
            icon={faAngleDown}
            className="ml-4 float-right align-middle top-1 relative"
          />
        </button>
        <div className="w-full rounded-bl rounded-br   bg-blue-600 overflow-hidden  h-auto  block max-h-0 absolute transition-all ease-in-out duration-300  btn-dropdown:block btn-dropdown:max-h-[10rem]">
          <>
            {this.state.displayNameTwitch
              ? this.render_show_twitch()
              : this.render_link_twitch()}
          </>
          <button
            type="button"
            className={this.buttonSubStyle}
            onClick={this.applicationLogout}
          >
            Logout
          </button>
        </div>
        <div className="mb-4"></div>
      </>
    );
  }

  public render() {
    if (this.props.display !== "events-only") {
      /*const completedSetup =
       this.state.setup === false ? (
          <button
            className="block w-full  text-white bg-blue-600 hover:bg-blue-900 hover:cursor-pointer rounded px-4 py-2 mx-auto  my-4"
            onClick={
              this.state.loggedIn ? this.applicationLogout : this.startLogin
            }
            disabled={this.state.requesting}
            title={this.state.loggedIn ? "Log out" : "Log in"}
          >
            {this.state.loggedIn
              ? this.state.displayName
              : "Login with Discord"}
          </button>
        ) : (
          <button
            disabled={true}
            className="block w-full  text-white bg-blue-600 opacity-50  hover:cursor-default rounded px-4 py-2 mx-auto  my-4"
          >
            Login with Discord
          </button>
        ); */

      const completedSetup =
        this.state.setup || this.state.loggedIn === false
          ? this.render_needs_login()
          : this.render_is_logged_in();

      return (
        <div
          className="app inline-block w-auto h-auto relative top-0"
          data-app="login"
          data-logged-in={this.state.loggedIn ? "1" : "0"}
          data-display={this.props.display}
          ref={this.myRef}
        >
          {completedSetup}
        </div>
      );
    } else {
      return <></>;
    }
  }
}

export default LoginButton;
