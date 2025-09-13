'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Locale, locales, defaultLocale, isRTL } from '@/i18n/config';

interface Translations {
  [key: string]: any;
}

interface TranslationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [translations, setTranslations] = useState<Translations>({});

  // Загружаем переводы при изменении языка
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationModule = await import(`@/i18n/translations/${locale}.json`);
        setTranslations(translationModule.default);
      } catch (error) {
        console.error(`Failed to load translations for ${locale}:`, error);
        // Fallback к русскому языку
        if (locale !== 'ru') {
          const fallbackModule = await import('@/i18n/translations/ru.json');
          setTranslations(fallbackModule.default);
        }
      }
    };

    loadTranslations();
  }, [locale]);

  // Загружаем сохраненный язык из localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && locales.some(l => l.code === savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // Обновляем dir атрибут для RTL языков
    const htmlElement = document.documentElement;
    htmlElement.dir = isRTL(newLocale) ? 'rtl' : 'ltr';
    htmlElement.lang = newLocale;
    
    // Добавляем класс для RTL стилей
    if (isRTL(newLocale)) {
      htmlElement.classList.add('rtl');
    } else {
      htmlElement.classList.remove('rtl');
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Возвращаем ключ если перевод не найден
      }
    }
    
    if (typeof value === 'string') {
      // Заменяем параметры в строке
      if (params) {
        let result = value;
        for (const [paramKey, paramValue] of Object.entries(params)) {
          // Если параметр является ключом тренда, переводим его
          let translatedValue = String(paramValue);
          if (paramKey === 'trend' && (paramValue === 'upward' || paramValue === 'downward' || paramValue === 'sideways')) {
            // Получаем перевод тренда напрямую из translations
            const trendKeys = `signals.trends.${paramValue}`.split('.');
            let trendValue: any = translations;
            
            for (const k of trendKeys) {
              if (trendValue && typeof trendValue === 'object' && k in trendValue) {
                trendValue = trendValue[k];
              } else {
                trendValue = paramValue; // fallback к оригинальному значению
                break;
              }
            }
            
            if (typeof trendValue === 'string') {
              translatedValue = trendValue;
            }
          }
          
          // Поддерживаем оба формата: ${param} и {param}
          result = result.replace(new RegExp(`\\$\\{${paramKey}\\}`, 'g'), translatedValue);
          result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), translatedValue);
        }
        return result;
      }
      return value;
    }
    
    return key;
  };

  return (
    <TranslationContext.Provider value={{
      locale,
      setLocale,
      t,
      isRTL: isRTL(locale)
    }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationProvider');
  }
  return context;
}
