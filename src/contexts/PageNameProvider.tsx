import { PropsWithChildren, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageNameProvider({ children }: PropsWithChildren) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = pageTitleForPath(pathname);
  }, [pathname]);

  return <>{children}</>;
}
