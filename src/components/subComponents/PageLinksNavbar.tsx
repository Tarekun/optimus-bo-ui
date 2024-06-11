import { Button, Stack } from '@mui/material';
import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageLink, shouldHighlight } from '../commons/navbar';

interface PageLinksNavbarProps {
  links: PageLink[];
  header?: ReactNode;
}
export default function PageLinksNavbar({ links, header }: PageLinksNavbarProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Stack direction="row" spacing={2} color="inherit">
      {header}

      {links.map((link) => (
        <Button
          key={link.url}
          href={link.url}
          //without this text wont be seeable
          color="inherit"
          onClick={(event) => {
            //to avoid rerendering the page because of the href click
            event.preventDefault();
            navigate(link.url);
          }}
          sx={{
            fontWeight: shouldHighlight(link.url, pathname) ? 'bold' : '',
          }}
        >
          {link.label}
        </Button>
      ))}
    </Stack>
  );
}
