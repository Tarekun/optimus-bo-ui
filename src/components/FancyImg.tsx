import { Box, Paper } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const borderRadius = 5;
const maxOffset = 16;

export interface FancyImgProps {
  src: string;
  alt?: string;
  showBackground?: boolean;
  backgroundColor?: string;
}
export default function FancyImg({
  src,
  alt = '',
  showBackground = true,
  backgroundColor = 'primary.main',
}: FancyImgProps) {
  const [offset, setOffset] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    if (imageRef.current !== null) {
      const imgBox = imageRef.current.getBoundingClientRect();
      const distTopCenter = imgBox.top + (imgBox.bottom - imgBox.top) / 2;
      const viewportHeight = window.innerHeight;

      //squash the distance in [-1,1]
      const normalizedDistance = (distTopCenter / viewportHeight) * 2 - 1;

      const newOffset = normalizedDistance * maxOffset;
      setOffset(newOffset);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box sx={{ padding: 5 }}>
      <Box sx={{ width: 'fit-content', position: 'relative', height: 'fit-content' }}>
        <Paper elevation={24} sx={{ borderRadius: borderRadius }}>
          <Box
            component="img"
            src={src}
            alt={alt}
            ref={imageRef}
            sx={{
              position: 'relative',
              // avoids the Paper container rendering some margin/padding
              display: 'block',
              width: '100%',
              height: 'auto',
              borderRadius: borderRadius,
              zIndex: 1,
            }}
          />
        </Paper>

        {showBackground && (
          <Paper
            elevation={0}
            sx={{
              position: 'absolute',
              top: offset,
              left: 16,
              backgroundColor: backgroundColor,
              width: '100%',
              height: '100%',
              borderRadius: borderRadius,
              zIndex: 0,
            }}
          />
        )}
      </Box>
    </Box>
  );
}
