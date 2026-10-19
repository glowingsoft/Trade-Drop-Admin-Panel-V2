import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ProfileCover({ name, avatarUrl, city, trustScore }) {
  const theme = useTheme();

  const primaryDark = theme.vars?.palette?.primary?.dark || theme.palette.primary.dark;
  const primaryMain = theme.vars?.palette?.primary?.main || theme.palette.primary.main;
  const primaryLight = theme.vars?.palette?.primary?.light || theme.palette.primary.light;

  return (
    <Box
      sx={{
        height: 1,
        position: 'relative',
        overflow: 'hidden',
        color: 'common.white',
        bgcolor: primaryMain,
        backgroundImage: `linear-gradient(145deg, ${primaryDark} 0%, ${primaryMain} 55%, ${primaryLight} 100%)`,
      }}
    >
      <Box
        sx={{
          top: -100,
          left: -60,
          width: 320,
          height: 320,
          borderRadius: '50%',
          position: 'absolute',
          border: `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.16)}`,
        }}
      />

      <Box
        sx={{
          right: -140,
          bottom: -170,
          width: 440,
          height: 440,
          borderRadius: '50%',
          position: 'absolute',
          border: `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.12)}`,
        }}
      />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ md: 'center' }}
        sx={{
          left: { md: 24 },
          bottom: { md: 40 },
          zIndex: 10,
          pt: { xs: 6, md: 0 },
          position: { md: 'absolute' },
        }}
      >
        <Avatar
          alt={name}
          src={avatarUrl}
          sx={{
            mx: 'auto',
            width: { xs: 64, md: 128 },
            height: { xs: 64, md: 128 },
            border: `solid 3px ${varAlpha(theme.vars.palette.common.whiteChannel, 0.8)}`,
            boxShadow: `0 8px 24px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
            fontSize: { xs: 24, md: 40 },
          }}
        >
          {name?.charAt(0).toUpperCase()}
        </Avatar>

        <Box sx={{ mt: 3, ml: { md: 3 }, textAlign: { xs: 'center', md: 'unset' } }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {name}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent={{ xs: 'center', md: 'flex-start' }}
            sx={{ mt: 1 }}
          >
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ opacity: 0.86 }}>
              <Iconify icon="solar:map-point-bold" width={16} />
              <Typography variant="body2">{city || '—'}</Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{
                py: 0.25,
                px: 1,
                borderRadius: 100,
                bgcolor: varAlpha(theme.vars.palette.common.whiteChannel, 0.16),
                border: `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.24)}`,
              }}
            >
              <Iconify icon="solar:shield-star-bold" width={14} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {`Trust score ${trustScore || '—'}`}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
