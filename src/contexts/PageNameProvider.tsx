import { PropsWithChildren, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type PageNameProviderProps = PropsWithChildren & {
  pageTitleForPath: (pathname: string) => string;
};
export default function PageNameProvider({ children, pageTitleForPath }: PageNameProviderProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = pageTitleForPath(pathname);
  }, [pathname]);

  return <>{children}</>;
}
