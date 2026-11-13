import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CategoryDetailView } from 'src/sections/active-sections/category-view/view/category-detail-view';

const metadata = { title: `Category details - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <CategoryDetailView />
    </>
  );
}
