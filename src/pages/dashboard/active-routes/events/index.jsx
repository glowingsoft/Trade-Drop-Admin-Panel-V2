import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EventsListView } from 'src/sections/active-sections/events-view/view/events-list-view';

const metadata = { title: `Events - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EventsListView />
    </>
  );
}
