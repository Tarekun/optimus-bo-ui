import { Box } from '@mui/material';
import { PropsWithChildren, useEffect } from 'react';
import Navbar, { NavbarProps } from '../components/Navbar';
import { usePaletteMode } from '../contexts/PaletteModeContext';

export type DefaultLayoutProps = PropsWithChildren & NavbarProps;
export default function DefaultLayout({ children, links, sudoLinks }: DefaultLayoutProps) {
  const { mode } = usePaletteMode();

  useEffect(() => {
    // document.getElementsByTagName('body')[0].style.backgroundColor = mode === 'light' ? orange[100] : '#240901';
  }, [mode]);

  return (
    <div
      style={{
        // backgroundColor: mode === 'light' ? orange[100] : '#240901',
        minHeight: '100vh',
      }}
    >
      <Navbar links={links} sudoLinks={sudoLinks} />
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
