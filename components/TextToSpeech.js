// components/TextToSpeech.js
// This component lets a user TYPE text and have it spoken aloud.
// Useful for people who cannot speak — they type, and the device "speaks" for them.

import { useState } from 'react'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'

// Quick-access phrases for common communication needs
const QUICK_PHRASES = [
  { emoji: '👋', text: 'Hello, how are you?' },
  { emoji: '🙏', text: 'Thank you very much.' },
  { emoji: '🆘', text: 'I need help please.' },
  { emoji: '💊', text: 'I need my medicine.' },
  { emoji: '💧', text: 'Can I have some water?' },
  { emoji: '🚽', text: 'I need to use the bathroom.' },
  { emoji: '😌', text: 'I am feeling okay.' },
  { emoji: '😣', text: 'I am in pain.' },
  { emoji: '📞', text: 'Please call my family.' },
  { emoji: '👍', text: 'Yes, I agree.' },
  { emoji: '👎', text: 'No, I disagree.' },
  { emoji: '✋', text: 'Please wait a moment.' },
]

export default function TextToSpeech({ langCode, onAddToHistory }) {
  const [text, setText] = useState('')
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)

  const { isSpeaking, isSupported, speak, cancel } = useSpeechSynthesis()

  const handleSpeak = () => {
    if (!text.trim()) return
    speak({ text, lang: langCode, rate, pitch })
    onAddToHistory?.({ text, type: 'typed', lang: langCode })
  }

  // Clicking a quick phrase fills the text box and speaks it immediately
  const handleQuickPhrase = (phrase) => {
    setText(phrase)
    speak({ text: phrase, lang: langCode, rate, pitch })
    onAddToHistory?.({ text: phrase, type: 'quick', lang: langCode })
  }

  if (!isSupported) {
    return (
      <div className="support-banner">
        ⚠️ Text-to-speech is not supported in this browser. Please use Chrome, Edge, or Safari.
      </div>
    )
  }

  return (
    <div>
      {/* Quick Phrases — pre-built buttons for instant communication */}
      <div className="card">
        <div className="card-title"><span>⚡</span> Quick Phrases</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {QUICK_PHRASES.map((p) => (
            <button
              key={p.text}
              className="btn btn-secondary"
              style={{ fontSize: 13, padding: '8px 14px' }}
              onClick={() => handleQuickPhrase(p.text)}
              title={p.text}
            >
              {p.emoji} {p.text}
            </button>
          ))}
        </div>
      </div>

      {/* Main text input and speak controls */}
      <div className="card">
        <div className="card-title"><span>⌨️</span> Type to Speak</div>

        <div className="input-group">
          <textarea
            className="text-input"
            placeholder="Type anything here and press Speak… the device will say it aloud for you."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            aria-label="Text to speak"
            // Allow pressing Ctrl+Enter to speak
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSpeak()
            }}
          />

          {/* Voice settings: rate (speed) and pitch */}
          <div className="controls-grid">
            <div className="control-group">
              <label>
                Speed <span className="control-value">{rate.toFixed(1)}×</span>
              </label>
              <input
                type="range"
                min={0.5} max={2} step={0.1}
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                aria-label="Speech speed"
              />
            </div>
            <div className="control-group">
              <label>
                Pitch <span className="control-value">{pitch.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min={0.5} max={2} step={0.1}
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                aria-label="Speech pitch"
              />
            </div>
          </div>

          {/* Speaking indicator badge */}
          {isSpeaking && (
            <div>
              <span className="speaking-badge">
                <span className="speaking-dot" />
                Speaking…
              </span>
            </div>
          )}

          <div className="btn-row">
            <button
              className="btn btn-primary"
              onClick={handleSpeak}
              disabled={!text.trim() || isSpeaking}
            >
              🔊 Speak
            </button>

            {isSpeaking && (
              <button className="btn btn-danger" onClick={cancel}>
                ⏹ Stop
              </button>
            )}

            <button
              className="btn btn-secondary"
              onClick={() => setText('')}
              disabled={!text}
            >
              🗑 Clear
            </button>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
            Tip: Press <kbd style={{
              background: 'var(--bg-inset)',
              border: '1px solid var(--border)',
              borderRadius: 4,
              padding: '1px 5px',
              fontFamily: 'monospace',
              fontSize: 11
            }}>Ctrl+Enter</kbd> to speak quickly
          </div>
        </div>
      </div>
    </div>
  )
}