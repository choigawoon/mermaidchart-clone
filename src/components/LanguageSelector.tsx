/**
 * LanguageSelector Component
 *
 * A dropdown component for selecting the application language.
 * Integrates with Zustand store and i18next.
 */

import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useLanguage, useUiActions } from '@/stores'
import type { Language } from '@/stores'

interface LanguageSelectorProps {
  className?: string
  variant?: 'dropdown' | 'buttons'
}

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
]

export const LanguageSelector = ({
  className,
  variant = 'dropdown',
}: LanguageSelectorProps) => {
  const { t } = useTranslation()
  const currentLanguage = useLanguage()
  const { setLanguage } = useUiActions()

  if (variant === 'buttons') {
    return (
      <div className={cn('flex gap-2', className)}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              currentLanguage === lang.code
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
            aria-label={`Switch to ${lang.name}`}
          >
            <span className="mr-1">{lang.flag}</span>
            {lang.code.toUpperCase()}
          </button>
        ))}
      </div>
    )
  }

  // Default: dropdown variant
  return (
    <div className={cn('relative', className)}>
      <label htmlFor="language-select" className="sr-only">
        {t('language.select')}
      </label>
      <div className="relative">
        <Globe className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <select
          id="language-select"
          value={currentLanguage}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className={cn(
            'appearance-none bg-background border border-input rounded-md',
            'pl-8 pr-8 py-1.5 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-ring',
            'cursor-pointer'
          )}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="h-4 w-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default LanguageSelector
