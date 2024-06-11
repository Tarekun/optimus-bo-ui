import { CssBaseline, PaletteMode, ThemeOptions, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientConfig, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { PageLink } from './components/commons/navbar';
import AuthenticationProvider from './contexts/AuthenticationContext';
import LanguagePackProvider, { LanguagePackProviderProps, LocaleType } from './contexts/LanguagePackContext';
import PageNameProvider from './contexts/PageNameProvider';
import PaletteModeProvider from './contexts/PaletteModeContext';
import LayoutProvider, { LayoutConfig, SupportedLayouts } from './layouts/LayoutProvider';

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
  configure: true;
  fetchCurrentUser: () => Promise<UserSchema | null>;
  isSudo?: (user: UserSchema) => boolean;
};
type NoUserConfiguration = {
  configure: false;
  fetchCurrentUser?: undefined;
  isSudo?: undefined;
};
type UserConfiguration<UserSchema> = YesUserConfiguration<UserSchema> | NoUserConfiguration;

type YesPageTitleConfiguration = {
  configure: true;
  pageTitleForPath: (pathname: string) => string;
};
type NoPageTitleConfiguration = {
  configure: false;
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

type YesReactQueryConfiguration = {
  configure: true;
  queryClientConfig?: QueryClientConfig;
};
type NoReactQueryConfiguration = {
  configure: false;
};
type ReactQueryConfiguration = YesReactQueryConfiguration | NoReactQueryConfiguration;

export type OptimusUiAppConfig<UserSchema, LanguagePackSchema> = {
  reactQueryConfiguration?: ReactQueryConfiguration;
  navbarLinks?: PageLink[];
  sudoNavbarLinks?: PageLink[];
  layout?: SupportedLayouts;
  muiConfiguration?: MuiConfiguration;
  layoutConfiguration?: LayoutConfiguration;
  languagePackConfiguration?: LanguagePackConfiguration<LanguagePackSchema>;
  pageTitleConfiguration?: PageTitleConfiguration;
  userConfiguration?: UserConfiguration<UserSchema>;
};
export default function OptimusUiApp<UserSchema, LanguagePackSchema>({
  children,
  muiConfiguration = { configure: false },
  reactQueryConfiguration = { configure: false },
  layoutConfiguration = { configure: false },
  languagePackConfiguration = { configure: false },
  pageTitleConfiguration = { configure: false },
  userConfiguration = { configure: false },
}: PropsWithChildren & OptimusUiAppConfig<UserSchema, LanguagePackSchema>) {
  const { configure: configureMui, makeTheme = () => ({}), paletteMode: userPalette } = muiConfiguration;
  const { configure: configureLayout } = layoutConfiguration;
  const { configure: configureLanguagePack, ...langConfig } = languagePackConfiguration;
  const { configure: configurePageTitles, pageTitleForPath = () => '' } = pageTitleConfiguration;
  const { configure: configureReactQuery } = reactQueryConfiguration;
  const {
    configure: configureUsers,
    isSudo = () => false,
    fetchCurrentUser = () => {
      throw 'User functionality not configured: fetchCurrentUser prop not set on OptimusUiApp';
    },
  } = userConfiguration;

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
  // casting as at worst the arguments evaluates to undefined, which is accepted by QueryClient
  const queryClient = new QueryClient((reactQueryConfiguration as YesReactQueryConfiguration)?.queryClientConfig);

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

  return <div id="optimus-ui-application">{content}</div>;
}
