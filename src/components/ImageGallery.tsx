import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, BoxProps, Paper } from '@mui/material';
import { useState } from 'react';

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

  function updateImage(newIndex: number) {
    setImgIndex(newIndex);
    onIndexUpdate(imgIndex);
  }
  function nextImage() {
    updateImage((imgIndex + 1) % imgSourcesList.length);
  }
  function previousImage() {
    updateImage((imgSourcesList.length + imgIndex - 1) % imgSourcesList.length);
  }

  const transformX = -imgIndex * (100 / imgSourcesList.length); // Each image takes 100% of the width

  return (
    <Paper
      elevation={8}
      sx={{ position: 'relative', display: 'inline-block', overflow: 'hidden', borderRadius: borderRadius }}
    >
      {imgSourcesList.length > 1 && (
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
      )}

      <Box
        sx={{
          display: 'flex',
          transition: 'transform 0.5s ease',
          transform: `translateX(${transformX}%)`,
          width: `${100 * imgSourcesList.length}%`,
        }}
      >
        {imgSourcesList.map((src, index) => (
          <Box
            key={index}
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              key={index}
              component="img"
              src={src || missingImagesUrl}
              sx={{
                borderRadius: borderRadius,
                display: 'block',
                width: '100%',
                height: 'auto',
                ...imgSxOverrides,
              }}
              {...imgPropsRest}
            />
          </Box>
        ))}
      </Box>

      {imgSourcesList.length > 1 && (
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
      )}
    </Paper>
  );
}
