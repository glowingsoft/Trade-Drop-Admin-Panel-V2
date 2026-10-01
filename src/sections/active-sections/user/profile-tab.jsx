import { alpha, Box, Card, CardHeader, Divider, Grid, IconButton, Link, Stack, Tooltip, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';

const SOCIAL_PLATFORMS = [
    { key: 'tiktok', label: 'TikTok', icon: 'ri:tiktok-fill' },
    { key: 'instagram', label: 'Instagram', icon: 'ri:instagram-fill' },
    { key: 'x', label: 'X', icon: 'ri:twitter-x-fill' },
];

const ProfileTab = ({ user }) => {

    const socialLinks = SOCIAL_PLATFORMS.filter((platform) => user?.kv?.socialLinks?.[platform.key]);

    return (
        <Stack spacing={2}>
            <Box>
                <Typography variant="h6">User details</Typography>
                <Typography variant="body2" color="text.secondary">
                    Basic information about the User.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <DetailSection label="Profile" icon="solar:users-group-rounded-bold-duotone">

                            <Stack sx={{ p: 3 }} spacing={1.5} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>

                                <DetailItem label="Name" value={user?.kv?.name} icon="solar:users-group-rounded-bold-duotone" />

                                <DetailItem label="Email" value={user?.kv.email} icon="solar:letter-bold" />

                                <DetailItem label="Portfolio size" value={`${user?.kv?.portfolio} pieces`} icon="solar:shield-user-bold" />

                                <DetailItem label="Rating" value={`${user?.kv?.rating} (${user?.kv?.reviews} reviews)`} icon="eva:star-fill" />

                                <DetailItem label="Bio" value={user?.kv?.Bio} icon="solar:bill-list-bold" />
                            </Stack>
                        </DetailSection>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <DetailSection label="Social & Links" icon="solar:link-circle-bold-duotone">

                            <Stack sx={{ p: 3 }} spacing={1.5} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>

                                <DetailItem
                                    label="Website"
                                    value={user?.kv?.websiteUrl}
                                    icon="solar:global-bold"
                                    href={user?.kv?.websiteUrl}
                                />
                            </Stack>

                            {!!socialLinks.length && (
                                <>
                                    <Divider sx={{ borderStyle: 'dashed' }} />

                                    <Stack sx={{ px: 3, py: 2.5 }} spacing={1.5}>
                                        <Typography variant="caption" color="text.secondary">
                                            Social links
                                        </Typography>

                                        <Stack direction="row" spacing={1.5}>
                                            {socialLinks.map((platform) => (
                                                <Tooltip key={platform.key} title={platform.label}>
                                                    <IconButton
                                                        component="a"
                                                        href={user?.kv?.socialLinks?.[platform.key]}
                                                        target="_blank"
                                                        rel="noopener"
                                                        sx={(theme) => ({
                                                            width: 36,
                                                            height: 36,
                                                            color: 'primary.dark',
                                                            bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.24 : 0.1),
                                                        })}
                                                    >
                                                        <Iconify icon={platform.icon} width={18} />
                                                    </IconButton>
                                                </Tooltip>
                                            ))}
                                        </Stack>
                                    </Stack>
                                </>
                            )}
                        </DetailSection>
                    </Card>
                </Grid>
            </Grid>
        </Stack >
    );
}

// ----------------------------------------------------------------------

function DetailSection({ label, children, icon, sx }) {
    return (
        <Box sx={sx}>

            <CardHeader title={label} avatar={<Iconify icon={icon} />} />

            <Divider sx={{ mt: 0.5, mb: 2 }} />

            {children}
        </Box>
    );
}

function DetailItem({ label, value, icon, href }) {
    return (
        <Stack direction="row" spacing={1.5} alignItems="flex-start">

            <Stack
                alignItems="center"
                justifyContent="center"
                sx={(theme) => ({
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    flexShrink: 0,
                    bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.24 : 0.1),
                })}
            >
                <Iconify
                    icon={icon}
                    width={20}
                    sx={{ color: 'primary.dark' }}
                />
            </Stack>

            <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary">
                    {label}
                </Typography>

                {href ? (
                    <Link
                        href={href}
                        target="_blank"
                        rel="noopener"
                        variant="body2"
                        sx={{ fontWeight: 600, wordBreak: 'break-all' }}
                    >
                        {value}
                    </Link>
                ) : (
                    <Typography variant="body2" fontWeight={600}>
                        {value}
                    </Typography>
                )}
            </Stack>
        </Stack>
    );
}
export default ProfileTab
