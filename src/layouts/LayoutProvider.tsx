import { PropsWithChildren } from 'react';
import { NavbarProps } from '../components/Navbar';
import DefaultLayout from './DefaultLayout';

type LayoutProviderProps = PropsWithChildren & NavbarProps;
export default function LayoutProvider({ children, links, sudoLinks }: LayoutProviderProps) {
  return (
    <DefaultLayout links={links} sudoLinks={sudoLinks}>
      {children}
    </DefaultLayout>
  );
}
