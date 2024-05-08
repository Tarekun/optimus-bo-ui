import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, BoxProps, Paper } from '@mui/material';
import { useEffect, useState } from 'react';

const fadeDurationMs = 500;
const fadeDurationS = 0.5;
const buttonsWidth = 75;
const missingImagesUrl =
  'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fvectors%2Fno-image-available-sign-vector-id1138179183%3Fk%3D6%26m%3D1138179183%26s%3D612x612%26w%3D0%26h%3DprMYPP9mLRNpTp3XIykjeJJ8oCZRhb2iez6vKs8a8eE%3D&f=1&nofb=1&ipt=fa5858195f77a712c882ee2f91427ddfcc7f7e3da765205ed3120aba5e250977&ipo=images';
const defaultBorderRadius = 1;

interface ImageGalleryProps {
  imgSourcesList: string[];
  onIndexUpdate?: (newIndex: number) => void;
  imgBoxProps?: BoxProps;
  borderRadius?: number;
}

export default function ImageGallery({
  imgSourcesList,
  onIndexUpdate = () => {},
  imgBoxProps = {},
  borderRadius = defaultBorderRadius,
}: ImageGalleryProps) {
  const { sx: imgSxOverrides = {}, ...imgPropsRest } = imgBoxProps;

  const [imgIndex, setImgIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  function updateImage(newIndex: number) {
    setOpacity(0);
    setTimeout(() => {
      setImgIndex(newIndex);
      setOpacity(1);
    }, fadeDurationMs);
  }
  function nextImage() {
    updateImage((imgIndex + 1) % imgSourcesList.length);
  }
  function previousImage() {
    updateImage((imgSourcesList.length + imgIndex - 1) % imgSourcesList.length);
  }

  useEffect(() => onIndexUpdate(imgIndex), [imgIndex]);

  return (
    <Paper
      elevation={8}
      sx={{ position: 'relative', display: 'inline-block', overflow: 'hidden', borderRadius: borderRadius }}
    >
      <Box
        onClick={previousImage}
        sx={{
          borderRadius: borderRadius,
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: buttonsWidth,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1,
          left: 0,
          ':hover': {
            backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.5), transparent)',
          },
        }}
      >
        <ArrowBackIosIcon sx={{ color: 'white' }} />
      </Box>

      <Box
        component="img"
        sx={{
          borderRadius: borderRadius,
          display: 'block',
          maxWidth: '100%',
          maxHeight: '100vh',
          height: 'auto',
          width: 'auto',
          opacity: opacity,
          transition: `opacity ${fadeDurationS}s ease`,
          ...imgSxOverrides,
        }}
        src={imgSourcesList[imgIndex] || missingImagesUrl}
        {...imgPropsRest}
      />

      <Box
        onClick={nextImage}
        sx={{
          borderRadius: borderRadius,
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: buttonsWidth,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1,
          right: 0,
          ':hover': {
            backgroundImage: 'linear-gradient(to left, rgba(0, 0, 0, 0.5), transparent)',
          },
        }}
      >
        <ArrowForwardIosIcon sx={{ color: 'white' }} />
      </Box>
    </Paper>
  );
}
