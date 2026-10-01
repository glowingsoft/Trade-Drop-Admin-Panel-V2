import { useEffect } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import lightModeLogo from 'src/assets/logo/light-mode-logo.png';

import { createTheme } from './create-theme';
import { RTL } from './with-settings/right-to-left';
import { schemeConfig } from './color-scheme-script';

export function ThemeProvider({ children }) {
  const { currentLang } = useTranslate();

  const settings = useSettingsContext();

  const theme = createTheme(currentLang?.systemValue, settings);

  useEffect(() => {
    let link = document.querySelector("link[rel='icon']");

    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    link.type = 'image/png';
    link.href = lightModeLogo;
  }, []);

  return (
    <CssVarsProvider
      theme={theme}
      defaultMode={schemeConfig.defaultMode}
      modeStorageKey={schemeConfig.modeStorageKey}
    >
      <CssBaseline />
      <RTL direction={settings.direction}>{children}</RTL>
    </CssVarsProvider>
  );
}
