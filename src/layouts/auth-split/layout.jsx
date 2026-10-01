import { useBoolean } from 'src/hooks/use-boolean';

import { CONFIG } from 'src/config-global';

import { Section } from './section';
import { Main, Content } from './main';
import { HeaderBase } from '../core/header-base';
import { LayoutSection } from '../core/layout-section';

// ----------------------------------------------------------------------

export function AuthSplitLayout({ sx, section, children }) {
  const mobileNavOpen = useBoolean();

  const layoutQuery = 'md';

  return (
    <LayoutSection
      headerSection={
        /** **************************************
         * Header
         *************************************** */
        <HeaderBase
          disableElevation
          layoutQuery={layoutQuery}
          onOpenNav={mobileNavOpen.onTrue}
          slotsDisplay={{
            signIn: false,
            account: false,
            purchase: false,
            contacts: false,
            searchbar: false,
            workspaces: false,
            menuButton: false,
            localization: false,
            notifications: false,
          }}
          slotProps={{ container: { maxWidth: false } }}
          sx={{
            position: { [layoutQuery]: 'fixed' },
            bgcolor: 'transparent',
            '&::before': { display: 'none' },
          }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      sx={sx}
      cssVars={{
        '--layout-auth-content-width': '420px',
      }}
    >
      <Main layoutQuery={layoutQuery}>
        <Section layoutQuery={layoutQuery} />
        <Content layoutQuery={layoutQuery}>{children}</Content>
      </Main>
    </LayoutSection>
  );
}
