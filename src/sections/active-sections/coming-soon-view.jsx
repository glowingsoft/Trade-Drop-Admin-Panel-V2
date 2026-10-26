import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { ComingSoonIllustration } from 'src/assets/illustrations';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function SectionComingSoon({ title }) {
  return (
    <DashboardContent maxWidth={false}>
      <CustomBreadcrumbs
        heading={title}
        links={[{ name: 'Dashboard', href: paths.adminDashboard.root }, { name: title }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        <ComingSoonIllustration sx={{ mb: 3 }} />

        <Typography variant="h4">Coming soon</Typography>
      </Box>
    </DashboardContent>
  );
}
