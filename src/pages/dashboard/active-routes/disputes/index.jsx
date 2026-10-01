import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DisputesListView } from 'src/sections/active-sections/disputes-view/view/disputes-list-view';

const metadata = { title: `Disputes - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DisputesListView />
    </>
  );
}
