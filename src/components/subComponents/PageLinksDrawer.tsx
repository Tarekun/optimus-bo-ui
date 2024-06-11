import { List, ListItemButton, ListItemIcon } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageLink, shouldHighlight } from '../commons/navbar';

interface PageLinksDrawerProps {
  links: PageLink[];
  onCloseDrawer: () => void;
}
export default function PageLinksDrawer({ links, onCloseDrawer }: PageLinksDrawerProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <List>
      {links.map((link) => (
        <ListItemButton
          key={link.url}
          //use this variant prop to highlight the current page
          selected={shouldHighlight(link.url, pathname)}
          onClick={() => {
            navigate(link.url);
            onCloseDrawer();
          }}
        >
          <ListItemIcon>{link.icon}</ListItemIcon>
          {link.label}
        </ListItemButton>
      ))}
    </List>
  );
}
