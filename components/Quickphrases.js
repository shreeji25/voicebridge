// components/QuickPhrases.js
// One-tap phrase buttons — no typing needed.
// Instantly sends the phrase to History and speaks it aloud.
// Used in Conversation tab, Text-to-Speech tab.

import { useState } from 'react'

// ── Default phrase bank (emoji + text) ────────────────────────────────────
const DEFAULT_PHRASES = [
  { emoji: '🆘', text: 'I need help' },
  { emoji: '💧', text: 'I am thirsty' },
  { emoji: '✋', text: 'Please wait' },
  { emoji: '🏥', text: 'Call doctor' },
  { emoji: '😣', text: 'I am in pain' },
  { emoji: '🙏', text: 'Thank you' },
  { emoji: '😴', text: 'I want to sleep' },
  { emoji: '🍽️', text: 'I am hungry' },
]

export default function QuickPhrases({ langCode, onAddToHistory }) {
  const [lastSpoken, setLastSpoken] = useState(null)

  const handlePhrase = (phrase) => {
    // ── Speak it ────────────────────────────────────────────────────────
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(phrase.text)
      u.lang = langCode
      u.rate = 0.95
      window.speechSynthesis.speak(u)
    }

    // ── Add to shared session history ────────────────────────────────────
    if (onAddToHistory) {
      onAddToHistory({
        type:    'quick',
        text:    phrase.text,
        emoji:   phrase.emoji,
        source:  'quick-phrase',
      })
    }

    // ── Brief highlight feedback ─────────────────────────────────────────
    setLastSpoken(phrase.text)
    setTimeout(() => setLastSpoken(null), 1200)
  }

  return (
    <div className="quick-phrases-wrap">
      <div className="card-title" style={{ marginBottom: 10 }}>
        <span>⚡</span> Quick Phrases — tap to speak instantly
      </div>
      <div className="quick-grid">
        {DEFAULT_PHRASES.map((p) => (
          <button
            key={p.text}
            className={`quick-btn ${lastSpoken === p.text ? 'spoken' : ''}`}
            onClick={() => handlePhrase(p)}
            aria-label={`Say: ${p.text}`}
          >
            <span className="quick-emoji">{p.emoji}</span>
            <span className="quick-text">{p.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}