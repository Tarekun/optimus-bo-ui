import { Box, useTheme } from '@mui/material';
import { PropsWithChildren, useEffect } from 'react';
import Navbar, { NavbarProps } from '../components/Navbar';
import { usePaletteMode } from '../contexts/PaletteModeContext';

export type DefaultLayoutProps = PropsWithChildren & {
  navbarConfig?: NavbarProps;
};
export default function DefaultLayout({ children, navbarConfig = {} }: DefaultLayoutProps) {
  const { links = [], sudoLinks = [] } = navbarConfig;
  const { mode } = usePaletteMode();
  const theme = useTheme();
  const background = theme.palette.background.default;

  useEffect(() => {
    document.getElementsByTagName('body')[0].style.background = background;
  }, [mode, background]);

  return (
    <div
      style={{
        background: background,
        minHeight: '100vh',
      }}
    >
      <Navbar links={links} sudoLinks={sudoLinks} {...navbarConfig} />
      <Box
        sx={{
          padding: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {children}
      </Box>
    </div>
  );
}
