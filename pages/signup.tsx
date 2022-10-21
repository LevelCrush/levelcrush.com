import axios from "axios";
import { createWriteStream } from "fs";
import moment from "moment-timezone";

import Head from "next/head";
import { stringify } from "querystring";
import React from "react";
import DiscordLink from "../components/discord_link";
import Container from "../components/elements/container";
import { H2, H3 } from "../components/elements/headings";
import {
  Form,
  FormField,
  FormFieldGroup,
  FormFieldPropsOption,
} from "../components/form";
import Hero from "../components/hero";
import LoginButton from "../components/login_button";
import OffCanvas from "../components/offcanvas";
import { SiteHeader } from "../components/site_header";
import ENV from "../core/env";

export type ErrorFieldType =
  | "discord"
  | "bungie"
  | "teammate_discord"
  | "teammate_bungie"
  | "team_name"
  | "none"
  | "form";

export interface SignupPageState {
    
}

export class SignupPage extends React.Component<{}, SignupPageState> {
  private _mounted = false;
  public constructor(props: any) {
    super(props);

    this.state = {
    };
    this.onMemberLogin = this.onMemberLogin.bind(this);
    this.submitData = this.submitData.bind(this);
  }

  public onMemberLogin(ev: CustomEvent) {
    if (ev.detail) {
      let state: Partial<SignupPageState> = {};
      let did_change = false;
      if (this.state.displayName != ev.detail.displayName) {
        state["displayName"] = ev.detail.displayName;
        did_change = true;
      }

      if (this.state.bungieUsername != ev.detail.displayNameBungie) {
        state["bungieUsername"] = ev.detail.displayNameBungie;
        did_change = true;
      }

      if (did_change) {
        this.setState(state as any);
      }
    }
  }

  public componentWillUnmount() {
    this._mounted = false;

    // stop listening to the login success event
    document.removeEventListener(
      "levelcrush_login_session",
      this.onMemberLogin as EventListener
    );
  }

  public componentDidMount() {
    if (this._mounted) {
      return;
    }
    this._mounted = true;

    // start listening to the login success event
    document.addEventListener(
      "levelcrush_login_session",
      this.onMemberLogin as EventListener
    );
  }

  public validate(ev: React.FormEvent<HTMLFormElement>) {
    const form = ev.target as HTMLFormElement;

    // the only thing we need to validate is a discord username
    // and the bungie username
    // by validation. We just need it to have a # character in it
    // and for it to be populated

    const discord_name = (
      form.elements.namedItem("discord") as HTMLInputElement
    ).value;

    const bungie_name = (form.elements.namedItem("bungie") as HTMLInputElement)
      .value;

    const team_name = (form.elements.namedItem("team_name") as HTMLInputElement)
      .value;
    const teammate_discord = (
      form.elements.namedItem("teammate_discord") as HTMLInputElement
    ).value;
    const teammate_bungie = (
      form.elements.namedItem("teammate_bungie") as HTMLInputElement
    ).value;
    let error_field: ErrorFieldType = "none";
    let error_message = "";
    if (discord_name.trim().length === 0) {
      error_field = "discord";
      error_message = "Please specify a discord user id";
    } else if (discord_name.trim().includes("#") === false) {
      error_field = "discord";
      error_message = "Please specify a valid discord id";
    }

    if (error_field === "none") {
      if (bungie_name.trim().length === 0) {
        error_field = "bungie";
        error_message = "Please specify a bungie username";
      } else if (bungie_name.trim().includes("#") === false) {
        error_field = "bungie";
        error_message = "Please specify a valid bungie name";
      }
    }

    if (error_field === "none") {
      if (team_name.trim().length === 0) {
        error_field = "team_name";
        error_message = "Please specify a team name";
      } else if (team_name.trim().length > 32) {
        error_field = "team_name";
        error_message = "Please shorten your team name";
      }
    }

    if (error_field === "none") {
      if (teammate_discord.trim().length === 0) {
        error_field = "teammate_discord";
        error_message = "Please specify your teammates discord username";
      } else if (teammate_discord.trim().includes("#") === false) {
        error_field = "teammate_discord";
        error_message = "Please specify a valid discord id";
      }
    }

    if (error_field === "none") {
      if (teammate_bungie.trim().length === 0) {
        error_field = "teammate_bungie";
        error_message = "Please specify your teammates bungie name";
      } else if (teammate_discord.trim().includes("#") === false) {
        error_field = "teammate_bungie";
        error_message = "Please specify a valid bungie id";
      }
    }

    switch (error_field) {
      case "none":
        this.setState({ error_field: "none", error_message: "" });
        return true;
      default:
        this.setState({
          error_field: error_field,
          error_message: error_message,
          form_submit_success: false,
          form_submitting: false,
        });
        return false;
    }
  }

  public submitData = (ev: React.FormEvent<HTMLFormElement>) => {
    // validate
    const is_valid = this.validate(ev);

    const form = ev.target as HTMLFormElement;

    if (is_valid) {
      // map to expected fields

      const form_json = {
        "Discord Username": (
          form.elements.namedItem("discord") as HTMLInputElement
        ).value
          .trim()
          .substring(0, 64),
        "Bungie Name": (
          form.elements.namedItem("bungie") as HTMLInputElement
        ).value
          .trim()
          .substring(0, 64),
        "Team Name": (
          form.elements.namedItem("team_name") as HTMLInputElement
        ).value.substring(0, 32),
        "Teammate Discord": (
          form.elements.namedItem("teammate_discord") as HTMLInputElement
        ).value
          .trim()
          .substring(0, 64),
        "Teammate Bungie": (
          form.elements.namedItem("teammate_bungie") as HTMLInputElement
        ).value
          .trim()
          .substring(0, 64),
        "Submitted Timestamp": moment().unix(),
      };

      axios({
        method: "POST",
        data: {
          form_token: "052bc45b7d9ca3aa1112f671dc2ca133",
          form_data: JSON.stringify(form_json),
        },
        url: ENV.hosts.api + "/forms/write",
      })
        .then((axios_response) => {
          const response = axios_response.data as {
            success: boolean;
            response: { [prop: string]: any };
            errors: { field: string; message: string }[];
          };

          if (response.errors.length === 0) {
            this.setState({
              form_submit_success: true,
            });
          } else {
            this.setState({
              form_submit_success: false,
              error_field: "form",
              error_message:
                response.errors[0].field + ":" + response.errors[0].message,
            });
          }
        })
        .catch((err) => {
          alert("An internal error has occurred.");
        })
        .finally(() => {
          this.setState({
            form_submitting: false,
          });
        });
    }
  };

  public render_success() {
    return (
      <Container>
        <H3>Submission completed!</H3>
        <p>Be sure to join the discord if you havent already!</p>
        <DiscordLink />
      </Container>
    );
  }

  public render_form() {
    return (
      <Form
        onSubmit={(event) => {
          event.preventDefault();

          this.setState(
            {
              form_submitting: true,
            },
            () => {
              this.submitData(event);
            }
          );
          return false;
        }}
        onKeyPress={(ev) => {
          const is_enter_key =
            (ev.keyCode || ev.which || ev.charCode || 0) == 13;

          const evTarget = ev.target as HTMLElement;
          if (is_enter_key && evTarget.tagName.toLowerCase() != "textarea") {
            ev.preventDefault();

            return false;
          }
        }}
        action="#goober"
        method="POST"
      >
        <H3>PvP Tournament Signup!</H3>
        <p>
          Level Crush is excited to host our first PvP tournament ever! We
          welcome players of all skill sets to come and try their luck against
          other teams in a crimson days like event! Come duel it out with your
          friend or family as you take on 2 other players in a double
          elimination bracket! Got a friend that&apos;s not in Level Crush?
          Invite them and come rep your clan as well!
        </p>

        <br />
        <p>To join this tournament you will need to do the following.</p>
        <ol className="list-inside list-decimal">
          <li>Login with your Discord account.</li>
          <li>Link your Bungie account</li>
          <li>Click the &quot;Signup&quot; button</li>
        </ol>
        <p>
          Once all items are completed you will have the abilty to signup and
          then share a invite link for your team mate!
        </p>
        <Container>
          
        </Container>
        <FormFieldGroup
          label="Usernames (required)"
          className="flex justify-between flex-wrap"
        >
          <FormField
            className={
              "flex-initial w-full lg:w-2/5 " +
              (this.state.error_field === "discord" ? "error" : "")
            }
            label="Discord Username (required)"
            name="discord"
            id="discord"
            maxLength={64}
            type="text"
            placeholder="User#XXXX"
            disabled={this.state.form_submitting}
            onChange={(ev) => {
              if (this.state.error_field === "discord") {
                this.setState({
                  error_field: "none",
                  error_message: "",
                });
              }
            }}
            value={
              this.state.displayName != "" ? this.state.displayName : undefined
            }
          />
          <FormField
            className={
              "flex-initial w-full lg:w-2/5 " +
              (this.state.error_field === "bungie" ? "error" : "")
            }
            label="Bungie Username (required)"
            name="bungie"
            id="bungie"
            type="text"
            placeholder="Guaridan#XXXX"
            maxLength={64}
            disabled={this.state.form_submitting}
            onChange={(ev) => {
              if (this.state.error_field === "bungie") {
                this.setState({
                  error_field: "none",
                  error_message: "",
                });
              }
            }}
            value={
              this.state.bungieUsername != ""
                ? this.state.bungieUsername
                : undefined
            }
          />
        </FormFieldGroup>
        <hr />
        <FormFieldGroup
          label="Team information (required)"
          className="flex justify-between flex-wrap"
        >
          <FormField
            className={
              "flex-initial w-full lg:w-[30%] " +
              (this.state.error_field === "team_name" ? "error" : "")
            }
            label="Team name"
            name="team_name"
            id="teamName"
            maxLength={32}
            type="text"
            placeholder="Team name here please...."
            disabled={this.state.form_submitting}
          />
          <FormField
            className={
              "flex-initial w-full lg:w-[30%] " +
              (this.state.error_field === "teammate_discord" ? "error" : "")
            }
            label="Teammate (Discord name)"
            name="teammate_discord"
            id="teammateDiscord"
            type="text"
            placeholder="TeammateDiscord#1234"
            maxLength={64}
            disabled={this.state.form_submitting}
          />
          <FormField
            className={
              "flex-initial w-full lg:w-[30%] " +
              (this.state.error_field === "teammate_bungie" ? "error" : "")
            }
            label="Teammate (Bungie name)"
            name="teammate_bungie"
            id="teammateBungie"
            type="text"
            placeholder="TeammateBungie#1234"
            maxLength={64}
            disabled={this.state.form_submitting}
          />
        </FormFieldGroup>
        <hr />
        {this.state.error_field != "none" ? (
          <p className="text-red-700 underline align-left my-4">
            {this.state.error_message}
          </p>
        ) : (
          <></>
        )}
        <button
          className="block w-full max-w-[12rem] text-center text-white bg-blue-600 hover:bg-blue-900 hover:cursor-pointer rounded px-4 py-2  mx-0 my-8"
          type="submit"
          disabled={this.state.form_submitting}
        >
          Submit
        </button>
      </Form>
    );
  }

  public render_closed() {
    return (
      <Container>
        <H3>Signups are now closed!</H3>
      </Container>
    );
  }

  public render() {
    return (
      <OffCanvas>
        <Head>
          <title>Signup | Level Crush</title>
        </Head>
        <SiteHeader />
        <main>
          <Hero className="min-h-[20rem]">
            <Container minimalCSS={true} className="px-4 mx-auto flex-initial">
              <H2 className="drop-shadow text-center">Signups!</H2>
              <p>
                If you have any questions or concerns please join the discord!
              </p>
              <DiscordLink />
            </Container>
          </Hero>
          {this.render_form()}
        </main>
      </OffCanvas>
    );
  }
}

export default SignupPage;
