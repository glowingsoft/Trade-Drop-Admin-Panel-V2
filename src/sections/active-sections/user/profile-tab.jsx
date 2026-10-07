import { Box, Card, Divider, IconButton, Link, Stack, Tooltip, Typography } from '@mui/material';

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
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
      <Card sx={{ width: { xs: 1, md: '70%' }, display: 'flex', flexDirection: 'column' }}>
        <SectionTitle icon="solar:user-id-bold-duotone" title="Profile details" />

        <Stack sx={{ px: 2.5, py: 2, flex: 1 }} spacing={2}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              columnGap: 2,
              rowGap: 1.5,
            }}
          >
            <DetailField label="Name" value={kv.name} />
            <DetailField label="Email" value={kv.email} href={kv.email ? `mailto:${kv.email}` : ''} />
            <DetailField label="Phone" value={kv.phone} />
            <DetailField label="Language" value={languageValue} />
            <DetailField label="City" value={kv.city} />
            <DetailField label="User type" value={prettyText(kv.userType)} />
            <DetailField label="Portfolio" value={portfolioValue} />
            <DetailField label="Rating" value={ratingValue} />
            <DetailField label="Signed up" value={kv.signup} />
            <DetailField label="Timezone" value={kv.timezone} />
          </Box>

          <Box
            sx={(theme) => ({
              p: 1.5,
              borderRadius: 1.5,
              bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
              border: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
            })}
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Bio
            </Typography>
            <ValueText value={kv.Bio} multiline />
          </Box>

          <Stack spacing={0.75}>
            <Typography variant="subtitle2">Crafts</Typography>
            <ChipList items={crafts} align="flex-start" />
          </Stack>

          <Stack spacing={0.75}>
            <Typography variant="subtitle2">Badges</Typography>
            <ChipList items={badges} align="flex-start" />
          </Stack>
        </Stack>
      </Card>

      <Card sx={{ width: { xs: 1, md: '30%' }, display: 'flex', flexDirection: 'column' }}>
        <SectionTitle icon="solar:shield-check-bold-duotone" title="Account status" />

        <Stack sx={{ px: 2.5, py: 2, flex: 1 }} spacing={1.5}>
          <Stack
            spacing={1}
            sx={(theme) => ({
              p: 1.5,
              borderRadius: 1.5,
              bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            })}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              {kv.status ? (
                <Label variant="soft" color={statusOption?.color || 'default'}>
                  {statusOption?.label || prettyText(kv.status)}
                </Label>
              ) : (
                <EmptyValue />
              )}
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Onboarding
              </Typography>
              {onboardingValue ? (
                <Label variant="soft" color={verificationColor(onboardingValue)}>
                  {onboardingValue}
                </Label>
              ) : (
                <EmptyValue />
              )}
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2">Verification</Typography>
            <StatusLine
              icon="solar:letter-bold"
              label="Email"
              value={kv.emailVerification ? prettyText(kv.emailVerification) : ''}
              color={verificationColor(kv.emailVerification)}
            />
            <StatusLine
              icon="solar:phone-bold"
              label="Phone"
              value={kv.phoneVerification ? prettyText(kv.phoneVerification) : ''}
              color={verificationColor(kv.phoneVerification)}
            />
            <StatusLine
              icon="solar:lock-bold"
              label="Two-factor"
              value={twoFactorValue}
              color={kv.twoFactorAuth ? 'success' : 'default'}
            />
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack spacing={1}>
            <Typography variant="subtitle2">Links</Typography>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                Website
              </Typography>
              <ValueText value={kv.websiteUrl} href={kv.websiteUrl} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Social
              </Typography>
              {socialLinks.length ? (
                <Stack direction="row" spacing={0.75}>
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
                          border: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
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
            </Box>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
};

function SectionTitle({ icon, title }) {
  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2.5, py: 1.5 }}>
        <Iconify icon={icon} width={20} />
        <Typography variant="subtitle1">{title}</Typography>
      </Stack>
      <Divider />
    </>
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

function DetailField({ label, value, href }) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <ValueText value={value} href={href} />
    </Stack>
  );
}

function ChipList({ items = [], align = 'flex-end' }) {
  if (!items.length) return <EmptyValue />;

  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap justifyContent={align}>
      {items.map((item) => (
        <Label key={item._id || item.name} variant="soft" color="primary">
          {item.name}
        </Label>
      ))}
    </Stack>
  );
}

function StatusLine({ icon, label, value, color }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Iconify icon={icon} width={16} sx={{ color: 'text.secondary' }} />
        <Typography variant="body2">{label}</Typography>
      </Stack>
      {value ? (
        <Label variant="soft" color={color || 'default'}>
          {value}
        </Label>
      ) : (
        <EmptyValue />
      )}
    </Stack>
  );
}

export default ProfileTab;
