import { createWriteStream } from "fs";
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
import googleSheets from '../core/googleSheet.mjs'
const {Sheets} = googleSheets;
const sheets = new Sheets();



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
  bungieUsername: string;
  startTime:string;
  endTime:string;
  notes:string;
  teamates:string;
}

export class SignupPage extends React.Component<{}, SignupPageState> {
  private _mounted = false;
  public constructor(props: any) {
    super(props);

    this.state = {
      displayName: "",
      timezone: moment.tz.guess(),
      bungieUsername: "",
      startTime:"",
      endTime:"",
      notes:"",
      teamates:"",

      

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
public updateState = (event: React.ChangeEvent<HTMLInputElement>) => {

  switch(event.target.id){
  case "bungie":
    this.setState({bungieUsername:event.target.value});
    break;
  case "discord":
    this.setState({displayName:event.target.value});
    break;
  case "avail_start":
    this.setState({startTime:event.target.value});
    break;
  case "avail_end":
    this.setState({endTime:event.target.value});
    break;
  case "timezone":
    this.setState({timezone:event.target.value});
    break;
  case "preferred_teammates":
    this.setState({teamates:event.target.value});
    break;
  case "notes":
    this.setState({notes:event.target.value})
 }

}

public updateData = () => {
  sheets.start([this.state.displayName,this.state.bungieUsername,this.state.startTime,this.state.endTime,"",this.state.timezone,"","",this.state.teamates,Date.now().toString()])
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
          <Form onSubmit={this.updateData}>
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
                onChange={e => this.updateState}
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
              <p className="w-full flex-initial my-4">
                <span>Raid Takes place at 10:00 AM PST on August 26th </span>
                <br />
                <span>
                  You have chosen: <span>X</span> on <span>Y</span>
                </span>
              </p>
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
                
                value={
                  this.state.startTime != ""
                    ? this.state.startTime
                    : "10:00 am"
                }
                options={AVAILABILITY_TIMES}
              />
              <FormField
                className="flex-initial w-full md:w-1/4"
                type="select"
                id="avail_end"
                name="avail_end"
                
                value={
                  this.state.endTime != ""
                    ? this.state.endTime
                    : "11:00 pm"
                }
                label="End"
                options={AVAILABILITY_TIMES}
              />
              <FormField
                className="flex-intial w-full md:w-1/4"
                type="select"
                id="timezone"
                name="timezone"
                label="Time Zone"
                value={
                  this.state.timezone != ""
                    ? this.state.timezone
                    : undefined
                }
                options={moment.tz
                  .names()
                  .map((tz, index): FormFieldPropsOption => {
                    return { value: tz, text: tz };
                  })}
               
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
                value={
                  this.state.teamates != ""
                    ? this.state.teamates
                    : undefined
                }
              />
              <FormField
                type="textarea"
                id="notes"
                name="notes"
                placeholder="Any additional notes?"
                textarea={{ rows: 6 }}
                label="Notes"
                value={
                  this.state.notes != ""
                    ? this.state.notes
                    : undefined
                }
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
