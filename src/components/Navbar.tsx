import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthentication } from '../contexts/AuthenticationContext';
import { useDeviceFeatures } from '../hooks';

export interface PageLink {
  label: string;
  url: string;
  icon?: ReactNode;
}

interface PageLinkBuilderProps {
  links: PageLink[];
}

const DRAWER_WIDTH = 360;

function shouldHighlight(url: string, pathname: string) {
  const isHome = url === '/' || url === '';
  // la logica è statsWith per funzionare "ad albero"
  // nel caso della home si test l'uguaglianza perché tutti i percorsi iniziano con '/'
  return isHome ? url === pathname : pathname.startsWith(url);
}

function PageLinkNavbar({ links }: PageLinkBuilderProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Stack direction="row" spacing={2} color="inherit">
      {links.map((link) => (
        <Button
          key={link.url}
          //senza questo il bottone non si renderizza
          color="inherit"
          onClick={() => navigate(link.url)}
          size={shouldHighlight(link.url, pathname) ? 'large' : 'medium'}
          sx={{
            fontWeight: shouldHighlight(link.url, pathname) ? 'bold' : '',
          }}
        >
          {link.label}
        </Button>
      ))}
    </Stack>
  );
}

function PageLinkDrawer({ links, onCloseDrawer }: PageLinkBuilderProps & { onCloseDrawer: () => void }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <List>
      {links.map((link) => (
        <ListItemButton
          key={link.url}
          //use this variant prop to highlight the current page
          selected={shouldHighlight(link.url, pathname)}
          onClick={() => {
            navigate(link.url);
            onCloseDrawer();
          }}
        >
          <ListItemIcon>{link.icon}</ListItemIcon>
          {link.label}
        </ListItemButton>
      ))}
    </List>
  );
}

export type NavbarStyling = 'solid' | 'transparent';

export interface NavbarProps {
  links?: PageLink[];
  sudoLinks?: PageLink[];
  navbarStyling?: NavbarStyling;
  navbarPosition?: 'fixed' | 'static' | 'absolute' | 'sticky' | 'relative' | undefined;
  navbarColorCode?: string;
  trailingButtons?: ReactNode;
  header?: ReactNode;
}
export default function Navbar({
  links = [],
  sudoLinks = [],
  navbarStyling = 'transparent',
  navbarPosition = 'fixed',
  navbarColorCode,
  trailingButtons = null,
  header,
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
          {header}
          {isMobile ? (
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

                <PageLinkDrawer links={actualLinks} onCloseDrawer={() => setOpenDrawer(false)} />
              </Drawer>
            </>
          ) : (
            <PageLinkNavbar links={actualLinks} />
          )}

          {/*box che occupa tutto lo spazio possibile per forzare i bottoni seguenti ad essere sulla destra */}
          <Box flexGrow={1} />
          {trailingButtons}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
