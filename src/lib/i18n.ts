/**
 * i18n Configuration
 *
 * This file sets up internationalization using i18next and react-i18next.
 * It supports English, Korean, and Japanese languages.
 *
 * Features:
 * - Type-safe translation keys
 * - Pluralization support
 * - Date/time/number formatting with Intl API
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

// Language to locale mapping for Intl API
const languageToLocale: Record<SupportedLanguage, string> = {
  en: 'en-US',
  ko: 'ko-KR',
  ja: 'ja-JP',
}

// Currency mapping for each language
const languageToCurrency: Record<SupportedLanguage, string> = {
  en: 'USD',
  ko: 'KRW',
  ja: 'JPY',
}

// Translation resources
const resources = {
  en: { translation: en },
  ko: { translation: ko },
  ja: { translation: ja },
}

/**
 * Custom formatter for date/time/number formatting using Intl API
 */
const formatters = {
  dateShort: (value: Date | string | number, lng: string) => {
    const locale = languageToLocale[lng as SupportedLanguage] || lng
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(value))
  },

  dateLong: (value: Date | string | number, lng: string) => {
    const locale = languageToLocale[lng as SupportedLanguage] || lng
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(new Date(value))
  },

  time: (value: Date | string | number, lng: string) => {
    const locale = languageToLocale[lng as SupportedLanguage] || lng
    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(new Date(value))
  },

  dateTime: (value: Date | string | number, lng: string) => {
    const locale = languageToLocale[lng as SupportedLanguage] || lng
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(value))
  },

  relativeTime: (value: Date | string | number, lng: string) => {
    const locale = languageToLocale[lng as SupportedLanguage] || lng
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
    const diff = new Date(value).getTime() - Date.now()
    const diffDays = Math.round(diff / (1000 * 60 * 60 * 24))

    if (Math.abs(diffDays) < 1) {
      const diffHours = Math.round(diff / (1000 * 60 * 60))
      if (Math.abs(diffHours) < 1) {
        const diffMinutes = Math.round(diff / (1000 * 60))
        return rtf.format(diffMinutes, 'minute')
      }
      return rtf.format(diffHours, 'hour')
    }
    return rtf.format(diffDays, 'day')
  },

  number: (value: number, lng: string) => {
    const locale = languageToLocale[lng as SupportedLanguage] || lng
    return new Intl.NumberFormat(locale).format(value)
  },

  currency: (value: number, lng: string) => {
    const locale = languageToLocale[lng as SupportedLanguage] || lng
    const currency = languageToCurrency[lng as SupportedLanguage] || 'USD'
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value)
  },

  percent: (value: number, lng: string) => {
    const locale = languageToLocale[lng as SupportedLanguage] || lng
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value)
  },
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
      format: (value, format, lng) => {
        if (!format || !lng) return value

        // Use custom formatters for specific formats
        if (format in formatters) {
          return formatters[format as keyof typeof formatters](value, lng)
        }

        return value
      },
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

/**
 * Format a date using the current language
 * @param date - Date to format
 * @param format - Format type ('dateShort', 'dateLong', 'time', 'dateTime', 'relativeTime')
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | number,
  format: 'dateShort' | 'dateLong' | 'time' | 'dateTime' | 'relativeTime' = 'dateShort'
): string => {
  return formatters[format](date, getCurrentLanguage())
}

/**
 * Format a number using the current language
 * @param value - Number to format
 * @param format - Format type ('number', 'currency', 'percent')
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number,
  format: 'number' | 'currency' | 'percent' = 'number'
): string => {
  return formatters[format](value, getCurrentLanguage())
}

export default i18n
