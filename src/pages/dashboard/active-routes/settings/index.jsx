import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import SettingsView from '../../../../sections/active-sections/settings/view/settings-view';


// ----------------------------------------------------------------------

const metadata = { title: `Settings - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SettingsView />
    </>
  );
}
