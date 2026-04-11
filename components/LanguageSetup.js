// components/LanguageSetup.js
// First-time modal for selecting FROM and TO languages
// Called on first launch or when user resets language preferences

import { useState, useEffect } from 'react'
import { LANGUAGES, getAllRegions } from '../lib/languages'
import { getT } from '../lib/translations'

export default function LanguageSetup({ isOpen, onConfirm }) {
  const [fromLang, setFromLang] = useState('en-US')
  const [toLanguages, setToLanguages] = useState(['en-US'])
  const [showAllLanguages, setShowAllLanguages] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [step, setStep] = useState(1) // 1 or 2

  const t = getT(fromLang) // Use fromLang for UI text preview

  if (!isOpen) return null

  // Get languages for the current region or all languages
  const displayLanguages = selectedRegion
    ? LANGUAGES.filter(lang => lang.region === selectedRegion)
    : LANGUAGES

  const regions = getAllRegions()

  function handleToLanguageToggle(code) {
    setToLanguages(prev => {
      if (prev.includes(code)) {
        return prev.filter(l => l !== code)
      } else {
        return [...prev, code]
      }
    })
  }

  function handleConfirm() {
    if (toLanguages.length === 0) {
      alert('Please select at least one output language')
      return
    }
    onConfirm({
      fromLanguage: fromLang,
      toLanguages: toLanguages,
    })
  }

  return (
    <div className="language-setup-backdrop">
      <div className="language-setup-modal">
        {/* Header */}
        <div className="language-setup-header">
          <h2>{t.setupTitle}</h2>
          <p>{t.setupSubtitle}</p>
        </div>

        {/* Progress indicator */}
        <div className="setup-progress">
          <div className={`progress-dot ${step === 1 ? 'active' : 'completed'}`}>1</div>
          <div className={`progress-line ${step === 2 ? 'active' : ''}`}></div>
          <div className={`progress-dot ${step === 2 ? 'active' : ''}`}>2</div>
        </div>

        {/* Step 1: FROM Language */}
        {step === 1 && (
          <div className="setup-step">
            <label className="setup-step-label">{t.setupStep1}</label>
            <p className="setup-step-desc">{t.setupStep1Desc}</p>

            {/* Region filter */}
            <div className="region-filter">
              <button
                className={`region-btn ${selectedRegion === null ? 'active' : ''}`}
                onClick={() => setSelectedRegion(null)}
              >
                {t.setupShowAll}
              </button>
              {regions.map(region => (
                <button
                  key={region}
                  className={`region-btn ${selectedRegion === region ? 'active' : ''}`}
                  onClick={() => setSelectedRegion(region)}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* Language grid */}
            <div className="language-grid">
              {displayLanguages.map(lang => (
                <button
                  key={lang.code}
                  className={`language-btn ${fromLang === lang.code ? 'selected' : ''}`}
                  onClick={() => setFromLang(lang.code)}
                >
                  <span className="lang-flag">{lang.flag}</span>
                  <span className="lang-name">{lang.name}</span>
                  {lang.nativeName !== lang.name && (
                    <span className="lang-native">{lang.nativeName}</span>
                  )}
                  {fromLang === lang.code && <span className="checkmark">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: TO Languages */}
        {step === 2 && (
          <div className="setup-step">
            <label className="setup-step-label">{t.setupStep2}</label>
            <p className="setup-step-desc">{t.setupStep2Desc}</p>
            <p className="setup-tip">{t.setupTip}</p>

            {/* Region filter */}
            <div className="region-filter">
              <button
                className={`region-btn ${selectedRegion === null ? 'active' : ''}`}
                onClick={() => setSelectedRegion(null)}
              >
                {t.setupShowAll}
              </button>
              {regions.map(region => (
                <button
                  key={region}
                  className={`region-btn ${selectedRegion === region ? 'active' : ''}`}
                  onClick={() => setSelectedRegion(region)}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* Language grid with multi-select */}
            <div className="language-grid">
              {displayLanguages.map(lang => (
                <button
                  key={lang.code}
                  className={`language-btn ${toLanguages.includes(lang.code) ? 'selected' : ''}`}
                  onClick={() => handleToLanguageToggle(lang.code)}
                >
                  <span className="lang-flag">{lang.flag}</span>
                  <span className="lang-name">{lang.name}</span>
                  {lang.nativeName !== lang.name && (
                    <span className="lang-native">{lang.nativeName}</span>
                  )}
                  {toLanguages.includes(lang.code) && <span className="checkmark">✓</span>}
                </button>
              ))}
            </div>

            {/* Selected count */}
            <div className="selected-count">
              {toLanguages.length} language{toLanguages.length !== 1 ? 's' : ''} selected
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="setup-buttons">
          {step === 2 && (
            <button
              className="btn-secondary"
              onClick={() => setStep(1)}
            >
              ← Back
            </button>
          )}
          {step === 1 && (
            <button
              className="btn-primary"
              onClick={() => setStep(2)}
            >
              Next →
            </button>
          )}
          {step === 2 && (
            <button
              className="btn-primary"
              onClick={handleConfirm}
            >
              {t.setupConfirm}
            </button>
          )}
        </div>

        {/* Footer note */}
        <p className="setup-footer-note">
          💡 You can change these settings anytime in Settings → Language Settings
        </p>
      </div>
    </div>
  )
}