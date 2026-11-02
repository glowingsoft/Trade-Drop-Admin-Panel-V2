import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { varAlpha } from 'src/theme/styles';

export function EventStatCard({ title, value, helper, tone, selected, onClick, icon }) {
  const theme = useTheme();
  const isError = tone === 'error';
  const palette = isError
    ? theme.vars.palette.error
    : theme.vars.palette.primary;

  return (
    <Card
      onClick={onClick}
      sx={{
        px: 2,
        py: 1.5,
        height: 1,
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        transition: theme.transitions.create(['box-shadow', 'transform'], {
          duration: theme.transitions.duration.shorter,
        }),
        border: selected
          ? `1px solid ${varAlpha(palette.mainChannel, 0.28)}`
          : `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
        background: `linear-gradient(135deg, ${varAlpha(palette.mainChannel, selected ? 0.22 : 0.16)} 0%, ${varAlpha(palette.darkChannel, selected ? 0.08 : 0.04)} 100%)`,
        '&:hover': {
          boxShadow: theme.customShadows?.z8 || theme.shadows[4],
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
            color: palette.contrastText,
            background: `linear-gradient(135deg, ${palette.light} 0%, ${palette.main} 100%)`,
          }}
        >
          <Iconify icon={icon || 'solar:calendar-bold'} width={20} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" sx={{ color: selected && isError ? 'error.main' : 'text.primary' }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {title}
          </Typography>
          {helper ? (
            <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled' }} noWrap>
              {helper}
            </Typography>
          ) : null}
        </Box>
      </Stack>

      <Box
        sx={{
          top: -28,
          right: -32,
          width: 88,
          height: 88,
          opacity: 0.2,
          borderRadius: '50%',
          position: 'absolute',
          background: `linear-gradient(135deg, ${palette.main} 0%, ${varAlpha(palette.mainChannel, 0)} 100%)`,
        }}
      />
    </Card>
  );
}
