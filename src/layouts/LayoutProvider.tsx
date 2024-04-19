import { PropsWithChildren } from 'react';
import { NavbarProps } from '../components/Navbar';
import DefaultLayout from './DefaultLayout';

export type SupportedLayouts = 'default';

export type LayoutProviderProps = PropsWithChildren &
  NavbarProps & {
    layout?: SupportedLayouts;
  };
export default function LayoutProvider({ children, links, sudoLinks, layout = 'default' }: LayoutProviderProps) {
  return (
    <DefaultLayout links={links} sudoLinks={sudoLinks}>
      {children}
    </DefaultLayout>
  );
}
