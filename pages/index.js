// pages/index.js
// Updated main page:
// - 4 tabs: Conversation | Text to Speech | Voice to Text | Settings
// - ? Help button in nav bar → opens HelpModal
// - First-time "New here?" banner (shown once, stored in localStorage)
// - Online/offline indicator
// - Accessibility toggles (Large Text + High Contrast) wired to Settings
// - QuickPhrases in Conversation tab
// - History in chatMode in Conversation tab

import { useState, useEffect } from 'react'
import Head               from 'next/head'
import LanguageSelector   from '../components/LanguageSelector'
import VoiceToText        from '../components/VoiceToText'
import TextToSpeech       from '../components/TextToSpeech'
import History            from '../components/History'
import QuickPhrases       from '../components/QuickPhrases'
import HelpModal          from '../components/HelpModal'
import Settings           from '../components/Settings'

const TABS = [
  { id: 'conversation', label: 'Conversation' },
  { id: 'tts',          label: 'Text to Speech' },
  { id: 'vtt',          label: 'Voice to Text' },
  { id: 'settings',     label: '⚙ Settings' },
]

export default function Home() {
  const [tab, setTab]           = useState('conversation')
  const [langCode, setLangCode] = useState('en-US')
  const [history, setHistory]   = useState([])
  const [isOnline, setIsOnline] = useState(true)

  // Accessibility
  const [largeText, setLargeText]       = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  // Help modal + first-time banner
  const [helpOpen, setHelpOpen]     = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem('vb_seen')
    if (!seen) setShowBanner(true)
    setIsOnline(navigator.onLine)
    const on  = () => setIsOnline(true)
    const off = () => setIsOnline(false)
    window.addEventListener('online',  on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('large-text',    largeText)
    document.documentElement.classList.toggle('high-contrast', highContrast)
  }, [largeText, highContrast])

  const dismissBanner = () => {
    setShowBanner(false)
    localStorage.setItem('vb_seen', '1')
  }

  const handleAddToHistory = (item) =>
    setHistory(prev => [...prev, { ...item, timestamp: new Date() }])

  return (
    <>
      <Head>
        <title>VoiceBridge — Assistive Communication</title>
        <meta name="description" content="Free assistive communication tool. Supports English, Hindi, and Gujarati." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="bg-orb bg-orb-1" aria-hidden="true" />
      <div className="bg-orb bg-orb-2" aria-hidden="true" />
      <div className="bg-orb bg-orb-3" aria-hidden="true" />

      <div className="page">

        {/* Offline warning */}
        {!isOnline && (
          <div className="offline-banner" role="alert">
            ⚠️ You are offline. Voice recognition may not work until you reconnect.
          </div>
        )}

        {/* First-time banner */}
        {showBanner && (
          <div className="welcome-banner">
            <span>👋 New here? Learn how VoiceBridge works in 30 seconds.</span>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                className="btn btn-primary"
                style={{ padding: '6px 14px', fontSize: 13 }}
                onClick={() => { setHelpOpen(true); dismissBanner() }}
              >
                Show me →
              </button>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 10px', fontSize: 13 }}
                onClick={dismissBanner}
                aria-label="Dismiss"
              >✕</button>
            </div>
          </div>
        )}

        {/* Header with Help button */}
        <header className="header" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
          <div className="logo">
            <div className="logo-icon" aria-hidden="true">🗣️</div>
            <span className="logo-text">VoiceBridge</span>
          </div>
          <button
            className="help-nav-btn"
            onClick={() => setHelpOpen(true)}
            aria-label="Help"
          >
            ? Help
          </button>
        </header>

        {/* Language selector (hidden on settings tab) */}
        {tab !== 'settings' && (
          <LanguageSelector selected={langCode} onChange={setLangCode} />
        )}

        {/* Tab bar */}
        <nav className="tab-bar" role="tablist">
          {TABS.map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`tab-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Conversation tab */}
        {tab === 'conversation' && (
          <div role="tabpanel">
            <QuickPhrases langCode={langCode} onAddToHistory={handleAddToHistory} />
            <History
              items={history}
              langCode={langCode}
              onClear={() => setHistory([])}
              chatMode={true}
            />
          </div>
        )}

        {/* Text to Speech tab */}
        {tab === 'tts' && (
          <div role="tabpanel">
            <TextToSpeech langCode={langCode} onAddToHistory={handleAddToHistory} />
          </div>
        )}

        {/* Voice to Text tab */}
        {tab === 'vtt' && (
          <div role="tabpanel">
            <VoiceToText langCode={langCode} onAddToHistory={handleAddToHistory} />
          </div>
        )}

        {/* Settings tab */}
        {tab === 'settings' && (
          <div role="tabpanel">
            <Settings
              history={history}
              onClearHistory={() => setHistory([])}
              largeText={largeText}
              onLargeTextChange={setLargeText}
              highContrast={highContrast}
              onHighContrastChange={setHighContrast}
            />
          </div>
        )}

        <footer className="footer">
          <div>Free · No account · No data collection · Works offline after first load</div>
        </footer>
      </div>

      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  )
}