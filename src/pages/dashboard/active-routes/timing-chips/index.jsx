import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TimingChipsListView } from 'src/sections/active-sections/timing-chips-view/view/timing-chips-list-view';

const metadata = { title: `Timing chips - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TimingChipsListView />
    </>
  );
}
