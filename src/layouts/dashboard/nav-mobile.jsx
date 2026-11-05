import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';

import { Logo } from 'src/components/logo';
import { NavSectionVertical } from 'src/components/nav-section';

// ----------------------------------------------------------------------

export function NavMobile({ data, open, onClose, slots, sx, ...other }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 2.5, pb: 1, flexShrink: 0 }}>
          <Logo />
        </Box>
      )}

      <Box
        sx={{
          flex: '1 1 auto',
          minHeight: 0,
          overflowX: 'hidden',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
        }}
        onWheel={(event) => event.stopPropagation()}
      >
        <NavSectionVertical data={data} sx={{ px: 2, pb: 2 }} {...other} />
      </Box>

      {slots?.bottomArea}
    </Drawer>
  );
}
