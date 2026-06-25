"use client";

import { createContext, useContext } from "react";
import { dictionaries, type Dict, type Locale } from "./dictionaries";

type I18nValue = { locale: Locale; dict: Dict };

const I18nContext = createContext<I18nValue>({
  locale: "en",
  dict: dictionaries.en,
});

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale, dict: dictionaries[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}
