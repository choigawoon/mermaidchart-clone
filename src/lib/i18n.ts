/**
 * i18n Configuration
 *
 * This file sets up internationalization using i18next and react-i18next.
 * It supports English, Korean, and Japanese languages.
 */

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import en from '@/locales/en.json'
import ko from '@/locales/ko.json'
import ja from '@/locales/ja.json'

// Define supported languages
export const supportedLanguages = ['en', 'ko', 'ja'] as const
export type SupportedLanguage = typeof supportedLanguages[number]

// Translation resources
const resources = {
  en: { translation: en },
  ko: { translation: ko },
  ja: { translation: ja },
}

// Initialize i18next
i18n
  .use(LanguageDetector) // Detect browser language
  .use(initReactI18next) // Pass i18n to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,

    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React already handles XSS
    },

    // React-specific options
    react: {
      useSuspense: false, // Disable suspense for simpler initial setup
    },
  })

/**
 * Change the current language
 * @param language - Language code ('en', 'ko', 'ja')
 */
export const changeLanguage = async (language: SupportedLanguage): Promise<void> => {
  await i18n.changeLanguage(language)
  document.documentElement.lang = language
}

/**
 * Get the current language
 * @returns Current language code
 */
export const getCurrentLanguage = (): SupportedLanguage => {
  return (i18n.language || 'en') as SupportedLanguage
}

export default i18n
