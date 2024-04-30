import { PropsWithChildren, createContext, useContext, useState } from 'react';

export type LocaleType = string;
export type useLanguagePackReturn<LanguagePackSchema> = {
  languagePack: LanguagePackSchema;
  selectedLocale: LocaleType;
  configuredLocales: LocaleType[];
  switchLanguage: (locale: LocaleType) => void;
  isConfigured: boolean;
};

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const LanguagePackContext = createContext<useLanguagePackReturn<any>>({
  languagePack: null,
  selectedLocale: '',
  configuredLocales: [],
  switchLanguage: () => {},
  isConfigured: false,
});

export type LanguagePackProviderProps<LanguagePackSchema> = PropsWithChildren & {
  packs: Record<LocaleType, LanguagePackSchema>;
  defaultLocale: LocaleType;
};
export default function LanguagePackProvider<LanguagePackSchema>({
  children,
  packs,
  defaultLocale,
}: LanguagePackProviderProps<LanguagePackSchema>) {
  const [locale, setLocale] = useState<LocaleType>(defaultLocale);
  const configured = Object.keys(packs).length !== 0;

  function getLanguagePack() {
    if (!configured) return null;

    if (!(locale in packs)) {
      console.warn(`Selected locale '${locale}' was not found in the language pack. Reverting to defaults...`);

      const localeDefaults = [defaultLocale, 'en', 'it'];
      for (const defaultLocale of localeDefaults) {
        if (defaultLocale in packs) {
          return packs[defaultLocale];
        }
      }
      console.error(`No usable local found for the provided language packs; tried: ${localeDefaults.toString()}`);
    } else return packs[locale];
  }

  return (
    <LanguagePackContext.Provider
      value={{
        languagePack: getLanguagePack(),
        selectedLocale: locale,
        configuredLocales: Object.keys(packs),
        switchLanguage: (newLocale: string) => {
          setLocale(newLocale);
        },
        isConfigured: configured,
      }}
    >
      {children}
    </LanguagePackContext.Provider>
  );
}

export function useLanguagePack<LanguagePackSchema>(): useLanguagePackReturn<LanguagePackSchema> {
  return useContext(LanguagePackContext);
}
