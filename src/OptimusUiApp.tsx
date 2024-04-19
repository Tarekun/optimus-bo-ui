import { CssBaseline, PaletteMode, ThemeOptions, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { PageLink } from './components/Navbar';
import AuthenticationProvider from './contexts/AuthenticationContext';
import PageNameProvider from './contexts/PageNameProvider';
import PaletteModeProvider from './contexts/PaletteModeContext';
import LayoutProvider, { SupportedLayouts } from './layouts/LayoutProvider';

const queryClient = new QueryClient();

type YesMuiConfiguration = {
  configure: true;
  makeTheme?: (paletteMode: PaletteMode) => ThemeOptions;
  paletteMode?: undefined;
};
type NoMuiConfiguration = {
  configure: false;
  makeTheme?: undefined;
  paletteMode?: undefined;
};
type MuiConfiguration = YesMuiConfiguration | NoMuiConfiguration;

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
    configureReactQuery?: boolean;
    navbarLinks?: PageLink[];
    sudoNavbarLinks?: PageLink[];
    layout?: SupportedLayouts;
    muiConfiguration?: MuiConfiguration;
  };
export default function OptimusUiApp<UserSchema>({
  children,
  muiConfiguration = { configure: false },
  configureReactQuery = false,
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
  const { configure: configureMui, makeTheme = () => ({}), paletteMode: userPalette } = muiConfiguration;

  const [paletteMode, setPaletteMode] = useState<PaletteMode>('light');
  const paletteInUse = userPalette || paletteMode;
  const themeOverrides: ThemeOptions = makeTheme(paletteInUse);
  const theme = createTheme({
    palette: {
      mode: paletteInUse,
      ...themeOverrides?.palette,
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

  let content = (
    <PaletteModeProvider setMode={setPaletteMode}>
      <LayoutProvider layout={layout} links={navbarLinks} sudoLinks={sudoNavbarLinks}>
        {children}
      </LayoutProvider>
    </PaletteModeProvider>
  );
  // since these are rendered right away are to be checked starting from the innermost to the outermost, NOT viceversa
  if (configureUsers) content = withUsers(content);
  if (configurePageTitles) content = withPageTitles(content);
  if (configureReactQuery) content = withReactQuery(content);
  if (configureMui) content = withMui(content);

  return <div>{content}</div>;
}
