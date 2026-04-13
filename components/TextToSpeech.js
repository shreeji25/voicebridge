// components/TextToSpeech.js
// User TYPES in their language (fromLang) → text is TRANSLATED → spoken in toLanguage
// Designed for mute users who want to communicate with people who speak a different language
// FIXED: Proper translation updates, working speak functionality, user-friendly labels

import { useState, useEffect } from 'react'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { translateText } from '../lib/translate'

const QUICK_PHRASES_EN = [
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
  const [quickPhrasesTranslated, setQuickPhrasesTranslated] = useState(QUICK_PHRASES_EN)

  const { isSpeaking, isSupported, speak, cancel } = useSpeechSynthesis()

  // Determine the effective output language
  const outputLang = toLanguage || langCode
  const sameLanguage = langCode?.split('-')[0] === outputLang?.split('-')[0]

  // ── Translate quick phrases when languages change ──────────────────
  useEffect(() => {
    async function translateQuickPhrases() {
      if (sameLanguage) {
        setQuickPhrasesTranslated(QUICK_PHRASES_EN)
        return
      }

      try {
        const translated = await Promise.all(
          QUICK_PHRASES_EN.map(async (p) => ({
            ...p,
            translatedText: await translateText(p.text, 'en-US', outputLang)
          }))
        )
        setQuickPhrasesTranslated(translated)
      } catch (err) {
        console.error('Quick phrases translation failed:', err)
        setQuickPhrasesTranslated(QUICK_PHRASES_EN)
      }
    }

    translateQuickPhrases()
  }, [outputLang, sameLanguage])

  // Translate then speak
  async function handleSpeak() {
    if (!text.trim()) return
    setTranslationError('')
    setIsTranslating(true)

    try {
      // If same language, don't translate
      let textToSpeak = text
      let translatedForDisplay = text

      if (!sameLanguage) {
        translatedForDisplay = await translateText(text, langCode, outputLang)
        textToSpeak = translatedForDisplay
      }

      setTranslatedText(translatedForDisplay)
      
      // Use Web Speech API with proper error handling
      try {
        speak({ text: textToSpeak, lang: outputLang, rate, pitch })
      } catch (speakErr) {
        console.error('Speech synthesis error:', speakErr)
        setTranslationError(t.speakError || 'Voice not available for this language')
      }

      onAddToHistory?.({
        text: sameLanguage ? text : `${text} → ${translatedForDisplay}`,
        type: 'typed',
        lang: langCode,
        translatedLang: outputLang,
        timestamp: new Date().toISOString()
      })
    } catch (err) {
      console.error('Translation error:', err)
      setTranslationError(t.translationFailed || 'Translation failed. Speaking original text.')
      try {
        speak({ text, lang: langCode, rate, pitch })
      } catch (e) {
        console.error('Fallback speak failed:', e)
      }
    } finally {
      setIsTranslating(false)
    }
  }

  // Quick phrases: translate then speak
  async function handleQuickPhrase(phrase) {
    setText(phrase)
    setTranslationError('')
    setIsTranslating(true)

    try {
      let textToSpeak = phrase
      let translatedForDisplay = phrase

      if (!sameLanguage) {
        translatedForDisplay = await translateText(phrase, 'en-US', outputLang)
        textToSpeak = translatedForDisplay
      }

      setTranslatedText(translatedForDisplay)
      
      try {
        speak({ text: textToSpeak, lang: outputLang, rate, pitch })
      } catch (speakErr) {
        console.error('Quick phrase speak error:', speakErr)
      }

      onAddToHistory?.({
        text: sameLanguage ? phrase : `${phrase} → ${translatedForDisplay}`,
        type: 'quick',
        lang: 'en-US',
        translatedLang: outputLang,
        timestamp: new Date().toISOString()
      })
    } catch (err) {
      console.error('Quick phrase translation failed:', err)
      setTranslatedText('')
      try {
        speak({ text: phrase, lang: langCode, rate, pitch })
      } catch (e) {
        console.error('Fallback quick phrase speak failed:', e)
      }
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
        ⚠️ {t.ttsNotSupported || "Text-to-speech is not supported in this browser. Please use Chrome, Edge, or Safari."}
      </div>
    )
  }

  return (
    <div>
      {/* Translation direction indicator */}
      {!sameLanguage && (
        <div className="tts-lang-bar">
          <span className="tts-lang-from">✍️ {t.typeIn || "Type in"} <strong>{langCode}</strong></span>
          <span className="tts-lang-arrow">→</span>
          <span className="tts-lang-to">🔊 {t.speaksIn || "Speaks in"} <strong>{outputLang}</strong></span>
        </div>
      )}

      {/* Quick Phrases */}
      <div className="card">
        <div className="card-title"><span>⚡</span> {t.quickPhrases || "Quick Phrases"}</div>
        <p className="tts-quick-note">
          {sameLanguage
            ? t.tapToSpeak || 'Tap a phrase to speak it instantly.'
            : t.phraseWillTranslate || `Tap a phrase — it will be translated to ${outputLang} and spoken aloud.`}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {quickPhrasesTranslated.map((p, idx) => (
            <button
              key={idx}
              className="btn btn-secondary"
              style={{ fontSize: 13, padding: '8px 14px' }}
              onClick={() => handleQuickPhrase(p.text)}
              disabled={isTranslating || isSpeaking}
              title={sameLanguage ? p.text : `${p.text} → ${p.translatedText || p.text}`}
            >
              {p.emoji} {sameLanguage ? p.text : (p.translatedText || p.text)}
            </button>
          ))}
        </div>
      </div>

      {/* Main input */}
      <div className="card">
        <div className="card-title"><span>⌨️</span> {t.typeToSpeak || "Type to Speak"}</div>

        <div className="input-group">
          <textarea
            className="text-input"
            placeholder={
              sameLanguage
                ? t.typeAnything || 'Type anything here and press Speak…'
                : t.typeToTranslate || `Type in ${langCode} — will be translated to ${outputLang} and spoken aloud`
            }
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setTranslatedText('')
            }}
            rows={4}
            aria-label={t.typeToSpeakAriaLabel || "Text to translate and speak"}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSpeak()
            }}
          />

          {/* Translation preview box */}
          {!sameLanguage && (translatedText || isTranslating) && (
            <div className="tts-translation-preview">
              <span className="tts-preview-label">
                {isTranslating ? t.translating || '⏳ Translating…' : `🌐 ${outputLang} ${t.translation || "translation"}:`}
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
              <label>{t.speed || "Speed"} <span className="control-value">{rate.toFixed(1)}×</span></label>
              <input
                type="range" min={0.5} max={2} step={0.1}
                value={rate} onChange={(e) => setRate(parseFloat(e.target.value))}
                aria-label={t.speedAriaLabel || "Speech speed"}
              />
            </div>
            <div className="control-group">
              <label>{t.pitch || "Pitch"} <span className="control-value">{pitch.toFixed(1)}</span></label>
              <input
                type="range" min={0.5} max={2} step={0.1}
                value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))}
                aria-label={t.pitchAriaLabel || "Speech pitch"}
              />
            </div>
          </div>

          {isSpeaking && (
            <div>
              <span className="speaking-badge">
                <span className="speaking-dot" />
                {sameLanguage ? (t.speaking || 'Speaking…') : `${t.speakingIn || "Speaking in"} ${outputLang}…`}
              </span>
            </div>
          )}

          <div className="btn-row">
            <button
              className="btn btn-primary"
              onClick={handleSpeak}
              disabled={!text.trim() || isSpeaking || isTranslating}
              title={t.translateAndSpeakTitle || "Translate and speak the text"}
            >
              {isTranslating ? (t.translating || '⏳ Translating…') : (sameLanguage ? (t.speak || '🔊 Speak') : (t.translateAndSpeak || '🔊 Translate & Speak'))}
            </button>

            {isSpeaking && (
              <button className="btn btn-danger" onClick={cancel}>
                ⏹ {t.stop || "Stop"}
              </button>
            )}

            <button
              className="btn btn-secondary"
              onClick={handleClear}
              disabled={!text && !translatedText}
              title={t.clearTitle || "Clear all text"}
            >
              🗑 {t.clear || "Clear"}
            </button>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
            {t.keyboardTip || "Tip:"} {' '}
            <kbd style={{
              background: 'var(--bg-inset)', border: '1px solid var(--border)',
              borderRadius: 4, padding: '1px 5px', fontFamily: 'monospace', fontSize: 11
            }}>Ctrl+Enter</kbd>{' '}
            {t.keyboardTipText || "to translate & speak quickly"}
          </div>
        </div>
      </div>
    </div>
  )
}