import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SectionComingSoon } from 'src/sections/active-sections/coming-soon-view';

const metadata = { title: `Events - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SectionComingSoon title="Events" />
    </>
  );
}
