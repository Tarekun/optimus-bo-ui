import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Divider, Drawer, IconButton, Stack, Toolbar, Typography, useTheme } from '@mui/material';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useAuthentication } from '../contexts/AuthenticationContext';
import { useDeviceFeatures } from '../hooks';
import { DRAWER_WIDTH, NavbarStyling, PageLink } from './commons/navbar';
import PageLinksDrawer from './subComponents/PageLinksDrawer';
import PageLinksNavbar from './subComponents/PageLinksNavbar';

export interface NavbarProps {
  links?: PageLink[];
  sudoLinks?: PageLink[];
  navbarStyling?: NavbarStyling;
  navbarPosition?: 'fixed' | 'static' | 'absolute' | 'sticky' | 'relative' | undefined;
  navbarColorCode?: string;
  trailingButtons?: ReactNode;
  header?: ReactNode;
  enableDrawer?: boolean;
}
export default function Navbar({
  links = [],
  sudoLinks = [],
  navbarStyling = 'transparent',
  navbarPosition = 'fixed',
  navbarColorCode,
  trailingButtons = null,
  header,
  enableDrawer = true,
}: NavbarProps) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);

  const { isMobile } = useDeviceFeatures();
  const { isSudo } = useAuthentication();
  const theme = useTheme();

  const actualLinks = isSudo ? [...links, ...sudoLinks] : links;
  const baseColor = navbarColorCode || theme.palette.primary.main;

  const appBarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (appBarRef.current?.clientHeight) {
      setNavbarHeight(appBarRef.current?.clientHeight);
    }
  }, [appBarRef.current?.clientHeight]);

  return (
    // this forces the navbar to take vertical space even with position="fixed"
    // and not have component be hid underneath it
    <Box sx={{ height: navbarHeight }}>
      <AppBar
        ref={appBarRef}
        position={navbarPosition}
        color="primary"
        enableColorOnDark
        sx={{
          backgroundColor:
            // 6D is more or less 40% transparency
            navbarStyling === 'transparent' ? `${baseColor}6D` : baseColor,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar>
          {isMobile ? (
            enableDrawer && (
              <>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="Open side menu"
                  sx={{ mr: 2 }}
                  onClick={() => setOpenDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>

                <Drawer
                  anchor="left"
                  open={openDrawer}
                  onClose={() => setOpenDrawer(false)}
                  ModalProps={{
                    keepMounted: true,
                  }}
                  sx={{
                    '& .MuiDrawer-paper': {
                      boxSizing: 'border-box',
                      width: DRAWER_WIDTH,
                    },
                  }}
                >
                  <Stack direction="row" sx={{ width: '100%', padding: 2 }}>
                    <Typography
                      sx={{ flexGrow: 1 }}
                      align="center"
                      display="flex"
                      alignContent="center"
                      alignItems="center"
                    >
                      Menu
                    </Typography>
                    <IconButton color="inherit" onClick={() => setOpenDrawer(false)}>
                      <CloseIcon />
                    </IconButton>
                  </Stack>
                  <Divider />

                  <PageLinksDrawer links={actualLinks} onCloseDrawer={() => setOpenDrawer(false)} />
                </Drawer>

                {header}
              </>
            )
          ) : (
            <PageLinksNavbar links={actualLinks} header={header} />
          )}

          {/*box che occupa tutto lo spazio possibile per forzare i bottoni seguenti ad essere sulla destra */}
          <Box flexGrow={1} />
          {trailingButtons}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
