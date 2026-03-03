
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import Storage from '@react-native-async-storage/async-storage';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import translations from '../../constants/translations/';
import { ITranslate } from '../../constants/types';

// i18n setup
const i18n = new I18n(translations);
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

export const TranslationContext = React.createContext({});

export const TranslationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [locale, setLocale] = useState<string>('en'); // always string

  // apply locale
  i18n.locale = locale;

  const t = useCallback(
    (scope: string | string[], options?: object) => {
      return i18n.translate(scope, { ...options, locale });
    },
    [locale]
  );

  // get saved locale
  const getLocale = useCallback(async () => {
    try {
      const savedLocale = await Storage.getItem('locale');

      if (savedLocale) {
        setLocale(savedLocale);
      } else {
        // fallback ONLY to "en"
        setLocale('en');
      }
    } catch (e) {
      setLocale('en');
    }
  }, []);

  useEffect(() => {
    getLocale();
  }, [getLocale]);

  // save locale safely
  useEffect(() => {
    const saveLocale = async () => {
      try {
        await Storage.setItem('locale', String(locale));
      } catch (e) {}
    };
    saveLocale();
  }, [locale]);

  const contextValue = {
    t,
    locale,
    setLocale,
    translate: t,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () =>
  useContext(TranslationContext) as ITranslate;

