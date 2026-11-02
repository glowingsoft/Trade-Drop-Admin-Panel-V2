import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CircleDetailView } from 'src/sections/active-sections/circles-view/view/circle-detail-view';

const metadata = { title: `Circle Details - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CircleDetailView />
    </>
  );
}
