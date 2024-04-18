import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { useState } from 'react';

interface PasswordFieldProps {
  textfieldProps: TextFieldProps;
}
export default function PasswordField({ textfieldProps }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      label="Password"
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="mostra password" onClick={() => setShowPassword(!showPassword)} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...textfieldProps}
    />
  );
}
