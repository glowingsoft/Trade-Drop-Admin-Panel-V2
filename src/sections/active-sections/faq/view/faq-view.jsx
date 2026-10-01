import { useEffect } from 'react';

import { Button, Card } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { useBoolean } from 'src/hooks/use-boolean';
import { DashboardContent } from 'src/layouts/dashboard';
import { handleApiError } from 'src/utils/errorHandler';
import { useGetFaqsQuery } from 'src/store/Reducer/faqs-api';

import { DashboardNoData } from 'src/sections/overview/app/dashboard-no-data';
import AddFaqForm from '../add-faq-modal';
import FaqsList from '../faqs-list';

export default function DashboardFaqView() {
  const quickOpen = useBoolean();
  const { data, isLoading, error } = useGetFaqsQuery();
  const faqs = data?.data || [];

  useEffect(() => {
    if (error) handleApiError(error);
  }, [error]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <DashboardContent
        maxWidth={false}
        sx={{
          pb: 2,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              my: { xs: 2, md: 1 },
            }}
          >
            Frequently Asked Questions
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={quickOpen.onTrue}
            sx={{ px: 2.5, py: 1 }}
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add FAQ
          </Button>
        </Box>

        <Card>
          {!faqs.length ? (
            <DashboardNoData />
          ) : (
            <Box gap={1}>
              <FaqsList allFaqs={faqs} />
            </Box>
          )}
        </Card>
      </DashboardContent>

      <AddFaqForm open={quickOpen.value} onClose={quickOpen.onFalse} />
    </>
  );
}
