
import { IconButton, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { varAlpha } from 'src/theme/styles';
import { useBoolean } from 'src/hooks/use-boolean';
import { useTabs } from 'src/hooks/use-tabs';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { DropsTab } from '../drops-tab';
import { userDetail } from '../mocks/data';
import { ProfileCover } from '../profile-cover';
import ProfileTab from '../profile-tab';
import { PortfolioTab } from '../portfolio-tab';
import { ReviewTab } from '../review-tab';
import { TapTab } from '../tap-tab';
import QuickStatusChangeModal from '../user-status-dialog';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'profile',
    label: 'Profile',
    icon: "solar:users-group-rounded-bold-duotone",
  },
  {
    value: 'portfolio',
    label: 'Portfolio',
    icon: "solar:gallery-wide-bold-duotone",
  },
  {
    value: 'drops',
    label: 'Drops',
    icon: "boxicons:git-pull-request",
  },
  {
    value: 'tapHistory',
    label: 'Tap History',
    icon: "fluent:cursor-click-20-filled",
  },
  {
    value: 'reviews',
    label: 'Reviews',
    icon: "eva:star-fill",
  }
];

// ----------------------------------------------------------------------

function UserProfileView() {

  const { value, onChange } = useTabs("profile");

  const user = userDetail;

  const openModal = useBoolean();

  const router = useRouter();

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, pb: 5, pt: 3, display: 'flex', flexDirection: 'column' }}>

      <Box sx={{ mb: 2 }}>
        <Button
          onClick={router.back}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}>
          Back
        </Button>
      </Box>

      <CustomBreadcrumbs
        heading="User Details"
        links={[
          { name: 'Dashboard', href: paths.adminDashboard.root },
          { name: 'Users', href: paths.adminDashboard.users.root },
          { name: 'User Details' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: 3, height: 320 }}>
        <ProfileCover
          name={user?.kv?.name}
          avatarUrl={user?.kv?.image}
          city={user?.kv?.city}
          trustScore={user?.kv?.trust}
        />

        <Box sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
          width: 1,
          top: 20,
          zIndex: 9,
          px: { md: 3 },
          position: 'absolute',
        }}>

           <Tooltip title="Edit" arrow placement='top'>
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
            px: { md: 3 },
            position: 'absolute',
            bgcolor: 'background.paper',
          }}
        >
          <Tabs value={value} onChange={onChange}>
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

      {value === 'drops' && <DropsTab droplist={user?.drops} />}

      {value === 'tapHistory' && <TapTab droplist={user?.drops} />}

      {value === "reviews" && <ReviewTab reviews={user?.reviews} />}

      <QuickStatusChangeModal
        open={openModal.value}
        onClose={openModal.onFalse}
        currentUser={{}}
      />


    </Box >
  );
}

export default UserProfileView;