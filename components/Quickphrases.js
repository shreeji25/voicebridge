// components/QuickPhrases.js
// 8 one-tap phrase buttons in a clean 2-column grid.
// Each tap speaks the phrase immediately and adds it to history.
// Shows a brief green highlight when spoken.

import { useState } from 'react'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'

const PHRASES = [
  { emoji: '🆘', text: 'I need help' },
  { emoji: '💧', text: 'I am thirsty' },
  { emoji: '✋', text: 'Please wait' },
  { emoji: '📋', text: 'Call doctor' },
  { emoji: '😣', text: 'I am in pain' },
  { emoji: '🙏', text: 'Thank you' },
  { emoji: '😴', text: 'I want to sleep' },
  { emoji: '🍽️', text: 'I am hungry' },
]

export default function QuickPhrases({ langCode, onAddToHistory, t }) {
  const [activeIdx, setActiveIdx] = useState(null)
  const { speak } = useSpeechSynthesis()

  const phrases = (t && t.qpPhrases) ? t.qpPhrases : PHRASES

  const handlePhrase = (phrase, idx) => {
    speak({ text: phrase.text, lang: langCode })
    onAddToHistory?.({ text: phrase.text, type: 'quick', lang: langCode })
    setActiveIdx(idx)
    setTimeout(() => setActiveIdx(null), 900)
  }

  return (
    <div className="card qp-card">
      <div className="card-title">
        <span>⚡</span> Quick phrases — tap to speak instantly
      </div>
      <div className="qp-grid">
        {phrases.map((p, i) => (
          <button
            key={p.text}
            className={`qp-btn ${activeIdx === i ? 'qp-spoken' : ''}`}
            onClick={() => handlePhrase(p, i)}
            aria-label={`Speak: ${p.text}`}
          >
            <span className="qp-emoji">{p.emoji}</span>
            <span className="qp-text">{p.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}