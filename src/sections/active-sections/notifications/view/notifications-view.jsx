import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs'
import { Iconify } from 'src/components/iconify'
import { useTabs } from 'src/hooks/use-tabs'
import { DashboardContent } from 'src/layouts/dashboard'
import { paths } from 'src/routes/paths'
import Announcements from '../announcements'
import PushCompaignComposer from '../push-compaign-composer'

const TABS = [
    { value: 'notifications', label: 'Notifications', icon: 'solar:bell-bing-bold-duotone' },
    { value: 'announcements', label: 'Announcements', icon: 'ri:megaphone-fill' },
]

const NotificationsView = () => {
    const tabs = useTabs('notifications');

    return (
        <DashboardContent maxWidth={false}>
            <CustomBreadcrumbs
                heading="Notifications"
                links={[
                    { name: 'Dashboard', href: paths.adminDashboard.root },
                    { name: 'Notifications' },
                ]}

                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Tabs
                value={tabs.value}
                onChange={tabs.onChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
            >
                {TABS.map((tab) => (
                    <Tab
                        key={tab.value}
                        value={tab.value}
                        label={tab.label}
                        icon={<Iconify icon={tab.icon} />}
                    />
                ))}
            </Tabs>

            {tabs.value === 'notifications' && (
                <PushCompaignComposer
                    title="Push Campaign Composer"
                    icon="solar:bell-bing-bold-duotone"
                />
            )}

            {tabs.value === 'announcements' && (
                <Announcements
                    title="Announcements"
                    subheader="In-app banner announcements shown across the mobile app."
                    icon="ri:megaphone-fill"
                />
            )}
        </DashboardContent>

    )
}

export default NotificationsView
