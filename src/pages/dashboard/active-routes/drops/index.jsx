import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DropsListView } from 'src/sections/active-sections/drops/view/drops-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Drops - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DropsListView />
    </>
  );
}
