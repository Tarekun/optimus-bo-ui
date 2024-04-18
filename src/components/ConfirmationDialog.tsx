import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { PropsWithChildren, useEffect } from 'react';

type ConfirmationDialogProps = PropsWithChildren & {
  open: boolean;
  onClose: () => void;
  onConfirmation: () => void;
  title?: string;
  color?: 'inherit' | 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning';
};

export default function ConfirmationDialog({
  open,
  onClose,
  title = "Sei sicuro di voler completare quest'azione?",
  onConfirmation = () => {},
  color,
  children,
}: ConfirmationDialogProps) {
  function confirm() {
    onConfirmation();
    onClose();
  }

  useEffect(() => {
    const handleEnter = (event: KeyboardEvent) => {
      //il listener funziona sempre, anche se il dialog è chiuso
      //va confermato che è aperto se no un invio a caso triggera tutti i dialog nella pagina
      if (open && event.key === 'Enter') {
        confirm();
        event.stopPropagation();
        event.preventDefault();
      }
    };
    window.addEventListener('keydown', handleEnter);

    return () => {
      window.removeEventListener('keydown', handleEnter);
    };
  }, [onConfirmation]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>

      <DialogActions>
        <Button color={color} variant="contained" onClick={confirm}>
          Conferma
        </Button>
        <Button onClick={onClose}>Annulla</Button>
      </DialogActions>
    </Dialog>
  );
}
