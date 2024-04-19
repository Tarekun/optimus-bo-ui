import { CssBaseline, PaletteMode, ThemeOptions, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { PageLink } from './components/Navbar';
import AuthenticationProvider from './contexts/AuthenticationContext';
import PageNameProvider from './contexts/PageNameProvider';
import PaletteModeProvider from './contexts/PaletteModeContext';
import LayoutProvider, { SupportedLayouts } from './layouts/LayoutProvider';

const queryClient = new QueryClient();

type YesUserConfiguration<UserSchema> = {
  configureUsers: true;
  fetchCurrentUser: () => Promise<UserSchema>;
  isSudo?: (user: UserSchema) => boolean;
};
type NoUserConfiguration = {
  configureUsers?: false;
  fetchCurrentUser?: undefined;
  isSudo?: undefined;
};
type UserConfiguration<UserSchema> = YesUserConfiguration<UserSchema> | NoUserConfiguration;

type YesPageTitleConfiguration = {
  configurePageTitles: true;
  pageTitleForPath: (pathname: string) => string;
};
type NoPageTitleConfiguration = {
  configurePageTitles?: false;
  pageTitleForPath?: undefined;
};
type PageTitleConfiguration = YesPageTitleConfiguration | NoPageTitleConfiguration;

export type OptimusUiAppConfig<UserSchema> = PageTitleConfiguration &
  UserConfiguration<UserSchema> & {
    configureMui?: boolean;
    configureReactQuery?: boolean;
    themeOverrides?: ThemeOptions;
    navbarLinks?: PageLink[];
    sudoNavbarLinks?: PageLink[];
    layout?: SupportedLayouts;
  };
export default function OptimusUiApp<UserSchema>({
  children,
  configureMui = false,
  configureReactQuery = false,
  themeOverrides,
  navbarLinks = [],
  sudoNavbarLinks = [],
  configurePageTitles = false,
  pageTitleForPath = () => '',
  configureUsers = false,
  fetchCurrentUser = () => {
    throw 'User functionality not configured: fetchCurrentUser prop not set on OptimusUiApp';
  },
  isSudo = () => false,
  layout = 'default',
}: PropsWithChildren & OptimusUiAppConfig<UserSchema>) {
  const [paletteMode, setPaletteMode] = useState<PaletteMode>('light');
  const theme = createTheme({
    palette: {
      mode: paletteMode,
    },
    ...themeOverrides,
  });

  const withMui = (children: ReactNode) => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
  const withReactQuery = (children: ReactNode) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const withPageTitles = (children: ReactNode) => (
    <PageNameProvider pageTitleForPath={pageTitleForPath}>{children}</PageNameProvider>
  );
  const withUsers = (children: ReactNode) => (
    <AuthenticationProvider fetchCurrentUser={fetchCurrentUser} isSudo={isSudo}>
      {children}
    </AuthenticationProvider>
  );
  let content = children;
  // since these are rendered right away are to be checked starting from the innermost to the outermost, NOT viceversa
  if (configureUsers) content = withUsers(content);
  if (configurePageTitles) content = withPageTitles(content);
  if (configureReactQuery) content = withReactQuery(content);
  if (configureMui) content = withMui(content);

  return (
    <PaletteModeProvider mode={paletteMode} setMode={setPaletteMode}>
      <LayoutProvider layout={layout} links={navbarLinks} sudoLinks={sudoNavbarLinks}>
        {content}
      </LayoutProvider>
    </PaletteModeProvider>
  );
}
