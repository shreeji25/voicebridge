// components/LanguageSetup.js
// Language setup modal — single FROM and single TO language selection
// Used on first launch OR when user clicks "Change Language" anytime

import { useState } from 'react'
import { LANGUAGES, getAllRegions } from '../lib/languages'
import { getT } from '../lib/translations'

export default function LanguageSetup({ isOpen, onConfirm, initialFrom, initialTo }) {
  const [fromLang, setFromLang] = useState(initialFrom || 'en-US')
  const [toLang, setToLang] = useState(initialTo || 'hi-IN')
  const [fromRegion, setFromRegion] = useState(null)
  const [toRegion, setToRegion] = useState(null)
  const [activePanel, setActivePanel] = useState('from') // 'from' or 'to'

  const t = getT(fromLang)
  const regions = getAllRegions()

  if (!isOpen) return null

  const fromLanguages = fromRegion
    ? LANGUAGES.filter(l => l.region === fromRegion)
    : LANGUAGES

  const toLanguages = toRegion
    ? LANGUAGES.filter(l => l.region === toRegion)
    : LANGUAGES

  const fromLangObj = LANGUAGES.find(l => l.code === fromLang)
  const toLangObj   = LANGUAGES.find(l => l.code === toLang)

  function handleConfirm() {
    onConfirm({ fromLanguage: fromLang, toLanguage: toLang })
  }

  return (
    <div className="lsu-backdrop">
      <div className="lsu-modal">

        {/* Header */}
        <div className="lsu-header">
          <div className="lsu-header-icon">🌐</div>
          <h2>Choose Languages</h2>
          <p>Select the language you speak and the language you want</p>
        </div>

        {/* Selected pair preview */}
        <div className="lsu-pair-preview">
          <button
            className={`lsu-pair-card ${activePanel === 'from' ? 'active' : ''}`}
            onClick={() => setActivePanel('from')}
          >
            <span className="lsu-pair-label">YOU SPEAK</span>
            <span className="lsu-pair-flag">{fromLangObj?.flag || '🌐'}</span>
            <span className="lsu-pair-name">{fromLangObj?.name || 'Select'}</span>
          </button>

          <div className="lsu-pair-arrow">→</div>

          <button
            className={`lsu-pair-card ${activePanel === 'to' ? 'active' : ''}`}
            onClick={() => setActivePanel('to')}
          >
            <span className="lsu-pair-label">TRANSLATE TO</span>
            <span className="lsu-pair-flag">{toLangObj?.flag || '🌐'}</span>
            <span className="lsu-pair-name">{toLangObj?.name || 'Select'}</span>
          </button>
        </div>

        {/* Panel: FROM */}
        {activePanel === 'from' && (
          <div className="lsu-panel">
            <div className="lsu-panel-title">Select your speaking language</div>

            <div className="lsu-region-filter">
              <button
                className={`lsu-region-btn ${fromRegion === null ? 'active' : ''}`}
                onClick={() => setFromRegion(null)}
              >All</button>
              {regions.map(r => (
                <button
                  key={r}
                  className={`lsu-region-btn ${fromRegion === r ? 'active' : ''}`}
                  onClick={() => setFromRegion(r)}
                >{r}</button>
              ))}
            </div>

            <div className="lsu-lang-grid">
              {fromLanguages.map(lang => (
                <button
                  key={lang.code}
                  className={`lsu-lang-btn ${fromLang === lang.code ? 'selected' : ''}`}
                  onClick={() => { setFromLang(lang.code); setActivePanel('to') }}
                >
                  <span className="lsu-flag">{lang.flag}</span>
                  <span className="lsu-name">{lang.name}</span>
                  {lang.nativeName !== lang.name && (
                    <span className="lsu-native">{lang.nativeName}</span>
                  )}
                  {fromLang === lang.code && <span className="lsu-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Panel: TO */}
        {activePanel === 'to' && (
          <div className="lsu-panel">
            <div className="lsu-panel-title">Select translation language</div>

            <div className="lsu-region-filter">
              <button
                className={`lsu-region-btn ${toRegion === null ? 'active' : ''}`}
                onClick={() => setToRegion(null)}
              >All</button>
              {regions.map(r => (
                <button
                  key={r}
                  className={`lsu-region-btn ${toRegion === r ? 'active' : ''}`}
                  onClick={() => setToRegion(r)}
                >{r}</button>
              ))}
            </div>

            <div className="lsu-lang-grid">
              {toLanguages.map(lang => (
                <button
                  key={lang.code}
                  className={`lsu-lang-btn ${toLang === lang.code ? 'selected' : ''}`}
                  onClick={() => setToLang(lang.code)}
                >
                  <span className="lsu-flag">{lang.flag}</span>
                  <span className="lsu-name">{lang.name}</span>
                  {lang.nativeName !== lang.name && (
                    <span className="lsu-native">{lang.nativeName}</span>
                  )}
                  {toLang === lang.code && <span className="lsu-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Confirm button */}
        <button className="lsu-confirm-btn" onClick={handleConfirm}>
          ✓ Confirm — {fromLangObj?.flag} {fromLangObj?.name} → {toLangObj?.flag} {toLangObj?.name}
        </button>

      </div>
    </div>
  )
}