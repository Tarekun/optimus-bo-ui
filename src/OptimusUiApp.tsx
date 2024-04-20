import { CssBaseline, PaletteMode, ThemeOptions, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { PageLink } from './components/Navbar';
import AuthenticationProvider from './contexts/AuthenticationContext';
import LanguagePackProvider, { LanguagePackProviderProps, LocaleType } from './contexts/LanguagePackContext';
import PageNameProvider from './contexts/PageNameProvider';
import PaletteModeProvider from './contexts/PaletteModeContext';
import LayoutProvider, { LayoutConfig, SupportedLayouts } from './layouts/LayoutProvider';

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

type YesLayoutConfiguration = {
  configure: true;
  layoutConfig: LayoutConfig;
};
type NoLayoutConfiguration = {
  configure: false;
};
type LayoutConfiguration = YesLayoutConfiguration | NoLayoutConfiguration;

type YesLanguagePackConfiguration<LanguagePackSchema> = {
  configure: true;
  packs: Record<LocaleType, LanguagePackSchema>;
  defaultLocale: LocaleType;
};
type NoLanguagePackConfiguration = {
  configure: false;
};
type LanguagePackConfiguration<LanguagePackSchema> =
  | YesLanguagePackConfiguration<LanguagePackSchema>
  | NoLanguagePackConfiguration;

export type OptimusUiAppConfig<UserSchema, LanguagePackSchema> = PageTitleConfiguration &
  UserConfiguration<UserSchema> & {
    configureReactQuery?: boolean;
    navbarLinks?: PageLink[];
    sudoNavbarLinks?: PageLink[];
    layout?: SupportedLayouts;
    muiConfiguration?: MuiConfiguration;
    layoutConfiguration?: LayoutConfiguration;
    languagePackConfiguration?: LanguagePackConfiguration<LanguagePackSchema>;
  };
export default function OptimusUiApp<UserSchema, LanguagePackSchema>({
  children,
  muiConfiguration = { configure: false },
  layoutConfiguration = { configure: false },
  languagePackConfiguration = { configure: false },
  configureReactQuery = false,
  configurePageTitles = false,
  pageTitleForPath = () => '',
  configureUsers = false,
  fetchCurrentUser = () => {
    throw 'User functionality not configured: fetchCurrentUser prop not set on OptimusUiApp';
  },
  isSudo = () => false,
}: PropsWithChildren & OptimusUiAppConfig<UserSchema, LanguagePackSchema>) {
  const { configure: configureMui, makeTheme = () => ({}), paletteMode: userPalette } = muiConfiguration;
  const { configure: configureLayout } = layoutConfiguration;
  const { configure: configureLanguagePack, ...langConfig } = languagePackConfiguration;

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
  const withLanguagePack = (children: ReactNode) => (
    <LanguagePackProvider {...(langConfig as LanguagePackProviderProps<LanguagePackSchema>)}>
      {children}
    </LanguagePackProvider>
  );

  let content = (
    <PaletteModeProvider setMode={setPaletteMode}>
      {configureLayout ? (
        <LayoutProvider {...layoutConfiguration.layoutConfig}>{children}</LayoutProvider>
      ) : (
        <LayoutProvider layoutType="no-layout">{children}</LayoutProvider>
      )}
    </PaletteModeProvider>
  );
  // since these are rendered right away are to be checked starting from the innermost to the outermost, NOT viceversa
  if (configureLanguagePack) content = withLanguagePack(content);
  if (configureUsers) content = withUsers(content);
  if (configurePageTitles) content = withPageTitles(content);
  if (configureReactQuery) content = withReactQuery(content);
  if (configureMui) content = withMui(content);

  return <div>{content}</div>;
}
