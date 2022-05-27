import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DiscordLink from "./discord_link";
import Container from "./elements/container";
import { H2 } from "./elements/headings";

export const UnderConstruction = (props: any) => (
  <Container
    minimalCSS={true}
    className="mx-auto my-8 flex items-center justify-center self-center min-h-full h-auto"
  >
    <div className="flex-initial w-2/4 h-auto text-center">
      <H2
        minimalCSS={true}
        className="text-6xl text-black dark:text-yellow-400 font-headline font-bold uppercase tracking-widest "
      >
        <FontAwesomeIcon icon={faQuestionCircle}></FontAwesomeIcon>
        <br />
        <br />
        <span>Under Construction.</span>
      </H2>
      <p className="text-xl my-8">Please check back later.</p>
      <div className="w-auto h-auto inline-block">
        <DiscordLink />
      </div>
    </div>
  </Container>
);

export default UnderConstruction;
