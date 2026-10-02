import { Box, Card, CardHeader, Grid, IconButton, Link, Stack, Tooltip, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { varAlpha } from 'src/theme/styles';

import { getUserStatusOption } from './user-status';

const SOCIAL_PLATFORMS = [
    { key: 'tiktok', label: 'TikTok', icon: 'ri:tiktok-fill' },
    { key: 'instagram', label: 'Instagram', icon: 'ri:instagram-fill' },
    { key: 'x', label: 'X', icon: 'ri:twitter-x-fill' },
];

const formatValue = (value) => {
    if (value === 0 || value === false) return String(value);
    if (value === true) return 'Yes';
    return value || '';
};

const prettyText = (value) => {
    if (!value || typeof value !== 'string') return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
};

const formatCrafts = (crafts = []) => {
    if (!crafts.length) return [];

    return crafts
        .map((craft) => {
            if (typeof craft === 'string') {
                return /^[a-f0-9]{24}$/i.test(craft) ? null : { name: craft, _id: craft };
            }
            if (craft?.name || craft?.title) {
                return { ...craft, name: craft.name || craft.title };
            }
            return null;
        })
        .filter(Boolean);
};

const verificationColor = (status) => {
    const value = String(status || '').toLowerCase();
    if (value === 'verified' || value === 'completed') return 'success';
    if (value === 'pending' || value === 'incomplete') return 'warning';
    if (value === 'rejected' || value === 'failed') return 'error';
    return 'default';
};

const ProfileTab = ({ user }) => {
    const kv = user?.kv || {};
    const socialLinks = SOCIAL_PLATFORMS.filter((platform) => kv.socialLinks?.[platform.key]);
    const crafts = formatCrafts(user?.crafts);
    const badges = formatCrafts(user?.badges);
    const statusOption = getUserStatusOption(kv.status);
    const rating = kv.rating;
    const reviews = kv.reviews;
    const ratingValue =
        rating === 0 || rating
            ? `${rating}${reviews === 0 || reviews ? ` (${reviews} reviews)` : ''}`
            : reviews === 0 || reviews
                ? `${reviews} reviews`
                : '';
    const portfolioValue =
        kv.portfolio === 0 || kv.portfolio ? `${kv.portfolio} pieces` : '';
    const twoFactorValue =
        kv.twoFactorAuth === true ? 'Enabled' : kv.twoFactorAuth === false ? 'Off' : '';
    const onboardingValue =
        kv.isOnboardingCompletedDoc === true
            ? 'Completed'
            : kv.isOnboardingCompletedDoc === false
                ? 'Incomplete'
                : '';
    const languageValue = kv.language?.length === 2 ? kv.language.toUpperCase() : kv.language;

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
                <SectionCard title="About" icon="solar:user-id-bold-duotone">
                    <FieldRow label="Name" value={kv.name} />
                    <FieldRow label="Email" value={kv.email} href={kv.email ? `mailto:${kv.email}` : ''} />
                    <FieldRow label="Phone" value={kv.phone} />
                    <FieldRow label="Language" value={languageValue} />
                    <FieldRow label="City" value={kv.city} />
                    <FieldRow label="Bio" value={kv.Bio} last multiline />
                </SectionCard>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <SectionCard title="Account" icon="solar:shield-user-bold-duotone">
                    <FieldRow label="Status" last={false}>
                        {kv.status ? (
                            <Label variant="soft" color={statusOption?.color || 'default'}>
                                {statusOption?.label || prettyText(kv.status)}
                            </Label>
                        ) : (
                            <EmptyValue />
                        )}
                    </FieldRow>
                    <FieldRow label="User type" value={prettyText(kv.userType)} />
                    <FieldRow label="Onboarding">
                        {onboardingValue ? (
                            <Label variant="soft" color={verificationColor(onboardingValue)}>
                                {onboardingValue}
                            </Label>
                        ) : (
                            <EmptyValue />
                        )}
                    </FieldRow>
                    <FieldRow label="Portfolio" value={portfolioValue} />
                    <FieldRow label="Rating" value={ratingValue} />
                    <FieldRow label="Signed up" value={kv.signup} />
                    <FieldRow label="Timezone" value={kv.timezone} />
                    <FieldRow label="Crafts">
                        <ChipList items={crafts} />
                    </FieldRow>
                    <FieldRow label="Badges" last>
                        <ChipList items={badges} />
                    </FieldRow>
                </SectionCard>
            </Grid>

            <Grid item xs={12} md={12} lg={4}>
                <SectionCard title="Security & links" icon="solar:link-circle-bold-duotone">
                    <FieldRow label="Email">
                        {kv.emailVerification ? (
                            <Label variant="soft" color={verificationColor(kv.emailVerification)}>
                                {prettyText(kv.emailVerification)}
                            </Label>
                        ) : (
                            <EmptyValue />
                        )}
                    </FieldRow>
                    <FieldRow label="Phone">
                        {kv.phoneVerification ? (
                            <Label variant="soft" color={verificationColor(kv.phoneVerification)}>
                                {prettyText(kv.phoneVerification)}
                            </Label>
                        ) : (
                            <EmptyValue />
                        )}
                    </FieldRow>
                    <FieldRow label="Two-factor">
                        {twoFactorValue ? (
                            <Label variant="soft" color={kv.twoFactorAuth ? 'success' : 'default'}>
                                {twoFactorValue}
                            </Label>
                        ) : (
                            <EmptyValue />
                        )}
                    </FieldRow>
                    <FieldRow label="Website" value={kv.websiteUrl} href={kv.websiteUrl} />
                    <FieldRow label="Social" last>
                        {socialLinks.length ? (
                            <Stack direction="row" spacing={0.75} justifyContent="flex-end">
                                {socialLinks.map((platform) => (
                                    <Tooltip key={platform.key} title={platform.label}>
                                        <IconButton
                                            component="a"
                                            href={kv.socialLinks?.[platform.key]}
                                            target="_blank"
                                            rel="noopener"
                                            size="small"
                                            sx={(theme) => ({
                                                width: 32,
                                                height: 32,
                                                color: 'text.primary',
                                                bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                                            })}
                                        >
                                            <Iconify icon={platform.icon} width={16} />
                                        </IconButton>
                                    </Tooltip>
                                ))}
                            </Stack>
                        ) : (
                            <EmptyValue />
                        )}
                    </FieldRow>
                </SectionCard>
            </Grid>
        </Grid>
    );
};

function SectionCard({ title, icon, children }) {
    return (
        <Card sx={{ height: 1 }}>
            <CardHeader
                title={title}
                avatar={<Iconify icon={icon} width={22} />}
                sx={{ pb: 1 }}
                titleTypographyProps={{ variant: 'h6' }}
            />
            <Stack sx={{ px: 3, pb: 2 }}>{children}</Stack>
        </Card>
    );
}

function EmptyValue() {
    return (
        <Typography variant="body2" color="text.disabled">
            —
        </Typography>
    );
}

function ValueText({ value, href, multiline }) {
    const display = formatValue(value);

    if (!display) return <EmptyValue />;

    if (href) {
        return (
            <Link
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener"
                variant="subtitle2"
                sx={{ wordBreak: 'break-all' }}
            >
                {display}
            </Link>
        );
    }

    return (
        <Typography
            variant="subtitle2"
            sx={{
                wordBreak: 'break-word',
                whiteSpace: multiline ? 'pre-wrap' : 'normal',
            }}
        >
            {display}
        </Typography>
    );
}

function ChipList({ items = [] }) {
    if (!items.length) return <EmptyValue />;

    return (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap justifyContent="flex-end">
            {items.map((item) => (
                <Label key={item._id || item.name} variant="soft" color="primary">
                    {item.name}
                </Label>
            ))}
        </Stack>
    );
}

function FieldRow({ label, value, href, children, last = false, multiline = false }) {
    return (
        <Stack
            direction="row"
            spacing={2}
            alignItems={multiline ? 'flex-start' : 'center'}
            justifyContent="space-between"
            sx={{
                py: 1.5,
                minHeight: 48,
                ...(!last && {
                    borderBottom: (theme) => `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                }),
            }}
        >
            <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0, width: 112 }}>
                {label}
            </Typography>
            <Box sx={{ minWidth: 0, flex: 1, display: 'flex', justifyContent: 'flex-end', textAlign: 'right' }}>
                {children || <ValueText value={value} href={href} multiline={multiline} />}
            </Box>
        </Stack>
    );
}

export default ProfileTab;
