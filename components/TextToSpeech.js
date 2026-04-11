// components/TextToSpeech.js
// User TYPES in their language (fromLang) → text is TRANSLATED → spoken in toLanguage
// Designed for mute users who want to communicate with people who speak a different language

import { useState } from 'react'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { translateText } from '../lib/translate'

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

export default function TextToSpeech({ langCode, toLanguage, onAddToHistory, t }) {
  const [text, setText]                   = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [rate, setRate]                   = useState(1)
  const [pitch, setPitch]                 = useState(1)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationError, setTranslationError] = useState('')

  const { isSpeaking, isSupported, speak, cancel } = useSpeechSynthesis()

  // Determine the effective output language
  const outputLang = toLanguage || langCode

  // Translate then speak
  async function handleSpeak() {
    if (!text.trim()) return
    setTranslationError('')
    setIsTranslating(true)

    try {
      const translated = await translateText(text, langCode, outputLang)
      setTranslatedText(translated)
      speak({ text: translated, lang: outputLang, rate, pitch })
      onAddToHistory?.({
        text: `${text} → ${translated}`,
        type: 'typed',
        lang: langCode,
        translatedLang: outputLang,
      })
    } catch (err) {
      setTranslationError('Translation failed. Speaking original text.')
      speak({ text, lang: langCode, rate, pitch })
    } finally {
      setIsTranslating(false)
    }
  }

  // Quick phrases: translate from English (en) to output language then speak
  async function handleQuickPhrase(phrase) {
    setText(phrase)
    setTranslationError('')
    setIsTranslating(true)

    try {
      const translated = await translateText(phrase, 'en-US', outputLang)
      setTranslatedText(translated)
      speak({ text: translated, lang: outputLang, rate, pitch })
      onAddToHistory?.({
        text: `${phrase} → ${translated}`,
        type: 'quick',
        lang: 'en-US',
        translatedLang: outputLang,
      })
    } catch {
      setTranslatedText('')
      speak({ text: phrase, lang: langCode, rate, pitch })
    } finally {
      setIsTranslating(false)
    }
  }

  function handleClear() {
    setText('')
    setTranslatedText('')
    setTranslationError('')
    cancel()
  }

  if (!isSupported) {
    return (
      <div className="support-banner">
        ⚠️ Text-to-speech is not supported in this browser. Please use Chrome, Edge, or Safari.
      </div>
    )
  }

  const sameLanguage = langCode?.split('-')[0] === outputLang?.split('-')[0]

  return (
    <div>
      {/* Translation direction indicator */}
      {!sameLanguage && (
        <div className="tts-lang-bar">
          <span className="tts-lang-from">✍️ Type in <strong>{langCode}</strong></span>
          <span className="tts-lang-arrow">→</span>
          <span className="tts-lang-to">🔊 Speaks in <strong>{outputLang}</strong></span>
        </div>
      )}

      {/* Quick Phrases */}
      <div className="card">
        <div className="card-title"><span>⚡</span> Quick Phrases</div>
        <p className="tts-quick-note">
          {sameLanguage
            ? 'Tap a phrase to speak it instantly.'
            : `Tap a phrase — it will be translated to ${outputLang} and spoken aloud.`}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {QUICK_PHRASES.map((p) => (
            <button
              key={p.text}
              className="btn btn-secondary"
              style={{ fontSize: 13, padding: '8px 14px' }}
              onClick={() => handleQuickPhrase(p.text)}
              disabled={isTranslating || isSpeaking}
              title={p.text}
            >
              {p.emoji} {p.text}
            </button>
          ))}
        </div>
      </div>

      {/* Main input */}
      <div className="card">
        <div className="card-title"><span>⌨️</span> Type to Speak</div>

        <div className="input-group">
          <textarea
            className="text-input"
            placeholder={
              sameLanguage
                ? 'Type anything here and press Speak…'
                : `Type in ${langCode} — will be translated to ${outputLang} and spoken aloud`
            }
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setTranslatedText('')  // clear old translation when user edits
            }}
            rows={4}
            aria-label="Text to translate and speak"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSpeak()
            }}
          />

          {/* Translation preview box */}
          {!sameLanguage && (translatedText || isTranslating) && (
            <div className="tts-translation-preview">
              <span className="tts-preview-label">
                {isTranslating ? '⏳ Translating…' : `🌐 ${outputLang} translation:`}
              </span>
              {!isTranslating && (
                <span className="tts-preview-text">{translatedText}</span>
              )}
            </div>
          )}

          {translationError && (
            <div className="tts-error-note">⚠️ {translationError}</div>
          )}

          {/* Voice controls */}
          <div className="controls-grid">
            <div className="control-group">
              <label>Speed <span className="control-value">{rate.toFixed(1)}×</span></label>
              <input
                type="range" min={0.5} max={2} step={0.1}
                value={rate} onChange={(e) => setRate(parseFloat(e.target.value))}
                aria-label="Speech speed"
              />
            </div>
            <div className="control-group">
              <label>Pitch <span className="control-value">{pitch.toFixed(1)}</span></label>
              <input
                type="range" min={0.5} max={2} step={0.1}
                value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))}
                aria-label="Speech pitch"
              />
            </div>
          </div>

          {isSpeaking && (
            <div>
              <span className="speaking-badge">
                <span className="speaking-dot" />
                {sameLanguage ? 'Speaking…' : `Speaking in ${outputLang}…`}
              </span>
            </div>
          )}

          <div className="btn-row">
            <button
              className="btn btn-primary"
              onClick={handleSpeak}
              disabled={!text.trim() || isSpeaking || isTranslating}
            >
              {isTranslating ? '⏳ Translating…' : '🔊 Translate & Speak'}
            </button>

            {isSpeaking && (
              <button className="btn btn-danger" onClick={cancel}>⏹ Stop</button>
            )}

            <button
              className="btn btn-secondary"
              onClick={handleClear}
              disabled={!text && !translatedText}
            >
              🗑 Clear
            </button>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
            Tip: Press{' '}
            <kbd style={{
              background: 'var(--bg-inset)', border: '1px solid var(--border)',
              borderRadius: 4, padding: '1px 5px', fontFamily: 'monospace', fontSize: 11
            }}>Ctrl+Enter</kbd>{' '}
            to translate &amp; speak quickly
          </div>
        </div>
      </div>
    </div>
  )
}