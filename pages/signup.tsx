import moment from "moment-timezone";
import Head from "next/head";
import React from "react";
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
    (is_pm ? "pm" : "am");

  AVAILABILITY_TIMES.push({ value: hour_conv });
  hour_x++;
}

export interface SignupPageState {
  displayName: string;
  timezone: string;
}

export class SignupPage extends React.Component<{}, SignupPageState> {
  private _mounted = false;
  public constructor(props: any) {
    super(props);

    this.state = {
      displayName: "",
      timezone: moment.tz.guess(),
    };
    this.onMemberLogin = this.onMemberLogin.bind(this);
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
          <Container>
            <H3>Raid Signup! Placeholder</H3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum elementum urna a metus lobortis, at porttitor lacus
              tempor. Integer feugiat elementum pulvinar. Nullam posuere ante
              nisl, sed sagittis nunc malesuada ac. Orci varius natoque
              penatibus et magnis dis parturient montes, nascetur ridiculus mus.
              Praesent dapibus molestie commodo. Nam quis libero et nisl
              vestibulum posuere. Morbi non orci blandit, volutpat quam at,
              convallis nisl. Nullam sapien massa, pulvinar nec vehicula ac,
              tincidunt sit amet sapien. Maecenas tincidunt aliquet risus, id
              rhoncus nisi efficitur at. In hac habitasse platea dictumst.
              Pellentesque porttitor nibh ultricies magna eleifend accumsan eu
              ac neque. Donec sit amet ex tortor. Proin id vestibulum odio. Nam
              nisl massa, rutrum in enim at, tempor malesuada quam.
            </p>
          </Container>
          <Form>
            <FormFieldGroup label="Usernames">
              <FormField
                label="Discord Username"
                name="discord"
                id="discord"
                type="text"
                placeholder="User#XXXX"
                value={
                  this.state.displayName != ""
                    ? this.state.displayName
                    : undefined
                }
              />
              <FormField
                label="Bungie Username"
                name="bungie"
                id="bungie"
                type="text"
                placeholder="Guaridan#XXXX"
              />
            </FormFieldGroup>
            <hr />
            <FormFieldGroup
              label="Time Availability"
              className="flex justify-between flex-wrap"
            >
              <FormField
                className="flex-initial w-full lg:w-auto"
                type="checkbox"
                id="all_day"
                name="all_day"
                label="Entire Day 1"
              />
              <FormField
                className="flex-initial w-full  md:w-1/4"
                type="select"
                id="avail_start"
                name="avail_start"
                label="Start"
                value="10:00 am"
                options={AVAILABILITY_TIMES}
              />
              <FormField
                className="flex-initial w-full md:w-1/4"
                type="select"
                id="avail_end"
                name="avail_end"
                value="11:00 pm"
                label="End"
                options={AVAILABILITY_TIMES}
              />
              <FormField
                className="flex-intial w-full md:w-1/4"
                type="select"
                id="timezone"
                name="timezone"
                label="Time Zone"
                options={moment.tz
                  .names()
                  .map((tz, index): FormFieldPropsOption => {
                    return { value: tz, text: tz };
                  })}
                value={this.state.timezone}
              />
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
              />
              <FormField
                type="textarea"
                id="notes"
                name="notes"
                placeholder="Any additional notes?"
                textarea={{ rows: 6 }}
                label="Notes"
              />
            </FormFieldGroup>
            <hr />
            <button
              className="block w-full max-w-[12rem] text-center text-white bg-blue-600 hover:bg-blue-900 hover:cursor-pointer rounded px-4 py-2  mx-0 my-8"
              type="submit"
            >
              Submit
            </button>
          </Form>
        </main>
      </OffCanvas>
    );
  }
}

export default SignupPage;
