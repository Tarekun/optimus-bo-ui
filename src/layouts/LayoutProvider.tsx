import { PropsWithChildren } from 'react';
import { NavbarProps } from '../components/Navbar';
import DefaultLayout from './DefaultLayout';

export type SupportedLayouts = 'default' | 'no-layout';

export type DefaultLayoutConfig = {
  layoutType: 'default';
  navbarConfig?: NavbarProps;
};

export type NoLayoutConfig = {
  layoutType: 'no-layout';
};

export type LayoutConfig = DefaultLayoutConfig | NoLayoutConfig;

export type LayoutProviderProps = PropsWithChildren & LayoutConfig;

export default function LayoutProvider(props: LayoutProviderProps) {
  const { children, layoutType = 'default' } = props;

  switch (layoutType) {
    case 'default':
      const { navbarConfig = {} } = props as DefaultLayoutConfig;
      return <DefaultLayout navbarConfig={navbarConfig}>{children}</DefaultLayout>;

    case 'no-layout':
      return <>{children}</>;
  }
}
