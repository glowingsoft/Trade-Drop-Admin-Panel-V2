import { useEffect } from 'react';

import { IconButton, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { useBoolean } from 'src/hooks/use-boolean';
import { useTabs } from 'src/hooks/use-tabs';
import { useParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useGetUserByIdQuery } from 'src/store/Reducer/users-api';
import { varAlpha } from 'src/theme/styles';
import { handleApiError } from 'src/utils/errorHandler';

import { DropsListView } from 'src/sections/active-sections/drops/view/drops-list-view';
import { mapUserDetail } from '../map-user-detail';
import { PortfolioTab } from '../portfolio-tab';
import { ProfileCover } from '../profile-cover';
import ProfileTab from '../profile-tab';
import { ReviewTab } from '../review-tab';
import { TapTab } from '../tap-tab';
import QuickStatusChangeModal from '../user-status-dialog';

const TABS = [
  {
    value: 'profile',
    label: 'Profile',
    icon: 'solar:users-group-rounded-bold-duotone',
  },
  {
    value: 'portfolio',
    label: 'Portfolio',
    icon: 'solar:gallery-wide-bold-duotone',
  },
  {
    value: 'drops',
    label: 'Drops',
    icon: 'boxicons:git-pull-request',
  },
  {
    value: 'tapHistory',
    label: 'Drop In History',
    icon: 'fluent:cursor-click-20-filled',
  },
  {
    value: 'reviews',
    label: 'Reviews',
    icon: 'eva:star-fill',
  },
];

function UserProfileView() {
  const { id } = useParams();
  const { value, onChange } = useTabs('profile');
  const openModal = useBoolean();

  const { data, isLoading, error } = useGetUserByIdQuery(id, { skip: !id });

  useEffect(() => {
    if (error) handleApiError(error);
  }, [error]);

  const user = mapUserDetail(data);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !data) {
    return (
      <Box sx={{ px: { xs: 2, md: 6 }, pb: 5, pt: 3 }}>
        <CustomBreadcrumbs
          heading="User Details"
          links={[
            { name: 'Dashboard', href: paths.adminDashboard.root },
            { name: 'Users', href: paths.adminDashboard.users.root },
            { name: 'User Details' },
          ]}
          sx={{ mb: { xs: 3, md: 3 } }}
        />
        <EmptyContent filled sx={{ py: 10 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="User Details"
        links={[
          { name: 'Dashboard', href: paths.adminDashboard.root },
          { name: 'Users', href: paths.adminDashboard.users.root },
          { name: user.kv?.name || 'User Details' },
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Card sx={{ mb: 3, height: { xs: 'auto', md: 320 }, position: 'relative' }}>
        <ProfileCover
          name={user?.kv?.name}
          avatarUrl={user?.kv?.image}
          city={user?.kv?.city}
          trustScore={user?.kv?.trust}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            width: 1,
            top: 20,
            zIndex: 9,
            px: { xs: 2, md: 3 },
            position: 'absolute',
          }}
        >
          <Tooltip title="Edit" arrow placement="top">
            <IconButton
              onClick={openModal.onTrue}
              sx={{
                color: 'common.white',
                bgcolor: (theme) => varAlpha(theme.vars.palette.common.whiteChannel, 0.16),
                border: (theme) => `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.24)}`,
                '&:hover': {
                  bgcolor: (theme) => varAlpha(theme.vars.palette.common.whiteChannel, 0.24),
                },
              }}
            >
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          display="flex"
          justifyContent={{ xs: 'center', md: 'flex-end' }}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            px: { xs: 0, md: 3 },
            position: { xs: 'relative', md: 'absolute' },
            bgcolor: 'background.paper',
          }}
        >
          <Tabs
            value={value}
            onChange={onChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ maxWidth: 1 }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                icon={<Iconify icon={tab.icon} />}
                label={tab.label}
              />
            ))}
          </Tabs>
        </Box>
      </Card>

      {value === 'profile' && <ProfileTab user={user} />}

      {value === 'portfolio' && <PortfolioTab items={user?.portfolioItems} />}

      {value === 'drops' && <DropsListView ownerId={user.id} embedded />}

      {value === 'tapHistory' && <TapTab applicantId={user.id} />}

      {value === 'reviews' && <ReviewTab toUserId={user.id} />}

      <QuickStatusChangeModal
        open={openModal.value}
        onClose={openModal.onFalse}
        currentUser={{ id: user.id, status: user.kv?.status }}
      />
    </Box>
  );
}

export default UserProfileView;
