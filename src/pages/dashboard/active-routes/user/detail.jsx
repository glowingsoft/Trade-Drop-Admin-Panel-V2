import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import UserProfileView from 'src/sections/active-sections/user/view/user-profile-view';


// ----------------------------------------------------------------------

const metadata = { title: `User Details - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserProfileView />

    </>
  );
}
