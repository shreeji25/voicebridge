// pages/index.js — UPDATED with From/To multilingual setup
// Adds first-time language configuration modal on launch

import { useState, useEffect } from "react"
import LanguageSetup from "../components/LanguageSetup"
import LanguageSelector from "../components/LanguageSelector"
import VoiceToText from "../components/VoiceToText"
import TextToSpeech from "../components/TextToSpeech"
import QuickPhrases from "../components/QuickPhrases"
import History from "../components/History"
import HelpModal from "../components/HelpModal"
import Settings from "../components/Settings"
import { getT } from "../lib/translations"

export default function Home() {
  // ── Language state (FROM/TO model) ──────────────────────────────────
  const [fromLanguage, setFromLanguage] = useState("en-US")
  const [toLanguages, setToLanguages] = useState(["en-US"])
  const [showLanguageSetup, setShowLanguageSetup] = useState(false)
  const [setupCompleted, setSetupCompleted] = useState(false)

  // ── Other state ─────────────────────────────────────────────────────
  const [tab, setTab] = useState("conversation")
  const [history, setHistory] = useState([])
  const [isOnline, setIsOnline] = useState(true)
  const [largeText, setLargeText] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [theme, setTheme] = useState("dark")

  // ── Initialize from localStorage on mount ───────────────────────────
  useEffect(() => {
    const savedFromLang = localStorage.getItem("vb_fromLanguage")
    const savedToLangs = localStorage.getItem("vb_toLanguages")
    const setupDone = localStorage.getItem("vb_setupDone")

    if (setupDone) {
      setSetupCompleted(true)
      if (savedFromLang) setFromLanguage(savedFromLang)
      if (savedToLangs) setToLanguages(JSON.parse(savedToLangs))
    } else {
      // First time - show setup modal
      setShowLanguageSetup(true)
    }

    // Other first-time checks
    if (!localStorage.getItem("vb_seen")) {
      setShowBanner(true)
      localStorage.setItem("vb_seen", "1")
    }
  }, [])

  // ── Handle language setup confirmation ───────────────────────────────
  function handleLanguageSetupConfirm({ fromLanguage: from, toLanguages: to }) {
    setFromLanguage(from)
    setToLanguages(to)
    setSetupCompleted(true)
    setShowLanguageSetup(false)

    // Save to localStorage
    localStorage.setItem("vb_fromLanguage", from)
    localStorage.setItem("vb_toLanguages", JSON.stringify(to))
    localStorage.setItem("vb_setupDone", "1")
  }

  // ── Apply accessibility classes ─────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle("large-text", largeText)
  }, [largeText])

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast)
  }, [highContrast])

  // ── Apply theme ─────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  // ── Online / offline banner ─────────────────────────────────────────
  useEffect(() => {
    const onOn = () => setIsOnline(true)
    const onOff = () => setIsOnline(false)
    window.addEventListener("online", onOn)
    window.addEventListener("offline", onOff)
    return () => {
      window.removeEventListener("online", onOn)
      window.removeEventListener("offline", onOff)
    }
  }, [])

  function addToHistory(item) {
    setHistory((prev) => [item, ...prev])
  }

  const t = getT(fromLanguage)

  // Don't show main UI until setup is complete
  if (!setupCompleted) {
    return (
      <div className="page">
        <LanguageSetup
          isOpen={showLanguageSetup}
          onConfirm={handleLanguageSetupConfirm}
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

      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🌉</span>
          <div>
            <h1 className="logo-name">{t.appName}</h1>
            <p className="logo-sub">{t.appSubtitle}</p>
          </div>
        </div>
        <button className="help-pill" onClick={() => setHelpOpen(true)}>
          {t.helpButton}
        </button>
      </header>

      {/* ── Current language display ───────────────────────────────── */}
      {tab !== "settings" && (
        <div className="current-lang-display">
          <div className="lang-badge from-lang">
            <span className="badge-label">From:</span>
            <span className="badge-value">{fromLanguage}</span>
          </div>
          <div className="lang-badge to-langs">
            <span className="badge-label">To:</span>
            <span className="badge-value">{toLanguages.join(", ")}</span>
          </div>
        </div>
      )}

      {/* ── Tab bar ──────────────────────────────────────────────── */}
      <nav className="tab-bar">
        {[
          { key: "conversation", label: t.tabConversation },
          { key: "tts", label: t.tabTextToSpeech },
          { key: "vtt", label: t.tabVoiceToText },
          { key: "settings", label: t.tabSettings },
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

      {/* ── Tab content ──────────────────────────────────────────── */}
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
            toLanguages={toLanguages}
            onLanguageSettingsChange={(from, to) => {
              setFromLanguage(from)
              setToLanguages(to)
              localStorage.setItem("vb_fromLanguage", from)
              localStorage.setItem("vb_toLanguages", JSON.stringify(to))
            }}
            onResetSetup={() => {
              localStorage.removeItem("vb_setupDone")
              localStorage.removeItem("vb_fromLanguage")
              localStorage.removeItem("vb_toLanguages")
              setShowLanguageSetup(true)
              setSetupCompleted(false)
            }}
            theme={theme}
            onThemeChange={setTheme}
            t={t}
          />
        )}
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="footer">
        <p>{t.footerText}</p>
      </footer>

      {/* ── Help modal ───────────────────────────────────────────── */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} t={t} />

      {/* ── Language setup modal (shown on first launch or reset) ── */}
      <LanguageSetup
        isOpen={showLanguageSetup}
        onConfirm={handleLanguageSetupConfirm}
      />
    </div>
  )
}