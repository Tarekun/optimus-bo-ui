import { Box, Switch, Typography } from '@mui/material';

interface BetterSwitchProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}
export default function BetterSwitch({ label, checked, onChange }: BetterSwitchProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography fontWeight="bold">{label}:</Typography>
      <Switch color="primary" checked={checked} onChange={onChange} />
    </Box>
  );
}
