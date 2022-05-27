import LoginGuard from "../../components/login_guard";
import OffCanvas from "../../components/offcanvas";
import SiteHeader from "../../components/site_header";
import UnderConstruction from "../../components/under_construction";

export const MemberProfilePage = (props: any) => (
  <OffCanvas>
    <SiteHeader />
    <main>
      <LoginGuard>
        <UnderConstruction />
      </LoginGuard>
    </main>
  </OffCanvas>
);

export default MemberProfilePage;
