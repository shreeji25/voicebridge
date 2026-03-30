// pages/index.js
// VoiceBridge — Upgraded Main Page
// Features: Conversation Mode, Quick Phrases, Auto-Speak, Accessibility Mode, Offline Indicator

import { useState, useEffect } from 'react'
import Head                    from 'next/head'
import LanguageSelector        from '../components/LanguageSelector'
import QuickPhrases            from '../components/QuickPhrases'
import dynamic                 from 'next/dynamic'

const VoiceToText  = dynamic(() => import('../components/VoiceToText'),  { ssr: false })
const TextToSpeech = dynamic(() => import('../components/TextToSpeech'), { ssr: false })
const History      = dynamic(() => import('../components/History'),      { ssr: false })

// ── Tab definitions ────────────────────────────────────────────────────────
const TABS = [
  { id: 'convo', label: 'Conversation',   icon: '💬' },
  { id: 'type',  label: 'Text to Speech', icon: '⌨️' },
  { id: 'voice', label: 'Voice to Text',  icon: '🎤' },
]

export default function Home() {
  const [langCode,    setLangCode]    = useState('en-US')
  const [activeTab,   setActiveTab]   = useState('convo')
  const [history,     setHistory]     = useState([])
  const [isOnline,    setIsOnline]    = useState(true)
  const [bigMode,     setBigMode]     = useState(false)
  const [hiContrast,  setHiContrast]  = useState(false)

  // ── Network detection ────────────────────────────────────────────────────
  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine)
    update()
    window.addEventListener('online',  update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online',  update)
      window.removeEventListener('offline', update)
    }
  }, [])

  // ── Add message to shared history ────────────────────────────────────────
  const handleAddToHistory = (item) => {
    setHistory(prev => [...prev, { ...item, timestamp: new Date() }])
  }

  // ── Accessibility class string ───────────────────────────────────────────
  const appClass = [
    'page',
    bigMode    ? 'big-mode'     : '',
    hiContrast ? 'high-contrast': '',
  ].filter(Boolean).join(' ')

  return (
    <>
      <Head>
        <title>VoiceBridge — Assistive Communication</title>
        <meta name="description" content="Free assistive communication tool — voice to text, text to speech. Supports English, Hindi, Gujarati." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0f1e" />
      </Head>

      {/* Decorative background orbs */}
      <div className="bg-orb bg-orb-1" aria-hidden="true" />
      <div className="bg-orb bg-orb-2" aria-hidden="true" />
      <div className="bg-orb bg-orb-3" aria-hidden="true" />

      <main className={appClass} role="main">

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <header className="header">
          <div className="logo">
            <div className="logo-icon" aria-hidden="true">🗣️</div>
            <span className="logo-text">VoiceBridge</span>
          </div>
          <p className="tagline">
            Assistive communication for everyone — speak to see text, type to hear speech.
            <br />
            <span style={{ fontSize: 12, opacity: 0.6 }}>
              Free · No account needed · Works offline · English, Hindi &amp; Gujarati
            </span>
          </p>

          {/* Accessibility toggles */}
          <div className="a11y-bar">
            <button
              className={`a11y-btn ${bigMode ? 'on' : ''}`}
              onClick={() => setBigMode(v => !v)}
              title="Toggle large text"
            >
              🔡 Large Text
            </button>
            <button
              className={`a11y-btn ${hiContrast ? 'on' : ''}`}
              onClick={() => setHiContrast(v => !v)}
              title="Toggle high contrast"
            >
              ◑ High Contrast
            </button>
          </div>
        </header>

        {/* ── OFFLINE / ONLINE INDICATOR ──────────────────────────────────── */}
        <div className={`net-status ${isOnline ? 'online' : 'offline'}`} aria-live="polite">
          <span className="net-dot" />
          {isOnline
            ? '🟢 Online — all features available'
            : '🔵 Offline Ready — text-to-speech still works'}
        </div>

        {/* ── LANGUAGE SELECTOR ───────────────────────────────────────────── */}
        <LanguageSelector selected={langCode} onChange={setLangCode} />

        {/* ── TAB BAR ─────────────────────────────────────────────────────── */}
        <div className="mode-tabs" role="tablist" aria-label="Communication mode">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`mode-tab ${activeTab === t.id ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === t.id}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── TAB PANELS ──────────────────────────────────────────────────── */}
        <div role="tabpanel">

          {/* CONVERSATION tab — chat-style UI */}
          {activeTab === 'convo' && (
            <div className="card">
              <div className="card-title"><span>💬</span> Conversation Mode</div>

              {/* Conversation history rendered as chat bubbles */}
              <History
                items={history}
                langCode={langCode}
                onClear={() => setHistory([])}
                chatMode
              />

              {/* Input tools for conversation */}
              <div style={{ marginTop: 16 }}>
                <TextToSpeech
                  langCode={langCode}
                  onAddToHistory={handleAddToHistory}
                  conversationMode
                />
              </div>

              {/* Quick phrases available directly in conversation tab */}
              <div style={{ marginTop: 16 }}>
                <QuickPhrases
                  langCode={langCode}
                  onAddToHistory={handleAddToHistory}
                />
              </div>
            </div>
          )}

          {/* TEXT TO SPEECH tab */}
          {activeTab === 'type' && (
            <div className="card">
              <div className="card-title"><span>⌨️</span> Type → Read Aloud</div>
              <TextToSpeech
                langCode={langCode}
                onAddToHistory={handleAddToHistory}
              />
              <div style={{ marginTop: 20 }}>
                <QuickPhrases
                  langCode={langCode}
                  onAddToHistory={handleAddToHistory}
                />
              </div>
            </div>
          )}

          {/* VOICE TO TEXT tab */}
          {activeTab === 'voice' && (
            <div className="card">
              <div className="card-title"><span>🎤</span> Speak → Show Text</div>
              <VoiceToText
                langCode={langCode}
                onAddToHistory={handleAddToHistory}
              />
            </div>
          )}

        </div>

        {/* ── SESSION HISTORY (outside conversation tab) ──────────────────── */}
        {activeTab !== 'convo' && (
          <History
            items={history}
            langCode={langCode}
            onClear={() => setHistory([])}
          />
        )}

        {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
        <div className="card" style={{ marginTop: 8 }}>
          <div className="card-title"><span>ℹ️</span> How VoiceBridge Works</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <strong style={{ color: 'var(--text)' }}>💬 Conversation</strong> — Type a message and tap{' '}
              <em>Type → Read Aloud</em>, or tap <em>Speak → Show Text</em> to use your voice.
              Messages appear as a chat, like WhatsApp for speech.
            </div>
            <div>
              <strong style={{ color: 'var(--text)' }}>⌨️ Text to Speech</strong> — Type anything and tap{' '}
              <em>Read Aloud</em>. Enable <em>Auto-Speak</em> to have the device speak as you type.
            </div>
            <div>
              <strong style={{ color: 'var(--text)' }}>🎤 Voice to Text</strong> — Tap{' '}
              <em>Start Listening</em>, speak naturally, and your words appear on screen.
            </div>
            <div>
              <strong style={{ color: 'var(--text)' }}>⚡ Quick Phrases</strong> — Tap any phrase button to instantly
              send and speak it — no typing needed. Ideal for users who cannot type fast.
            </div>
            <div style={{ paddingTop: 4 }}>
              <span className="badge">🔒 Privacy</span>&nbsp;
              All processing happens entirely inside your browser. No audio or text is ever sent to any server.
            </div>
          </div>
        </div>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <footer className="footer">
          <div>
            Built with ❤️ using{' '}
            <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a>
            {' '}and the{' '}
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API" target="_blank" rel="noopener noreferrer">
              Web Speech API
            </a>
          </div>
          <div style={{ marginTop: 4 }}>
            100% free · No ads · No account · No data collection
          </div>
        </footer>

      </main>
    </>
  )
}