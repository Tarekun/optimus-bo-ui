import { PaletteMode, useTheme } from '@mui/material';
import { PropsWithChildren, createContext, useContext, useEffect } from 'react';

const paletteModeName = 'PALETTE-MODE';

type usePaletteModeReturn = {
  mode: PaletteMode;
  setMode: (newMode: PaletteMode) => void;
  swapMode: () => void;
};
const PaletteModeContext = createContext<usePaletteModeReturn>({
  mode: 'light',
  setMode: () => {},
  swapMode: () => {},
});

type PaletteModeProviderProps = PropsWithChildren & {
  setMode: (newMode: PaletteMode) => void;
};
export default function PaletteModeProvider({ children, setMode }: PaletteModeProviderProps) {
  const {
    palette: { mode },
  } = useTheme();

  useEffect(() => {
    const storedMode = localStorage.getItem(paletteModeName);
    if (storedMode === 'light' || storedMode === 'dark') {
      setMode(storedMode);
    } else {
      //TODO: controllare se c'è una preferenza a livello di browser
    }
  }, []);

  return (
    <PaletteModeContext.Provider
      value={{
        mode: mode,
        setMode: (newMode: PaletteMode) => {
          setMode(newMode);
          localStorage.setItem(paletteModeName, newMode);
        },
        swapMode: () => {
          const newMode = mode === 'light' ? 'dark' : 'light';
          setMode(newMode);
          localStorage.setItem(paletteModeName, newMode);
        },
      }}
    >
      {children}
    </PaletteModeContext.Provider>
  );
}

export const usePaletteMode = () => useContext(PaletteModeContext);
