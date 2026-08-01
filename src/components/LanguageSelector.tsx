import { useLanguage } from '../i18n/LanguageContext'
import type { Lang } from '../i18n/translations'

const OPTIONS: { id: Lang; label: string }[] = [
  { id: 'en', label: 'EN' },
  { id: 'fr', label: 'FR' },
]

export function LanguageSelector() {
  const { lang, setLang, t } = useLanguage()

  return (
    <div className="lang-selector" role="group" aria-label={t.langLabel}>
      <span className="lang-label">{t.langLabel}</span>
      <div className="lang-tabs">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={lang === opt.id ? 'active' : ''}
            aria-pressed={lang === opt.id}
            onClick={() => setLang(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
