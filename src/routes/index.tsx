import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import logo from '../logo.svg'
import { LanguageSelector } from '@/components/LanguageSelector'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { t } = useTranslation()

  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <img
          src={logo}
          className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <h1 className="text-4xl font-bold mb-4">{t('pages.home.title')}</h1>
        <p className="mb-4 max-w-md">
          {t('pages.home.description')}
        </p>

        {/* i18n Demo Section */}
        <div className="mt-8 p-6 bg-gray-700/50 rounded-lg max-w-lg">
          <h2 className="text-xl font-semibold mb-4">{t('language.select')}</h2>
          <LanguageSelector variant="buttons" className="justify-center" />

          <div className="mt-6 text-left text-sm space-y-2">
            <p><strong>{t('common.loading')}</strong></p>
            <p><strong>{t('common.save')}</strong> / <strong>{t('common.cancel')}</strong></p>
            <p><strong>{t('form.name')}:</strong> {t('form.required')}</p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <a
            className="text-[#61dafb] hover:underline"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <a
            className="text-[#61dafb] hover:underline"
            href="https://tanstack.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn TanStack
          </a>
        </div>
      </header>
    </div>
  )
}
