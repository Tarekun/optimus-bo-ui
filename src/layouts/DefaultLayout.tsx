import { Box } from '@mui/material';
import { orange } from '@mui/material/colors';
import { useEffect } from 'react';
import { usePaletteMode } from '../contexts/PaletteModeContext';
import Navbar from '../core/Navbar';
import { ChildrenType } from '../core/types';

interface DefaultLayoutProps {
  children?: ChildrenType;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const { mode } = usePaletteMode();

  useEffect(() => {
    document.getElementsByTagName('body')[0].style.backgroundColor = mode === 'light' ? orange[100] : '#240901';
  }, [mode]);

  return (
    <div
      style={{
        backgroundColor: mode === 'light' ? orange[100] : '#240901',
        minHeight: '100vh',
      }}
    >
      <Navbar />
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
