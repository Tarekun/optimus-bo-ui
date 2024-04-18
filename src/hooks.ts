import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

function useDeviceFeatures() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const theme = useTheme();

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: useMediaQuery(theme.breakpoints.down('md')),
    widthPx: windowSize.width,
    heightPx: windowSize.height,
  };
}

function useDebounce(fun: () => void) {
  const [timeout, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  return function executedFunction() {
    const later = () => {
      clearTimeout(timeout as NodeJS.Timeout);
      fun();
    };

    clearTimeout(timeout as NodeJS.Timeout);
    setTimeoutId(setTimeout(later, 1000));
  };
}

export { useDebounce, useDeviceFeatures };
