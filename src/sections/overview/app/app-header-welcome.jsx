import { useState } from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { DASHBOARD_RANGE_OPTIONS } from './map-dashboard-data';

export function AppHeaderWelcome({ range, onRangeChange, onRefresh, refreshing, sx, ...other }) {
  const { user } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);

  const name = user?.displayName || user?.basicInfo?.name || 'Admin';
  const selected = DASHBOARD_RANGE_OPTIONS.find((option) => option.value === range) || DASHBOARD_RANGE_OPTIONS[1];

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      spacing={2}
      sx={{ mb: { xs: 3, md: 4 }, ...sx }}
      {...other}
    >
      <Box>
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          {`Hello, ${name}!`}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Platform overview — check out the latest updates and statistics.
        </Typography>
      </Box>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={16} />}
        >
          {selected.label}
        </Button>

        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
          {DASHBOARD_RANGE_OPTIONS.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === range}
              onClick={() => {
                onRangeChange?.(option.value);
                setAnchorEl(null);
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>

        <IconButton onClick={onRefresh} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <Iconify
            icon="solar:refresh-bold"
            width={18}
            sx={{
              ...(refreshing && {
                animation: 'spin 0.6s linear',
                '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
              }),
            }}
          />
        </IconButton>
      </Stack>
    </Stack>
  );
}
