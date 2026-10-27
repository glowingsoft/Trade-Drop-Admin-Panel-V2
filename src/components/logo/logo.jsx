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
  ({ width = 40, height = 40, disableLink = false, className, href, color = '#B8923D', sx, ...other }, ref) => {
    const theme = useTheme();
    const user = useSelector(selectUser);
    const logoHref = href ?? (user ? getAuthenticatedHref(user.permission) : '/');
    const logo =
      theme.palette.mode === 'dark' ? (
        <Box
          alt="logo"
          component="img"
          src={darkModeLogo}
          sx={{ width: 1, height: 1, objectFit: 'contain' }}
        />
      ) : (
        <Box
          role="img"
          aria-label="TradeDrop"
          sx={{
            width: 1,
            height: 1,
            bgcolor: color,
            WebkitMaskImage: `url(${lightModeLogo})`,
            maskImage: `url(${lightModeLogo})`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
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
