import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EventDetailView } from 'src/sections/active-sections/events-view/view/event-detail-view';

const metadata = { title: `Event Details - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EventDetailView />
    </>
  );
}
