import { Alert, AlertColor, Snackbar } from '@mui/material';
import { useState } from 'react';

interface ToastProps {
  open: boolean;
  onClose: () => void;
  text: string;
  severity?: AlertColor;
  autoHideDuration?: number;
}
export default function Toast({ open, onClose, text, severity, autoHideDuration }: ToastProps) {
  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {text}
      </Alert>
    </Snackbar>
  );
}

export type UseToastConfig = {
  text?: string;
  severity?: AlertColor;
  autoHideDuration?: number;
};
export function useToast(config: UseToastConfig) {
  const { text: defaultText = '', severity: defaultSeverity, autoHideDuration: defaultAutoHideDuration } = config;

  const [open, setOpen] = useState(false);
  const [text, setText] = useState(defaultText);
  const [severity, setSeverity] = useState(defaultSeverity);
  const [autoHideDuration, setAutoHideDuration] = useState(defaultAutoHideDuration);

  function showToast(config: UseToastConfig) {
    const { text, severity, autoHideDuration } = config;
    if (text !== undefined) {
      setText(text);
    }
    if (severity !== undefined) {
      setSeverity(severity);
    }
    if (autoHideDuration !== undefined) {
      setAutoHideDuration(autoHideDuration);
    }

    setOpen(true);
  }

  const Component = (
    <Toast
      text={text}
      open={open}
      onClose={() => setOpen(false)}
      severity={severity}
      autoHideDuration={autoHideDuration}
    />
  );

  return { Component, showToast: showToast };
}
