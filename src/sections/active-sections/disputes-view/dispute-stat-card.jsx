import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { varAlpha } from 'src/theme/styles';

export function DisputeStatCard({ title, value, color = 'primary', icon }) {
  const theme = useTheme();
  const palette = theme.vars.palette[color] || theme.vars.palette.primary;

  return (
    <Card
      sx={{
        px: 2,
        py: 1.5,
        overflow: 'hidden',
        position: 'relative',
        background: `linear-gradient(135deg, ${varAlpha(palette.mainChannel, 0.16)} 0%, ${varAlpha(palette.darkChannel, 0.04)} 100%)`,
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
          <Iconify icon={icon} width={20} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5">{value}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {title}
          </Typography>
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
