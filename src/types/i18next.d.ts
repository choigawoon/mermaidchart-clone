/**
 * i18next TypeScript Type Definitions
 *
 * This file provides type safety for translation keys.
 * It enables autocomplete and type checking for useTranslation hook.
 */

import 'i18next'
import type en from '@/locales/en.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    // Default namespace
    defaultNS: 'translation'

    // Type-safe resources based on English translation file
    resources: {
      translation: typeof en
    }

    // Return type for translation function
    returnNull: false
  }
}
