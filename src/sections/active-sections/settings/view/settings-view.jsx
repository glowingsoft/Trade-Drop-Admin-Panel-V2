import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { toast } from 'src/components/snackbar';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { useGetAppSettingsQuery, useUpdateAppSettingsMutation } from 'src/store/Reducer/settings-api';
import { handleApiError } from 'src/utils/errorHandler';

const schema = zod.object({
  radarRadiusKm: zod.coerce
    .number({ invalid_type_error: 'Radar radius is required' })
    .min(1, { message: 'Radar radius must be at least 1 km' })
    .max(100, { message: 'Radar radius must be at most 100 km' }),
});

const SettingsView = () => {
  const { data, isLoading, error } = useGetAppSettingsQuery();
  const [updateAppSettings] = useUpdateAppSettingsMutation();

  const defaultValues = useMemo(
    () => ({
      radarRadiusKm: data?.radarRadiusKm ?? 1,
    }),
    [data]
  );

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (error) handleApiError(error);
  }, [error]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const response = await updateAppSettings({
        radarRadiusKm: formData.radarRadiusKm,
      }).unwrap();

      if (response.message) toast.success(response.message);
    } catch (err) {
      handleApiError(err);
    }
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContent maxWidth={false}>
      <CustomBreadcrumbs
        heading="Settings"
        links={[
          { name: 'Dashboard', href: paths.adminDashboard.root },
          { name: 'Settings' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <CardHeader title="Global settings" avatar={<Iconify icon="solar:settings-bold-duotone" />} />
        <CardContent>
          <Form methods={methods} onSubmit={onSubmit}>
            <Typography variant="subtitle2">Radar radius</Typography>
            <Field.Slider
              name="radarRadiusKm"
              helperText="Maximum distance a user can set for Radar discovery."
              min={1}
              max={100}
              step={1}
              sx={{ width: '100%', mt: 1 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={isSubmitting}
              >
                Save Settings
              </LoadingButton>
            </Box>
          </Form>
        </CardContent>
      </Card>
    </DashboardContent>
  );
};

export default SettingsView;
