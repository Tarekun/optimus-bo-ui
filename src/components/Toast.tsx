import { Alert, AlertColor, Snackbar } from '@mui/material';
import { useState } from 'react';

interface ToastProps {
  open: boolean;
  onClose: () => void;
  text: string;
  severity?: AlertColor;
  autoHideDuration?: number;
}
export default function Toast({ open, onClose, text, severity, autoHideDuration = 6000 }: ToastProps) {
  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {text}
      </Alert>
    </Snackbar>
  );
}

export function useToast(config: { text: string; severity?: AlertColor; autoHideDuration?: number }) {
  const { text, severity, autoHideDuration } = config;
  const [open, setOpen] = useState(false);

  const Component = (
    <Toast
      text={text}
      open={open}
      onClose={() => setOpen(false)}
      severity={severity}
      autoHideDuration={autoHideDuration}
    />
  );

  return { Component, showToast: () => setOpen(true) };
}
