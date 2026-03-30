// pages/index.js
// The main page of VoiceBridge.
// Composes all components together and manages shared state (language, history, active tab).

import { useState }       from 'react'
import Head               from 'next/head'
import LanguageSelector   from '../components/LanguageSelector'
import dynamic from "next/dynamic";

const VoiceToText = dynamic(() => import("../components/VoiceToText"), {
  ssr: false,
});
const TextToSpeech = dynamic(() => import("../components/TextToSpeech"), {
  ssr: false,
});
const History = dynamic(() => import("../components/History"), {
  ssr: false,
});

// The two main modes of the app
const MODES = [
  { id: 'voice', label: 'Voice → Text', icon: '🎤', desc: 'Speak and see text' },
  { id: 'type',  label: 'Type → Speech', icon: '⌨️', desc: 'Type and hear speech' },
]

export default function Home() {
  // Currently selected language code (BCP-47 format)
  const [langCode, setLangCode]   = useState('en-US')
  // Active mode tab: 'voice' or 'type'
  const [mode, setMode]           = useState('voice')
  // Shared history of all communications this session
  const [history, setHistory]     = useState([])

  // Called by child components whenever a message is produced
  const handleAddToHistory = (item) => {
    setHistory(prev => [
      ...prev,
      { ...item, timestamp: new Date() }
    ])
  }

  return (
    <>
      {/* Page metadata for SEO and browser tab */}
      <Head>
        <title>VoiceBridge — Assistive Communication</title>
        <meta name="description" content="Free assistive communication tool using voice-to-text and text-to-speech. Supports English, Hindi, and Gujarati." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Decorative background orbs */}
      <div className="bg-orb bg-orb-1" aria-hidden="true" />
      <div className="bg-orb bg-orb-2" aria-hidden="true" />
      <div className="bg-orb bg-orb-3" aria-hidden="true" />

      <main className="page" role="main">

        {/* ── HEADER ── */}
        <header className="header">
          <div className="logo">
            <div className="logo-icon" aria-hidden="true">🗣️</div>
            <span className="logo-text">VoiceBridge</span>
          </div>
          <p className="tagline">
            Assistive communication for everyone — speak to see text, type to hear speech.
            <br />
            <span style={{ fontSize: 12, opacity: 0.6 }}>
              Free · No account needed · Works offline · Supports English, Hindi &amp; Gujarati
            </span>
          </p>
        </header>

        {/* ── LANGUAGE SELECTION ── */}
        <LanguageSelector
          selected={langCode}
          onChange={setLangCode}
        />

        {/* ── MODE TABS ── */}
        <div className="mode-tabs" role="tablist" aria-label="Communication mode">
          {MODES.map((m) => (
            <button
              key={m.id}
              className={`mode-tab ${mode === m.id ? 'active' : ''}`}
              role="tab"
              aria-selected={mode === m.id}
              onClick={() => setMode(m.id)}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* ── ACTIVE MODE PANEL ── */}
        <div role="tabpanel">
          {mode === 'voice' ? (
            <VoiceToText
              langCode={langCode}
              onAddToHistory={handleAddToHistory}
            />
          ) : (
            <TextToSpeech
              langCode={langCode}
              onAddToHistory={handleAddToHistory}
            />
          )}
        </div>

        {/* ── SESSION HISTORY ── */}
        <History
          items={history}
          langCode={langCode}
          onClear={() => setHistory([])}
        />

        {/* ── HOW IT WORKS (static info section) ── */}
        <div className="card" style={{ marginTop: 8 }}>
          <div className="card-title"><span>ℹ️</span> How VoiceBridge Works</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <strong style={{ color: 'var(--text)' }}>🎤 Voice → Text</strong> — Click the microphone, speak naturally.
              Your words appear on screen in real-time. Then press <em>Read Aloud</em> for the device to repeat them.
            </div>
            <div>
              <strong style={{ color: 'var(--text)' }}>⌨️ Type → Speech</strong> — Type any message (or tap a Quick Phrase)
              and press <em>Speak</em>. The device says it aloud — perfect for people who cannot speak.
            </div>
            <div>
              <strong style={{ color: 'var(--text)' }}>📋 History</strong> — Every message is saved in your session.
              Tap any history item to repeat it.
            </div>
            <div style={{ paddingTop: 4 }}>
              <span className="badge">🔒 Privacy</span> &nbsp;
              All processing happens entirely inside your browser. No audio or text is ever sent to any server.
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div>
            Built with ❤️ using{' '}
            <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a>
            {' '}and the{' '}
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API" target="_blank" rel="noopener noreferrer">Web Speech API</a>
          </div>
          <div style={{ marginTop: 4 }}>
            100% free · No ads · No account · No data collection
          </div>
        </footer>

      </main>
    </>
  )
}