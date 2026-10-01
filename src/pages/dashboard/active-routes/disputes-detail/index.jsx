import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DisputeDetailView } from 'src/sections/active-sections/disputes-view/view/dispute-detail-view';

const metadata = { title: `Dispute Detail - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DisputeDetailView />
    </>
  );
}
