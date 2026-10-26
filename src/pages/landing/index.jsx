import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LandingView } from 'src/sections/landing/landing-view';

const metadata = {
  title: `TradeDrop - ${CONFIG.site.name}`,
  description:
    'TradeDrop is a private barter for photographers, stylists, and the people who make the work. Post a drop. Tap in. Trade the craft.',
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <LandingView />
    </>
  );
}
