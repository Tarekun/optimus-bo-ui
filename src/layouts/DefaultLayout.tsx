import { Box } from '@mui/material';
import { orange } from '@mui/material/colors';
import { PropsWithChildren, useEffect } from 'react';
import { usePaletteMode } from '../contexts/PaletteModeContext';
import Navbar from '../components/Navbar';

export default function DefaultLayout({ children }: PropsWithChildren) {
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
