import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const FEATURES = [
  { icon: 'solar:chart-2-bold', label: 'Live trade tracking' },
  { icon: 'solar:user-check-bold', label: 'User verification' },
  { icon: 'solar:clock-circle-bold', label: 'Always-on platform' },
];

export function Section({ sx, layoutQuery, ...other }) {
  const theme = useTheme();

  const primaryDark = theme.vars?.palette?.primary?.dark || theme.palette.primary.dark;
  const primaryMain = theme.vars?.palette?.primary?.main || theme.palette.primary.main;
  const primaryLight = theme.vars?.palette?.primary?.light || theme.palette.primary.light;

  return (
    <Box
      sx={{
        flex: '1 1 0',
        px: { md: 6, lg: 8 },
        py: { md: 6, lg: 8 },
        width: 1,
        maxWidth: 'none',
        display: 'none',
        position: 'relative',
        overflow: 'hidden',
        color: 'common.white',
        bgcolor: primaryMain,
        backgroundImage: `linear-gradient(${varAlpha(theme.vars.palette.common.whiteChannel, 0.16)}, ${varAlpha(theme.vars.palette.common.whiteChannel, 0.16)}), linear-gradient(145deg, ${primaryDark} 0%, ${primaryMain} 52%, ${primaryLight} 100%)`,
        [theme.breakpoints.up(layoutQuery)]: {
          flex: '0 0 50%',
          maxWidth: '50%',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        },
        ...sx,
      }}
      {...other}
    >
      <Box
        sx={{
          top: -120,
          left: -80,
          width: 520,
          height: 520,
          borderRadius: '50%',
          position: 'absolute',
          border: `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.18)}`,
        }}
      />

      <Box
        sx={{
          right: -180,
          bottom: -260,
          width: 820,
          height: 820,
          borderRadius: '50%',
          position: 'absolute',
          border: `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.12)}`,
        }}
      />

      <Box
        sx={{
          right: -120,
          bottom: -200,
          width: 680,
          height: 680,
          borderRadius: '50%',
          position: 'absolute',
          border: `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.1)}`,
        }}
      />

      <Box
        sx={{
          top: '50%',
          left: '50%',
          width: 720,
          height: 720,
          borderRadius: '50%',
          position: 'absolute',
          filter: 'blur(40px)',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${varAlpha(theme.vars.palette.common.whiteChannel, 0.16)} 0%, ${varAlpha(theme.vars.palette.common.whiteChannel, 0)} 70%)`,
        }}
      />

      <Box
        sx={{
          zIndex: 1,
          width: '66%',
          minWidth: { md: 390, lg: 450 },
          maxWidth: 650,
          borderRadius: 5,
          px: { md: 5, lg: 5 },
          py: { md: 5, lg: 5 },
          position: 'relative',
          border: `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.24)}`,
          bgcolor: varAlpha(theme.vars.palette.common.whiteChannel, 0.14),
          boxShadow: `0 24px 60px ${varAlpha(theme.vars.palette.common.blackChannel, 0.28)}`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            top: 0,
            left: 0,
            right: 0,
            height: '45%',
            position: 'absolute',
            pointerEvents: 'none',
            background: `linear-gradient(180deg, ${varAlpha(theme.vars.palette.common.whiteChannel, 0.1)} 0%, ${varAlpha(theme.vars.palette.common.whiteChannel, 0)} 100%)`,
          }}
        />

        <Box
          sx={{
            zIndex: 1,
            position: 'relative',
            textShadow: `0 2px 16px ${varAlpha(theme.vars.palette.common.blackChannel, 0.22)}`,
          }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                flexShrink: 0,
                borderRadius: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.28)}`,
                bgcolor: varAlpha(theme.vars.palette.common.whiteChannel, 0.16),
              }}
            >
              <Iconify icon="solar:shield-star-bold" width={17} />
            </Box>

            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: varAlpha(theme.vars.palette.common.whiteChannel, 0.96),
              }}
            >
              Admin Console
            </Typography>
          </Stack>

          <Typography
            variant="h2"
            sx={{
              lineHeight: 1.08,
              fontWeight: 800,
              fontSize: { md: '3.1rem', lg: '2.4rem' },
            }}
          >
            Welcome back, admin.
          </Typography>

          <Typography
            sx={{
              mt: 2,
              fontSize: '1.4rem',
              fontWeight: 600,
              lineHeight: 1.2,
              color: varAlpha(theme.vars.palette.common.whiteChannel, 1),
            }}
          >
            {`Command center for ${CONFIG.site.name}`}
          </Typography>

          <Stack spacing={1.75} sx={{ mt: 4 }}>
            {FEATURES.map((feature) => (
              <Stack key={feature.label} direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    flexShrink: 0,
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: varAlpha(theme.vars.palette.common.whiteChannel, 0.14),
                  }}
                >
                  <Iconify icon={feature.icon} width={16} />
                </Box>

                <Typography
                  sx={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: varAlpha(theme.vars.palette.common.whiteChannel, 1),
                  }}
                >
                  {feature.label}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
            sx={{
              mt: 4,
              py: 0.75,
              px: 1.5,
              width: 'fit-content',
              borderRadius: 100,
              border: `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.2)}`,
              bgcolor: varAlpha(theme.vars.palette.common.whiteChannel, 0.08),
            }}
          >
            <Iconify
              icon="solar:lock-keyhole-bold"
              width={14}
              sx={{ color: varAlpha(theme.vars.palette.common.whiteChannel, 0.94) }}
            />
            <Typography
              sx={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: varAlpha(theme.vars.palette.common.whiteChannel, 0.94),
              }}
            >
              Restricted access — authorized personnel only
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Typography
        sx={{
          zIndex: 1,
          mt: 3,
          fontSize: '0.875rem',
          fontWeight: 500,
          color: varAlpha(theme.vars.palette.common.whiteChannel, 0.74),
          textShadow: `0 1px 8px ${varAlpha(theme.vars.palette.common.blackChannel, 0.18)}`,
        }}
      >
        {`© ${new Date().getFullYear()} ${CONFIG.site.name}. All rights reserved.`}
      </Typography>
    </Box>
  );
}
