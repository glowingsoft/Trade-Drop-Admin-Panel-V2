import { Box, Button, Card, CardContent, CardHeader, Divider } from '@mui/material'
import React from 'react'
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs'
import { Iconify } from 'src/components/iconify'
import { DashboardContent } from 'src/layouts/dashboard'
import { paths } from 'src/routes/paths'
import { useForm } from 'react-hook-form';
import { Field, Form } from 'src/components/hook-form';


const SettingsView = () => {

    const defaultValues = {
        maintenanceMode: false,
        minimumAppVersion: 1,
        radarSearchRadiusLimit: 50
    }

    const schema = zod.object({
        maintenanceMode: zod.boolean(),
        minimumAppVersion: zod.number(),
        radarSearchRadiusLimit: zod.number
    });

    const methods = useForm({
        resolver: zodResolver(schema),
        defaultValues
    });

    const handleSubmit = (data) => {

    }

    return (
        <DashboardContent maxWidth={false}>
            <CustomBreadcrumbs
                heading="Settings"
                links={[
                    { name: 'Dashboard', href: paths.adminDashboard.root },
                    { name: 'configuration' },
                ]}

                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Card>
                <CardHeader title="Global settings" avatar={<Iconify icon="solar:settings-bold-duotone" />} />
                <CardContent>

                    <Form methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
                        <Field.Switch
                            name="maintenanceMode"
                            label="Maintenance mode"
                            helperText="Takes the app offline for all users with a holding screen."
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row-reverse',
                                justifyContent: 'space-between',
                                margin: 0,
                            }}
                        />
                        {/* <Divider sx={{ my: 3 }} /> */}

                        {/* <Field.Text
                            name="minimumAppVersion"
                            label="Minimum app version"
                            type="number"
                            helperText="Users below this version are prompted to update before continuing."
                            sx={{ width: '100%' }}
                        /> */}

                        <Field.Slider
                            name="radarSearchRadiusLimit"
                            label="Radar search radius limit"
                            helperText="Maximum distance a user can set for Radar discovery."
                            min={1}
                            max={100}
                            step={1}
                            sx={{ width: '100%', mt: 2 }}
                        />

                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                            <Button type="submit" variant="contained" color="primary">Save Settings</Button>
                        </Box>
                    </Form>

                </CardContent>
            </Card>
        </DashboardContent>
    )
}

export default SettingsView