import { PropsWithChildren, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageTitleForPath } from '../core/routes';

export default function PageNameProvider({ children }: PropsWithChildren) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = pageTitleForPath(pathname);
  }, [pathname]);

  return <>{children}</>;
}
