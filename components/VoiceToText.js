// components/VoiceToText.js
// User SPEAKS in fromLang → speech is transcribed → TRANSLATED to toLanguage
// → translated text displayed + read aloud in toLanguage
// Perfect for mute/hard-of-hearing users communicating across language barriers
// FIXED: Proper translation updates, working speak functionality, user-friendly labels

import { useState, useCallback, useEffect } from 'react'
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

  // Reset form when language changes to avoid confusion
  useEffect(() => {
    setOriginalText('')
    setTranslatedText('')
    setTranslationError('')
    stopListening()
    cancel()
  }, [langCode, outputLang])

  // Translate the transcribed text then read aloud in output language
  async function handleTranslateAndSpeak() {
    if (!originalText.trim()) return
    setTranslationError('')
    setIsTranslating(true)

    try {
      let textToSpeak = originalText
      let translatedForDisplay = originalText

      if (!sameLanguage) {
        translatedForDisplay = await translateText(originalText, langCode, outputLang)
        textToSpeak = translatedForDisplay
      }

      setTranslatedText(translatedForDisplay)

      try {
        speak({ text: textToSpeak, lang: outputLang })
      } catch (speakErr) {
        console.error('Speech synthesis error:', speakErr)
        setTranslationError(t.speakError || 'Voice not available for this language')
      }

      onAddToHistory?.({
        text: sameLanguage ? originalText : `${originalText} → ${translatedForDisplay}`,
        type: 'voice',
        lang: langCode,
        translatedLang: outputLang,
        timestamp: new Date().toISOString()
      })
    } catch (err) {
      console.error('Translation error:', err)
      setTranslationError(t.translationFailed || 'Translation failed. Reading original text.')
      try {
        speak({ text: originalText, lang: langCode })
      } catch (e) {
        console.error('Fallback speak failed:', e)
      }
    } finally {
      setIsTranslating(false)
    }
  }

  // Read already-translated text aloud again (without re-translating)
  function handleReadAgain() {
    const textToSpeak = translatedText || originalText
    const langToUse   = translatedText ? outputLang : langCode
    if (!textToSpeak) return
    
    try {
      speak({ text: textToSpeak, lang: langToUse })
    } catch (err) {
      console.error('Read again error:', err)
      setTranslationError(t.speakError || 'Voice not available for this language')
    }
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
    if (textToCopy) {
      navigator.clipboard?.writeText(textToCopy).catch(err => {
        console.error('Copy failed:', err)
      })
    }
  }

  if (!isSupported) {
    return (
      <div className="support-banner">
        ⚠️ {t.vttNotSupported || "Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge."}
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
          <span className="tts-lang-from">🎤 {t.speakIn || "Speak in"} <strong>{langCode}</strong></span>
          <span className="tts-lang-arrow">→</span>
          <span className="tts-lang-to">🌐 {t.translatedTo || "Translated to"} <strong>{outputLang}</strong></span>
        </div>
      )}

      <div className="card">
        <div className="card-title">
          <span>🎤</span> 
          {t.voiceToText || "Voice → Text"}
          {!sameLanguage ? ` → ${t.translation || "Translation"}` : ''}
        </div>

        {/* Mic button */}
        <div className="mic-section">
          <button
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            onClick={isListening ? stopListening : startListening}
            aria-label={isListening ? (t.stopListeningAriaLabel || 'Stop listening') : (t.startListeningAriaLabel || 'Start listening')}
            title={isListening ? (t.clickToStop || 'Click to stop') : (t.clickToSpeak || 'Click to start speaking')}
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
              ? (t?.vttListeningLabel || `🔴 ${t.listening || "Listening"} in ${langCode}… ${t.speakNow || "speak now"}`)
              : (t?.vttIdleLabel     || t.clickMicToStart || 'Click the mic to start speaking')}
          </div>
        </div>

        <div className="divider" />

        {/* Original transcription */}
        <div
          className={`transcript-box ${originalText || interimText ? 'has-text' : ''}`}
          role="region"
          aria-label={t.originalTranscriptionAriaLabel || "Original transcription"}
          aria-live="polite"
        >
          {!originalText && !interimText ? (
            <div className="transcript-placeholder">
              {t?.vttPlaceholder || t.spokenWordsAppear || 'Your spoken words will appear here…'}
            </div>
          ) : (
            <>
              <div className="vtt-section-label">
                {sameLanguage ? (t.transcription || "Transcription") : `${t.original || "Original"} (${langCode})`}
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
                ? (t.translating || '⏳ Translating…')
                : `🌐 ${t.translation || "Translation"} (${outputLang})`}
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
            title={sameLanguage ? (t.readAloudTitle || 'Read aloud') : (t.translateAndReadTitle || 'Translate and read aloud in output language')}
          >
            {isTranslating
              ? (t.translating || '⏳ Translating…')
              : isSpeaking
              ? (t.speaking || '🔊 Speaking…')
              : sameLanguage
              ? (t.readAloud || '🔊 Read Aloud')
              : (t.translateAndRead || '🌐 Translate & Read Aloud')}
          </button>

          {/* Re-read already translated text */}
          {translatedText && !isSpeaking && (
            <button
              className="btn btn-secondary"
              onClick={handleReadAgain}
              title={t.readAgainTitle || "Read the translation aloud again"}
            >
              🔁 {t.readAgain || "Read Again"}
            </button>
          )}

          {isSpeaking && (
            <button className="btn btn-danger" onClick={cancel}>
              ⏹ {t.stop || "Stop"}
            </button>
          )}

          <button
            className="btn btn-secondary"
            onClick={handleCopy}
            disabled={!originalText && !translatedText}
            title={translatedText ? (t.copyTranslationTitle || 'Copy translated text') : (t.copyTitle || 'Copy transcribed text')}
          >
            📋 {translatedText ? (t.copyTranslation || 'Copy Translation') : (t.copy || 'Copy')}
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleClear}
            disabled={!originalText && !interimText}
            title={t.clearTitle || "Clear all text"}
          >
            🗑 {t.clear || "Clear"}
          </button>
        </div>

        {/* Usage hint */}
        {!sameLanguage && !originalText && (
          <p className="vtt-hint">
            💡 {t.speakIn || "Speak in"} <strong>{langCode}</strong> — {t.appWillTranslate || "the app will translate and read it aloud in"} <strong>{outputLang}</strong> {t.forTheOther || "for the other person."}}
          </p>
        )}
      </div>
    </div>
  )
}