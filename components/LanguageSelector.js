// components/LanguageSelector.js
// Displays language buttons for the user to choose the recognition/speech language.

const LANGUAGES = [
  { code: 'en-US', label: 'English',   flag: '🇺🇸', native: 'English'  },
  { code: 'hi-IN', label: 'Hindi',     flag: '🇮🇳', native: 'हिंदी'    },
  { code: 'gu-IN', label: 'Gujarati',  flag: '🇮🇳', native: 'ગુજરાતી'  },
]

export default function LanguageSelector({ selected, onChange }) {
  return (
    <div className="card">
      <div className="card-title">
        <span>🌐</span> Select Language
      </div>
      <div className="lang-row">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            className={`lang-btn ${selected === lang.code ? 'active' : ''}`}
            onClick={() => onChange(lang.code)}
            aria-label={`Select ${lang.label}`}
          >
            <span className="lang-flag">{lang.flag}</span>
            <span>{lang.label}</span>
            {/* Show native script for non-English languages */}
            {lang.native !== lang.label && (
              <span style={{ fontSize: '11px', opacity: 0.65 }}>({lang.native})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export { LANGUAGES }