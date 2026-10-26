import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CirclesListView } from 'src/sections/active-sections/circles-view/view/circles-list-view';

const metadata = { title: `Circles - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CirclesListView />
    </>
  );
}
