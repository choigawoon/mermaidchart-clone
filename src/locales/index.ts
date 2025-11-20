/**
 * Locales Index
 *
 * Re-exports translation files and types for easier imports
 */

import en from './en.json'
import ko from './ko.json'
import ja from './ja.json'

export { en, ko, ja }

// Type for translation keys (based on English translation structure)
export type TranslationKeys = typeof en
