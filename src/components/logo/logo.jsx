import { forwardRef } from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import NoSsr from '@mui/material/NoSsr';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { selectUser } from 'src/store/slices/userSlice';
import darkModeLogo from 'src/assets/logo/dark-mode-logo.png';
import lightModeLogo from 'src/assets/logo/light-mode-logo.png';

import { logoClasses } from './classes';

function getAuthenticatedHref(permission) {
  if (permission === 2) return paths.dashboard.root;
  return paths.adminDashboard.root;
}

export const Logo = forwardRef(
  ({ width = 40, height = 40, disableLink = false, className, href, sx, ...other }, ref) => {
    const theme = useTheme();
    const user = useSelector(selectUser);
    const logoHref = href ?? (user ? getAuthenticatedHref(user.permission) : '/');
    const logoSrc = theme.palette.mode === 'dark' ? darkModeLogo : lightModeLogo;

    const logo = (
      <Box
        alt="logo"
        component="img"
        src={logoSrc}
        width={width}
        height={height}
        sx={{ objectFit: 'contain' }}
      />
    );

    return (
      <NoSsr
        fallback={
          <Box
            width={width}
            height={height}
            className={logoClasses.root.concat(className ? ` ${className}` : '')}
            sx={{
              flexShrink: 0,
              display: 'inline-flex',
              verticalAlign: 'middle',
              ...sx,
            }}
          />
        }
      >
        <Box
          ref={ref}
          component={RouterLink}
          href={logoHref}
          width={width}
          height={height}
          className={logoClasses.root.concat(className ? ` ${className}` : '')}
          aria-label="logo"
          sx={{
            flexShrink: 0,
            display: 'inline-flex',
            verticalAlign: 'middle',
            ...(disableLink && { pointerEvents: 'none' }),
            ...sx,
          }}
          {...other}
        >
          {logo}
        </Box>
      </NoSsr>
    );
  }
);
