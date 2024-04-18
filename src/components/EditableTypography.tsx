import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, InputAdornment, TextField, TextFieldProps, Typography, TypographyProps } from '@mui/material';
import { PropsWithChildren, useState } from 'react';

type EditableTypographyProps = PropsWithChildren & {
  typographyProps?: TypographyProps;
  textFieldProps?: TextFieldProps;
  isDirty?: boolean;
  canEdit?: boolean;
  title?: string;
  defaultValue?: string;
};

export default function EditableTypography({
  children,
  typographyProps = {},
  textFieldProps = {},
  isDirty = false,
  canEdit = true,
  title = undefined,
  defaultValue,
}: EditableTypographyProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [hover, setHover] = useState(false);

  const handleEdit = () => {
    if (!isEditing && canEdit) {
      setIsEditing(true);
    }
  };
  const textDecoration = isDirty ? 'underline' : '';

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center' }}
      onMouseEnter={() => setHover(canEdit && true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleEdit}
    >
      {!isEditing ? (
        <>
          {title && (
            <Typography fontWeight="bold" marginRight={1}>
              {title}:
            </Typography>
          )}
          <Typography {...typographyProps} sx={{ textDecoration: textDecoration }}>
            {defaultValue ?? children}
          </Typography>
          {hover && (
            <IconButton onClick={handleEdit} size="small">
              <EditIcon fontSize="inherit" />
            </IconButton>
          )}
        </>
      ) : (
        <TextField
          label={title}
          value={children}
          autoFocus
          size="small"
          {...textFieldProps}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setIsEditing(false)}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              '& input': {
                textDecoration: textDecoration,
              },
            },
          }}
        />
      )}
    </Box>
  );
}
