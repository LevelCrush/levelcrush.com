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
import OffCanvas from "../components/offcanvas";
import { SiteHeader } from "../components/site_header";
import ENV from "../core/env";

const MOMENT_OUTPUT_FORMAT_BROWSER = "MMMM Do hh:mm A";
const MOMENT_INPUT_PARSE = "YYYY-MM-DD hh:mm A";
const MOMENT_OUTPUT_FORMAT = "YYYY-MM-DD hh:mm A";
const EVENT_TIME = "2022-08-26 10:00 AM";
const EVENT_MOMENT = moment.tz(
  EVENT_TIME,
  "YYYY-MM-DD hh:mm A",
  "America/Los_Angeles"
);
console.log("Event Time");
console.log(
  EVENT_MOMENT.format(MOMENT_OUTPUT_FORMAT) + "Pacific",
  "Event Time"
);

const AVAILABILITY_TIMES = [] as FormFieldPropsOption[];
let hour_x = 0;
for (let i = 0; i < 24; i++) {
  const is_pm = i > 11;
  if (hour_x > 11) {
    hour_x = 0;
  }
  let hour_conv =
    (hour_x === 0 ? 12 : hour_x).toString().padStart(2, "0") +
    ":00 " +
    (is_pm ? "PM" : "AM");

  AVAILABILITY_TIMES.push({ value: hour_conv });
  hour_x++;
}

export type ErrorFieldType = "discord" | "bungie" | "none" | "form";

export interface SignupPageState {
  displayName: string;
  timezone: string;
  bungieUsername: string;
  allDay: boolean;
  startTime: string;
  endTime: string;
  resolved_input_time: string;
  resolved_converted_time: string;
  form_submitting: boolean;
  form_submit_success: boolean;
  valid_time: boolean;
  error_field: ErrorFieldType;
  error_message: string;
}

export class SignupPage extends React.Component<{}, SignupPageState> {
  private _mounted = false;
  public constructor(props: any) {
    super(props);

    this.state = {
      displayName: "",
      timezone: moment.tz.guess(),
      bungieUsername: "",
      startTime: "",
      endTime: "",
      form_submitting: false,
      form_submit_success: false,
      resolved_input_time: "",
      resolved_converted_time: "",
      valid_time: false,
      allDay: false,
      error_field: "none",
      error_message: "",
    };
    this.onMemberLogin = this.onMemberLogin.bind(this);
    this.submitData = this.submitData.bind(this);
    this.changeLocalTime = this.changeLocalTime.bind(this);
  }

  public onMemberLogin(ev: CustomEvent) {
    if (ev.detail) {
      if (this.state.displayName != ev.detail.displayName) {
        this.setState({
          displayName: ev.detail.displayName,
        });
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
    const timezone = moment.tz.guess();

    const local_reset_time = moment
      .tz(EVENT_TIME, "YYYY-MM-DD hh:mm A", "America/Los_Angeles")
      .tz(timezone);

    const resolved_local =
      local_reset_time.format("MMMM Do hh:mm A") + " " + timezone;

    const start_time =
      local_reset_time.format("hh") + ":00 " + local_reset_time.format("A");

    const time_diff = local_reset_time.diff(EVENT_MOMENT, "hours");

    this.setState({
      timezone: timezone,
      resolved_input_time: resolved_local,
      resolved_converted_time: resolved_local,
      startTime: start_time,
      valid_time: time_diff >= 0 && time_diff <= 24,
    });
  }

  public changeLocalTime(ev: React.FormEvent<HTMLElement>) {
    try {
      const target = ev.target as HTMLSelectElement;

      const target_form = target.form as HTMLFormElement;
      const avail_start = (
        target_form.elements.namedItem("avail_start") as HTMLInputElement
      ).value;
      const avail_end = (
        target_form.elements.namedItem("avail_end") as HTMLInputElement
      ).value;
      const timezone = (
        target_form.elements.namedItem("timezone") as HTMLInputElement
      ).value;

      const local_reset_time = moment
        .tz(EVENT_TIME, "YYYY-MM-DD hh:mm A", "America/Los_Angeles")
        .tz(timezone);

      const local_start_time_hours =
        local_reset_time.format("HH") + ":00 " + local_reset_time.format("A");

      console.log(
        "Available start time",
        local_reset_time.format(MOMENT_OUTPUT_FORMAT_BROWSER)
      );

      console.log(
        "Current Reset in Target Timezone:" +
          local_reset_time.format(MOMENT_OUTPUT_FORMAT_BROWSER) +
          " " +
          timezone
      );

      const year_date_day = local_reset_time.format("YYYY-MM-DD");
      const hours = avail_start;
      const resolved_input_raw = year_date_day + " " + hours;
      const resolved_input_moment = moment.tz(
        resolved_input_raw,
        "YYYY-MM-DD hh:mm A",
        timezone
      );
      const resolved_converted_moment = moment
        .tz(resolved_input_raw, "YYYY-MM-DD hh:mm A", timezone)
        .tz("America/Los_Angeles");

      const event_diff = resolved_converted_moment.diff(EVENT_MOMENT, "hours");

      this.setState({
        resolved_input_time:
          resolved_input_moment.format(MOMENT_OUTPUT_FORMAT_BROWSER) +
          " " +
          timezone,
        resolved_converted_time:
          resolved_converted_moment.format(MOMENT_OUTPUT_FORMAT_BROWSER) +
          " America/Los_Angeles",
        valid_time: event_diff >= 0 && event_diff <= 24,
        startTime: avail_start,
        endTime: avail_end,
      });
    } catch (err) {
      console.log(err);
    }
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

    let error_field: "discord" | "bungie" | "none" = "none";
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
        "Time Available Start": this.state.allDay
          ? "10:00 AM"
          : (form.elements.namedItem("avail_start") as HTMLInputElement).value,
        "Time Available End": this.state.allDay
          ? "11:59 PM"
          : (form.elements.namedItem("avail_end") as HTMLInputElement).value,
        "Time Zone": this.state.allDay
          ? "America/Los_Angeles"
          : (form.elements.namedItem("timezone") as HTMLInputElement).value,
        "Full Day": (form.elements.namedItem("all_day") as HTMLInputElement)
          .checked
          ? "Yes"
          : "No",
        "Fireteam Experience": (
          form.elements.namedItem("experience") as HTMLInputElement
        ).checked
          ? "Experienced Only"
          : "Any one",
        Notes: (
          form.elements.namedItem("notes") as HTMLInputElement
        ).value.trim(),
        "Preferred People": (
          form.elements.namedItem("preferred_teammates") as HTMLInputElement
        ).value.trim(),
        "Submitted Timestamp": moment().unix(),
      };

      axios({
        method: "POST",
        data: {
          form_token: "b84bc2781637ef99d1cbb0ec728d58ef",
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

          console.log(response);
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
          if (is_enter_key && ev.target.tagName.toLowerCase() != "textarea") {
            ev.preventDefault();
            return false;
          }
        }}
        action="#goober"
        method="POST"
      >
        <H3>Raid Signup!</H3>
        <p>
          In the Level Crush Day 1 for the upcoming re-release of the Kings Fall
          raid, we want everyone to have fun while also possibly being
          competitive in getting that day 1 clear! the following form will help
          us get everyone groups of people that should be a good fit together.
          We are aiming for everyone to have a good experience, so if incidents
          or difficulties do arise, please inform __ of the issue and our team
          setting up this day 1 will do their best to help resolve the
          situation(s) without detracting too much from your experience.
        </p>

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
          label="Time Availability"
          className="flex justify-between flex-wrap"
        >
          <FormField
            className="flex-initial w-full lg:w-auto toggle"
            type="toggle"
            id="all_day"
            name="all_day"
            label="I'm available for the full event"
            disabled={this.state.form_submitting}
            onChange={(ev) => {
              this.setState({
                allDay: (ev.target as HTMLInputElement).checked,
              });
              this.changeLocalTime(ev);
            }}
          />
          <br />
          <div className="w-full flex-initial">
            {this.state.allDay ? (
              <p>
                Awesome! You wont need to worry about providing your
                availability
              </p>
            ) : (
              <p>Please provide your availability below</p>
            )}
          </div>
          <hr />
          <div
            className={
              "flex flex-wrap justify-between w-full flex-initial" +
              (this.state.allDay ? " opacity-25" : "")
            }
          >
            <div className="w-full flex-initial my-4 mb-8">
              <p className="mt-4 dark:text-green-700 text-green-900 font-bold">
                <span className="dark:text-white text-black font-bold mr-2">
                  Event Starts:
                </span>
                <span className="inline-block">
                  {EVENT_MOMENT.format("hh:mm A")} America/Los_Angeles &nbsp;
                </span>
                <span className="inline-block">
                  {EVENT_MOMENT.format("MMMM Do")} 2022
                </span>
              </p>
              <p className="mt-4">
                <span className="dark:text-white text-black font-bold mr-2">
                  Local Starts:
                </span>
                <span className="inline-block">
                  {this.state.resolved_input_time}
                </span>
              </p>
              <p className="mt-4">
                <span className="dark:text-white text-black font-bold mr-2">
                  Availability Starts:
                </span>
                <span
                  className={
                    "inline-block " +
                    (this.state.valid_time
                      ? "dark:text-green-700 text-green-900 font-bold"
                      : "text-red-700")
                  }
                >
                  {this.state.resolved_converted_time}
                </span>
              </p>
            </div>
            <FormField
              className="flex-initial w-full  md:w-1/4"
              type="select"
              id="avail_start"
              name="avail_start"
              label="Start"
              disabled={this.state.form_submitting || this.state.allDay}
              value={
                this.state.startTime != "" ? this.state.startTime : "10:00 AM"
              }
              options={AVAILABILITY_TIMES}
              onChange={this.changeLocalTime}
            />
            <FormField
              className="flex-initial w-full md:w-1/4"
              type="select"
              id="avail_end"
              name="avail_end"
              disabled={this.state.form_submitting || this.state.allDay}
              value={this.state.endTime != "" ? this.state.endTime : "11:00 PM"}
              label="End"
              options={AVAILABILITY_TIMES}
              onChange={this.changeLocalTime}
            />
            <FormField
              className="flex-intial w-full md:w-1/4"
              type=""
              id="timezone"
              name="timezone"
              label="Time Zone"
              list="timezoneList"
              disabled={this.state.form_submitting || this.state.allDay}
              value={
                this.state.timezone != "" ? this.state.timezone : undefined
              }
              onChange={this.changeLocalTime}
              onBlur={this.changeLocalTime}
              onCopy={this.changeLocalTime}
            />
            <datalist id="timezoneList">
              {moment.tz
                .names()
                .map((tz, index): FormFieldPropsOption => {
                  return { value: tz, text: tz };
                })
                .map((choice, choice_index) => (
                  <option
                    key={"timezonelist_" + choice_index}
                    value={choice.value}
                  />
                ))}
            </datalist>
          </div>
        </FormFieldGroup>
        <hr />
        <FormFieldGroup label="Additional Information" className="">
          <FormField
            type="textarea"
            id="preferred_teammates"
            name="preferred_teammates"
            placeholder="Please seperate each team mate with a comma or line..."
            label="Preferred Teammates (Discord Usernames)"
            textarea={{ rows: 6 }}
            disabled={this.state.form_submitting}
          />
          <FormField
            type="textarea"
            id="notes"
            name="notes"
            placeholder="Any additional notes?"
            textarea={{ rows: 6 }}
            label="Notes"
            disabled={this.state.form_submitting}
          />

          <FormField
            type="toggle"
            className="toggle"
            id="experience"
            name="experience"
            label="I want a experienced fireteam only"
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
            </Container>
          </Hero>
          {this.state.form_submit_success
            ? this.render_success()
            : this.render_form()}
        </main>
      </OffCanvas>
    );
  }
}

export default SignupPage;
