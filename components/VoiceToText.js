// components/VoiceToText.js
// User SPEAKS in fromLang → speech is transcribed → TRANSLATED to toLanguage
// → translated text displayed + read aloud in toLanguage
// Perfect for mute/hard-of-hearing users communicating across language barriers

import { useState, useCallback } from 'react'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useSpeechSynthesis }   from '../hooks/useSpeechSynthesis'
import { translateText }        from '../lib/translate'

export default function VoiceToText({ langCode, toLanguage, onAddToHistory, t }) {
  const [originalText, setOriginalText]     = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [isTranslating, setIsTranslating]   = useState(false)
  const [translationError, setTranslationError] = useState('')

  const outputLang   = toLanguage || langCode
  const sameLanguage = langCode?.split('-')[0] === outputLang?.split('-')[0]

  // Called when speech recognition gives a confirmed result
  const handleResult = useCallback((text) => {
    setOriginalText(prev => prev ? `${prev} ${text}` : text)
    setTranslatedText('')  // clear old translation when new speech comes in
  }, [])

  const { isListening, interimText, error, isSupported, startListening, stopListening } =
    useSpeechRecognition({ langCode, onResult: handleResult })

  const { isSpeaking, speak, cancel } = useSpeechSynthesis()

  // Translate the transcribed text then read aloud in output language
  async function handleTranslateAndSpeak() {
    if (!originalText.trim()) return
    setTranslationError('')
    setIsTranslating(true)

    try {
      const translated = sameLanguage
        ? originalText
        : await translateText(originalText, langCode, outputLang)

      setTranslatedText(translated)
      speak({ text: translated, lang: outputLang })

      onAddToHistory?.({
        text: sameLanguage ? originalText : `${originalText} → ${translated}`,
        type: 'voice',
        lang: langCode,
        translatedLang: outputLang,
      })
    } catch (err) {
      setTranslationError('Translation failed. Reading original text.')
      speak({ text: originalText, lang: langCode })
    } finally {
      setIsTranslating(false)
    }
  }

  // Read already-translated text aloud again (without re-translating)
  function handleReadAgain() {
    const textToSpeak = translatedText || originalText
    const langToUse   = translatedText ? outputLang : langCode
    if (!textToSpeak) return
    speak({ text: textToSpeak, lang: langToUse })
  }

  function handleClear() {
    stopListening()
    cancel()
    setOriginalText('')
    setTranslatedText('')
    setTranslationError('')
  }

  function handleCopy() {
    const textToCopy = translatedText || originalText
    if (textToCopy) navigator.clipboard?.writeText(textToCopy)
  }

  if (!isSupported) {
    return (
      <div className="support-banner">
        ⚠️ Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.
      </div>
    )
  }

  return (
    <div>
      {/* Error display */}
      {error && (
        <div className="error-banner" role="alert">
          <span>⚠️</span><span>{error}</span>
        </div>
      )}

      {/* Translation direction bar */}
      {!sameLanguage && (
        <div className="tts-lang-bar">
          <span className="tts-lang-from">🎤 Speak in <strong>{langCode}</strong></span>
          <span className="tts-lang-arrow">→</span>
          <span className="tts-lang-to">🌐 Translated to <strong>{outputLang}</strong></span>
        </div>
      )}

      <div className="card">
        <div className="card-title"><span>🎤</span> Voice → Text{!sameLanguage ? ' → Translation' : ''}</div>

        {/* Mic button */}
        <div className="mic-section">
          <button
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            onClick={isListening ? stopListening : startListening}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
            title={isListening ? 'Click to stop' : 'Click to start speaking'}
          >
            {isListening ? '⏹️' : '🎤'}
          </button>

          <div className={`wave-container ${isListening ? 'visible' : ''}`}>
            {[...Array(7)].map((_, i) => (
              <div key={i} className="wave-bar" />
            ))}
          </div>

          <div className={`mic-label ${isListening ? 'active' : ''}`}>
            {isListening
              ? (t?.vttListeningLabel || `🔴 Listening in ${langCode}… speak now`)
              : (t?.vttIdleLabel     || 'Click the mic to start speaking')}
          </div>
        </div>

        <div className="divider" />

        {/* Original transcription */}
        <div
          className={`transcript-box ${originalText || interimText ? 'has-text' : ''}`}
          role="region"
          aria-label="Original transcription"
          aria-live="polite"
        >
          {!originalText && !interimText ? (
            <div className="transcript-placeholder">
              {t?.vttPlaceholder || 'Your spoken words will appear here…'}
            </div>
          ) : (
            <>
              <div className="vtt-section-label">
                {sameLanguage ? 'Transcription' : `Original (${langCode})`}
              </div>
              <span className="final-text">{originalText}</span>
              {interimText && (
                <span className="interim-text"> {interimText}</span>
              )}
            </>
          )}
        </div>

        {/* Translated output — shown after translation */}
        {!sameLanguage && (translatedText || isTranslating) && (
          <div className="vtt-translation-box">
            <div className="vtt-translation-label">
              {isTranslating
                ? '⏳ Translating…'
                : `🌐 Translation (${outputLang})`}
            </div>
            {!isTranslating && (
              <div className="vtt-translation-text">{translatedText}</div>
            )}
          </div>
        )}

        {translationError && (
          <div className="tts-error-note">⚠️ {translationError}</div>
        )}

        {/* Action buttons */}
        <div className="btn-row" style={{ marginTop: 16 }}>
          {/* Primary action: translate then speak */}
          <button
            className="btn btn-primary"
            onClick={handleTranslateAndSpeak}
            disabled={!originalText || isSpeaking || isTranslating}
            title={sameLanguage ? 'Read aloud' : 'Translate and read aloud in output language'}
          >
            {isTranslating
              ? '⏳ Translating…'
              : isSpeaking
              ? '🔊 Speaking…'
              : sameLanguage
              ? '🔊 Read Aloud'
              : '🌐 Translate & Read Aloud'}
          </button>

          {/* Re-read already translated text */}
          {translatedText && !isSpeaking && (
            <button
              className="btn btn-secondary"
              onClick={handleReadAgain}
              title="Read the translation aloud again"
            >
              🔁 Read Again
            </button>
          )}

          {isSpeaking && (
            <button className="btn btn-danger" onClick={cancel}>⏹ Stop</button>
          )}

          <button
            className="btn btn-secondary"
            onClick={handleCopy}
            disabled={!originalText && !translatedText}
            title={translatedText ? 'Copy translated text' : 'Copy transcribed text'}
          >
            📋 {translatedText ? 'Copy Translation' : 'Copy'}
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleClear}
            disabled={!originalText && !interimText}
          >
            🗑 Clear
          </button>
        </div>

        {/* Usage hint */}
        {!sameLanguage && !originalText && (
          <p className="vtt-hint">
            💡 Speak in <strong>{langCode}</strong> — the app will translate and read it aloud in <strong>{outputLang}</strong> for the other person.
          </p>
        )}
      </div>
    </div>
  )
}