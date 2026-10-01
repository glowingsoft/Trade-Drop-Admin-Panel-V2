import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CategoryListView } from 'src/sections/active-sections/category-view/view/category-list-view';
import DashboardFaqView from 'src/sections/active-sections/faq/view/faq-view';

// ----------------------------------------------------------------------

const metadata = { title: `FAQs - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <DashboardFaqView />
        </>
    );
}
