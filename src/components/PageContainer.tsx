import { Box, LinearProgress, Paper, PaperProps } from '@mui/material';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthentication } from '../../contexts/AuthenticationContext';
import { ROUTES } from '../routes';

const dimensioneCardMassimaPx = 1300;

type PageContainerProps = PropsWithChildren & {
  isLoading?: boolean;
  checkSudo?: boolean;
  paperProps?: PaperProps;
};

export default function PageContainer({
  children,
  isLoading = false,
  checkSudo = false,
  paperProps = {},
}: PageContainerProps) {
  const { isSudo } = useAuthentication();
  const navigate = useNavigate();
  if (checkSudo && !isSudo) {
    navigate(ROUTES.home);
  }

  if (isLoading) {
    return <LinearProgress />;
  } else {
    return (
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Paper
          elevation={8}
          {...paperProps}
          sx={{ padding: 3, width: '100%', maxWidth: dimensioneCardMassimaPx, ...paperProps.sx }}
        >
          {children}
        </Paper>
      </Box>
    );
  }
}
