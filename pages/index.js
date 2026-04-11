// pages/index.js — FROM/TO single language selection with anytime switching

import { useState, useEffect, useRef } from "react"
import LanguageSetup from "../components/LanguageSetup"
import VoiceToText from "../components/VoiceToText"
import TextToSpeech from "../components/TextToSpeech"
import QuickPhrases from "../components/QuickPhrases"
import History from "../components/History"
import HelpModal from "../components/HelpModal"
import Settings from "../components/Settings"
import { getT } from "../lib/translations"
import { LANGUAGES } from "../lib/languages"

export default function Home() {
  // ── Language state ───────────────────────────────────────────────────
  const [fromLanguage, setFromLanguage] = useState("en-US")
  const [toLanguage, setToLanguage]     = useState("hi-IN")
  const [showLanguageSetup, setShowLanguageSetup] = useState(false)
  const [setupCompleted, setSetupCompleted]       = useState(false)

  // ── Language dropdown state ─────────────────────────────────────────
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // ── Other state ──────────────────────────────────────────────────────
  const [tab, setTab]               = useState("conversation")
  const [history, setHistory]       = useState([])
  const [isOnline, setIsOnline]     = useState(true)
  const [largeText, setLargeText]   = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [helpOpen, setHelpOpen]     = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [theme, setTheme]           = useState("dark")

  // ── Load from localStorage on mount ────────────────────────────────
  useEffect(() => {
    const savedFrom  = localStorage.getItem("vb_fromLanguage")
    const savedTo    = localStorage.getItem("vb_toLanguage")
    const setupDone  = localStorage.getItem("vb_setupDone")

    if (setupDone) {
      setSetupCompleted(true)
      if (savedFrom) setFromLanguage(savedFrom)
      if (savedTo)   setToLanguage(savedTo)
    } else {
      setShowLanguageSetup(true)
    }

    if (!localStorage.getItem("vb_seen")) {
      setShowBanner(true)
      localStorage.setItem("vb_seen", "1")
    }
  }, [])

  // ── Close dropdown on outside click ────────────────────────────────
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // ── Confirm language setup/change ───────────────────────────────────
  function handleLanguageSetupConfirm({ fromLanguage: from, toLanguage: to }) {
    setFromLanguage(from)
    setToLanguage(to)
    setSetupCompleted(true)
    setShowLanguageSetup(false)

    localStorage.setItem("vb_fromLanguage", from)
    localStorage.setItem("vb_toLanguage", to)
    localStorage.setItem("vb_setupDone", "1")
  }

  // ── Accessibility & theme effects ───────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle("large-text", largeText)
  }, [largeText])

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast)
  }, [highContrast])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  // ── Online / offline ─────────────────────────────────────────────────
  useEffect(() => {
    const onOn  = () => setIsOnline(true)
    const onOff = () => setIsOnline(false)
    window.addEventListener("online",  onOn)
    window.addEventListener("offline", onOff)
    return () => {
      window.removeEventListener("online",  onOn)
      window.removeEventListener("offline", onOff)
    }
  }, [])

  function addToHistory(item) {
    setHistory((prev) => [item, ...prev])
  }

  const t = getT(fromLanguage)

  const fromLangObj = LANGUAGES.find(l => l.code === fromLanguage)
  const toLangObj   = LANGUAGES.find(l => l.code === toLanguage)

  // ── First-time setup screen ─────────────────────────────────────────
  if (!setupCompleted) {
    return (
      <div className="page">
        <LanguageSetup
          isOpen={showLanguageSetup}
          onConfirm={handleLanguageSetupConfirm}
          initialFrom={fromLanguage}
          initialTo={toLanguage}
        />
      </div>
    )
  }

  return (
    <div className="page">
      {/* ── Offline banner ─────────────────────────────────────────── */}
      {!isOnline && <div className="offline-banner">{t.bannerOffline}</div>}

      {/* ── Welcome banner ─────────────────────────────────────────── */}
      {showBanner && (
        <div className="welcome-banner">
          <strong>{t.bannerWelcomeTitle}</strong> {t.bannerWelcomeText}
          <button onClick={() => setShowBanner(false)}>
            {t.bannerWelcomeDismiss}
          </button>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🌉</span>
          <div>
            <h1 className="logo-name">{t.appName}</h1>
            <p className="logo-sub">{t.appSubtitle}</p>
          </div>
        </div>

        <div className="header-right">
          {/* ── Language switcher dropdown ── */}
          <div className="lang-switcher" ref={dropdownRef}>
            <button
              className="lang-switcher-btn"
              onClick={() => setDropdownOpen(prev => !prev)}
              aria-expanded={dropdownOpen}
              title="Change languages"
            >
              <span className="ls-pair">
                <span>{fromLangObj?.flag || '🌐'}</span>
                <span className="ls-arrow">→</span>
                <span>{toLangObj?.flag || '🌐'}</span>
              </span>
              <span className="ls-names">
                {fromLangObj?.name || fromLanguage}
                <span className="ls-sep"> → </span>
                {toLangObj?.name || toLanguage}
              </span>
              <svg className={`ls-chevron ${dropdownOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="4,6 8,10 12,6" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="lang-switcher-dropdown">
                <div className="lsd-header">Current languages</div>

                <div className="lsd-current">
                  <div className="lsd-current-row">
                    <span className="lsd-label">SPEAKING</span>
                    <span className="lsd-value">
                      {fromLangObj?.flag} {fromLangObj?.name}
                    </span>
                  </div>
                  <div className="lsd-divider">↓ translates to</div>
                  <div className="lsd-current-row">
                    <span className="lsd-label">OUTPUT</span>
                    <span className="lsd-value">
                      {toLangObj?.flag} {toLangObj?.name}
                    </span>
                  </div>
                </div>

                <button
                  className="lsd-change-btn"
                  onClick={() => {
                    setDropdownOpen(false)
                    setShowLanguageSetup(true)
                  }}
                >
                  🔄 Change Languages
                </button>
              </div>
            )}
          </div>

          <button className="help-pill" onClick={() => setHelpOpen(true)}>
            {t.helpButton}
          </button>
        </div>
      </header>

      {/* ── Tab bar ──────────────────────────────────────────────────── */}
      <nav className="tab-bar">
        {[
          { key: "conversation", label: t.tabConversation },
          { key: "tts",          label: t.tabTextToSpeech },
          { key: "vtt",          label: t.tabVoiceToText  },
          { key: "settings",     label: t.tabSettings     },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`tab-btn ${tab === key ? "active" : ""}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* ── Tab content ──────────────────────────────────────────────── */}
      <main className="main">
        {tab === "conversation" && (
          <>
            <QuickPhrases langCode={fromLanguage} onAddToHistory={addToHistory} t={t} />
            <History
              items={history}
              langCode={fromLanguage}
              onClear={() => setHistory([])}
              chatMode
              t={t}
            />
          </>
        )}
        {tab === "tts" && (
          <TextToSpeech langCode={fromLanguage} onAddToHistory={addToHistory} t={t} />
        )}
        {tab === "vtt" && (
          <VoiceToText langCode={fromLanguage} onAddToHistory={addToHistory} t={t} />
        )}
        {tab === "settings" && (
          <Settings
            history={history}
            onClearHistory={() => setHistory([])}
            largeText={largeText}
            onLargeTextChange={setLargeText}
            highContrast={highContrast}
            onHighContrastChange={setHighContrast}
            fromLanguage={fromLanguage}
            toLanguage={toLanguage}
            onOpenLanguageSetup={() => setShowLanguageSetup(true)}
            onResetSetup={() => {
              localStorage.removeItem("vb_setupDone")
              localStorage.removeItem("vb_fromLanguage")
              localStorage.removeItem("vb_toLanguage")
              setShowLanguageSetup(true)
              setSetupCompleted(false)
            }}
            theme={theme}
            onThemeChange={setTheme}
            t={t}
          />
        )}
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="footer">
        <p>{t.footerText}</p>
      </footer>

      {/* ── Help modal ───────────────────────────────────────────────── */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} t={t} />

      {/* ── Language setup modal ────────────────────────────────────── */}
      <LanguageSetup
        isOpen={showLanguageSetup}
        onConfirm={handleLanguageSetupConfirm}
        initialFrom={fromLanguage}
        initialTo={toLanguage}
      />
    </div>
  )
}