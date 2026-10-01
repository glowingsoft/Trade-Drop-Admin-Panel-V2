import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BadgesListView } from 'src/sections/active-sections/badges-view/view/badges-list-view';

const metadata = { title: `Badges - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BadgesListView />
    </>
  );
}
