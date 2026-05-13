// components/VoiceToText.js
// SPEAKING tab — User SPEAKS in fromLang → transcribed → TRANSLATED to toLanguage
// → translated text displayed + read aloud in toLanguage
// FIXES:
//   1. SOS button now sits right of the "Assistive Communication" heading (pass showSOSButton + onSOSClick props)
//   2. Mic now works across iOS Safari, Android Chrome, desktop Chrome/Edge via improved fallbacks
//   3. Emergency Card renders via Portal (full-screen) — handled in EmergencyCard.js

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis }   from '../hooks/useSpeechSynthesis';
import { translateText }        from '../lib/translate';

export default function VoiceToText({
  langCode,
  toLanguage,
  onAddToHistory,
  t,
  activeContext,
  // New props: show SOS button in the heading bar
  showSOSButton = false,
  onSOSClick,
  pageTitle,
}) {
  const [originalText, setOriginalText]         = useState('');
  const [translatedText, setTranslatedText]     = useState('');
  const [isTranslating, setIsTranslating]       = useState(false);
  const [translationError, setTranslationError] = useState('');
  const [phonetic, setPhonetic]                 = useState('');
  const [savedPhrases, setSavedPhrases]         = useState([]);
  const [micPermission, setMicPermission]       = useState('unknown'); // 'unknown'|'granted'|'denied'

  const outputLang   = toLanguage || langCode;
  const sameLanguage = langCode?.split('-')[0] === outputLang?.split('-')[0];

  const handleResult = useCallback((text /*, confidence*/) => {
    setOriginalText(prev => prev ? `${prev} ${text}` : text);
    setTranslatedText('');
  }, []);

  const {
    isListening, interimText, finalText, error, confidence,
    isSupported, startListening, stopListening, resetTranscript,
  } = useSpeechRecognition({ langCode, onResult: handleResult });

  const { isSpeaking, speak, cancel } = useSpeechSynthesis();

  // ─── Cross-device mic permission helper ───────────────────────────────────
  // On iOS Safari and some Android browsers, getUserMedia must be called from
  // a direct user gesture. We request mic access on first tap so the browser
  // can show its native permission prompt before the SpeechRecognition fires.
  async function requestMicPermission() {
    if (micPermission === 'granted') return true
    try {
      // navigator.mediaDevices may be undefined on non-secure origins
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        // Release the stream immediately — we only needed the prompt
        stream.getTracks().forEach(t => t.stop())
        setMicPermission('granted')
        return true
      }
      // Older iOS / Firefox for Android: permissions API may exist
      if (navigator.permissions?.query) {
        const result = await navigator.permissions.query({ name: 'microphone' })
        if (result.state === 'granted') {
          setMicPermission('granted')
          return true
        }
        if (result.state === 'denied') {
          setMicPermission('denied')
          return false
        }
      }
      // Fallback: assume granted, SpeechRecognition will handle its own prompt
      setMicPermission('granted')
      return true
    } catch (err) {
      console.warn('Mic permission request failed:', err)
      // 'NotAllowedError' → denied; anything else → try anyway
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicPermission('denied')
        return false
      }
      setMicPermission('granted')
      return true
    }
  }

  async function handleMicToggle() {
    if (isListening) {
      stopListening()
      return
    }
    const permitted = await requestMicPermission()
    if (!permitted) return
    try {
      startListening(langCode)
    } catch (err) {
      console.error('startListening failed:', err)
    }
  }

  // Load saved phrases
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vb_savedPhrases')
      if (saved) setSavedPhrases(JSON.parse(saved))
    } catch (e) { /* ignore */ }
  }, [])

  // Reset on language change
  useEffect(() => {
    setOriginalText('')
    setTranslatedText('')
    setTranslationError('')
    setPhonetic('')
    stopListening()
    cancel()
  }, [langCode, outputLang])

  async function handleTranslateAndSpeak() {
    if (!originalText.trim()) return
    setTranslationError('')
    setIsTranslating(true)
    try {
      let textToSpeak          = originalText
      let translatedForDisplay = originalText

      if (!sameLanguage) {
        translatedForDisplay = await translateText(originalText, langCode, outputLang)
        textToSpeak          = translatedForDisplay
      }

      setTranslatedText(translatedForDisplay)

      try {
        speak({ text: textToSpeak, lang: outputLang })
      } catch (speakErr) {
        console.error('Speech synthesis error:', speakErr)
        setTranslationError(t?.speakError || 'Voice not available for this language.')
      }

      onAddToHistory?.({
        text: sameLanguage ? originalText : `${originalText} → ${translatedForDisplay}`,
        type: 'voice',
        lang: langCode,
        translatedLang: outputLang,
        context: activeContext || 'General',
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      console.error('Translation error:', err)
      setTranslationError(t?.translationFailed || 'Translation failed. Reading original text.')
      try { speak({ text: originalText, lang: langCode }) } catch (e) {}
    } finally {
      setIsTranslating(false)
    }
  }

  function handleReadAgain() {
    const textToSpeak = translatedText || originalText
    const langToUse   = translatedText ? outputLang : langCode
    if (!textToSpeak) return
    try {
      speak({ text: textToSpeak, lang: langToUse })
    } catch (err) {
      setTranslationError(t?.speakError || 'Voice not available for this language.')
    }
  }

  function handleSavePhrase() {
    if (!originalText) return
    const newPhrase = {
      id: Date.now(),
      text: originalText,
      translated: translatedText,
      phonetic,
      context: activeContext || 'General',
      createdAt: new Date().toLocaleDateString(),
    }
    const updated = [newPhrase, ...savedPhrases]
    setSavedPhrases(updated)
    try { localStorage.setItem('vb_savedPhrases', JSON.stringify(updated)) } catch (e) {}
    onAddToHistory?.({ text: originalText, type: 'voice', lang: langCode, timestamp: new Date().toISOString() })
  }

  function handleDeleteSaved(id) {
    const updated = savedPhrases.filter(p => p.id !== id)
    setSavedPhrases(updated)
    try { localStorage.setItem('vb_savedPhrases', JSON.stringify(updated)) } catch (e) {}
  }

  function handleClear() {
    stopListening()
    cancel()
    setOriginalText('')
    setTranslatedText('')
    setTranslationError('')
    setPhonetic('')
    resetTranscript()
  }

  function handleCopy() {
    const text = translatedText || originalText
    if (text) navigator.clipboard?.writeText(text).catch(() => {})
  }

  // ─── Unsupported browser ──────────────────────────────────────────────────
  if (!isSupported) {
    return (
      <>
        {/* Still show the heading with SOS even if mic unsupported */}
        {showSOSButton && (
          <PageHeading title={pageTitle || t?.assistiveCommunication || 'Assistive Communication'} onSOSClick={onSOSClick} t={t} />
        )}
        <div className="support-banner">
          ⚠️ {t?.vttNotSupported || 'Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.'}
        </div>
      </>
    )
  }

  const confidencePct = Math.round(confidence || 0)

  return (
    <div>
      {/* ── Page heading with SOS button ── */}
      {showSOSButton && (
        <PageHeading
          title={pageTitle || t?.assistiveCommunication || 'Assistive Communication'}
          onSOSClick={onSOSClick}
          t={t}
        />
      )}

      {/* Mic denied warning */}
      {micPermission === 'denied' && (
        <div className="error-banner" role="alert" style={{ marginBottom: 12 }}>
          <span>🎙️</span>
          <span>
            {t?.micDenied || 'Microphone access was denied. Please allow microphone access in your browser settings and refresh the page.'}
          </span>
        </div>
      )}

      {/* Active context badge */}
      {activeContext && activeContext !== 'General' && (
        <div style={{ marginBottom: 12 }}>
          <span className="badge badge-accent">
            {activeContext} {t?.modeActive || 'mode active'}
          </span>
        </div>
      )}

      {/* Recognition error */}
      {error && (
        <div className="error-banner" role="alert">
          <span>⚠️</span><span>{error}</span>
        </div>
      )}

      {/* Language direction bar */}
      {!sameLanguage && (
        <div className="tts-lang-bar">
          <span className="tts-lang-from">🎤 {t?.speakIn || 'Speak in'} <strong>{langCode}</strong></span>
          <span className="tts-lang-arrow">→</span>
          <span className="tts-lang-to">🌐 {t?.translatedTo || 'Translated to'} <strong>{outputLang}</strong></span>
        </div>
      )}

      <div className="card">
        <div className="card-title">
          <span>🎤</span>
          {t?.voiceToText || 'Voice → Text'}
          {!sameLanguage ? ` → ${t?.translation || 'Translation'}` : ''}
        </div>

        {/* Mic button */}
        <div className="mic-section">
          <button
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            onClick={handleMicToggle}
            // iOS Safari requires type="button" to avoid accidental form submits
            type="button"
            aria-label={isListening
              ? (t?.stopListeningAriaLabel || 'Stop listening')
              : (t?.startListeningAriaLabel || 'Start listening')}
          >
            {isListening ? '⏹️' : '🎤'}
          </button>

          <div className={`wave-container ${isListening ? 'visible' : ''}`}>
            {[...Array(7)].map((_, i) => <div key={i} className="wave-bar" />)}
          </div>

          <div className={`mic-label ${isListening ? 'active' : ''}`}>
            {isListening
              ? `🔴 ${t?.listening || 'Listening'} in ${langCode}… ${t?.speakNow || 'speak now'}`
              : (t?.clickMicToStart || 'Click the mic to start speaking')}
          </div>
        </div>

        <div className="divider" />

        {/* Transcript */}
        <div
          className={`transcript-box ${originalText || interimText ? 'has-text' : ''}`}
          role="region"
          aria-label={t?.originalTranscriptionAriaLabel || 'Original transcription'}
          aria-live="polite"
        >
          {!originalText && !interimText ? (
            <div className="transcript-placeholder">
              {t?.vttPlaceholder || 'Your spoken words will appear here…'}
            </div>
          ) : (
            <>
              <div className="vtt-section-label">
                {sameLanguage ? (t?.transcription || 'Transcription') : `${t?.original || 'Original'} (${langCode})`}
              </div>
              <span className="final-text">{originalText}</span>
              {interimText && <span className="interim-text"> {interimText}</span>}
            </>
          )}
        </div>

        {/* Confidence bar */}
        {confidencePct > 0 && originalText && (
          <div className="confidence-section">
            <div className="confidence-label-row">
              <span className="confidence-label">{t?.recognitionConfidence || 'Recognition Confidence'}</span>
              <span className="confidence-pct">{confidencePct}%</span>
            </div>
            <div className="confidence-bar">
              <div
                className="confidence-fill"
                style={{
                  width: `${confidencePct}%`,
                  background: confidencePct > 70 ? 'var(--accent3)' : confidencePct > 40 ? 'var(--yellow)' : 'var(--red)',
                }}
              />
            </div>
          </div>
        )}

        {/* Phonetic field */}
        {originalText && (
          <div className="phonetic-section" style={{ marginTop: 12 }}>
            <label
              className="phonetic-label"
              style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}
            >
              {t?.phoneticPronunciation || 'Phonetic pronunciation'} ({t?.optional || 'optional'})
            </label>
            <input
              type="text"
              className="text-input"
              value={phonetic}
              onChange={e => setPhonetic(e.target.value)}
              placeholder={t?.howToPronounce || 'How to pronounce…'}
              style={{ fontSize: 13 }}
              aria-label={t?.phoneticLabel || 'Phonetic pronunciation'}
            />
          </div>
        )}

        {/* Translation output */}
        {!sameLanguage && (translatedText || isTranslating) && (
          <div className="vtt-translation-box">
            <div className="vtt-translation-label">
              {isTranslating
                ? (t?.translating || '⏳ Translating…')
                : `🌐 ${t?.translation || 'Translation'} (${outputLang})`}
            </div>
            {!isTranslating && <div className="vtt-translation-text">{translatedText}</div>}
          </div>
        )}

        {translationError && <div className="tts-error-note">⚠️ {translationError}</div>}

        {/* Action buttons */}
        <div className="btn-row" style={{ marginTop: 16 }}>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleTranslateAndSpeak}
            disabled={!originalText || isSpeaking || isTranslating}
            aria-label={t?.translateAndReadAriaLabel || 'Translate and read aloud'}
          >
            {isTranslating
              ? (t?.translating || '⏳ Translating…')
              : isSpeaking
              ? (t?.speaking || '🔊 Speaking…')
              : sameLanguage
              ? (t?.readAloud || '🔊 Read Aloud')
              : (t?.translateAndRead || '🌐 Translate & Read Aloud')}
          </button>

          {translatedText && !isSpeaking && (
            <button type="button" className="btn btn-secondary" onClick={handleReadAgain}
              aria-label={t?.readAgainAriaLabel || 'Read the translation again'}>
              🔁 {t?.readAgain || 'Read Again'}
            </button>
          )}

          {isSpeaking && (
            <button type="button" className="btn btn-danger" onClick={cancel}
              aria-label={t?.stopAriaLabel || 'Stop speaking'}>
              ⏹ {t?.stop || 'Stop'}
            </button>
          )}

          <button type="button" className="btn btn-secondary" onClick={handleCopy}
            disabled={!originalText && !translatedText}
            aria-label={t?.copyAriaLabel || 'Copy text to clipboard'}>
            📋 {translatedText ? (t?.copyTranslation || 'Copy Translation') : (t?.copy || 'Copy')}
          </button>

          {originalText && (
            <button type="button" className="btn btn-secondary" onClick={handleSavePhrase}
              aria-label={t?.savePhraseAriaLabel || 'Save this phrase'}>
              ⭐ {t?.savePhrase || 'Save phrase'}
            </button>
          )}

          <button type="button" className="btn btn-secondary" onClick={handleClear}
            disabled={!originalText && !interimText}
            aria-label={t?.clearAriaLabel || 'Clear all text'}>
            🗑 {t?.clear || 'Clear'}
          </button>
        </div>

        {!sameLanguage && !originalText && (
          <p className="vtt-hint">
            💡 {t?.speakIn || 'Speak in'} <strong>{langCode}</strong> — {t?.appWillTranslate || 'the app will translate and read it aloud in'} <strong>{outputLang}</strong>.
          </p>
        )}
      </div>

      {/* Saved phrases */}
      {savedPhrases.length > 0 && (
        <div className="card">
          <div className="card-title"><span>📌</span> {t?.savedPhrases || 'Your Saved Phrases'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {savedPhrases.map(p => (
              <div key={p.id} className="saved-phrase-item" style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                background: 'var(--bg-inset)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--text)' }}>{p.text}</div>
                  {p.phonetic && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontStyle: 'italic' }}>{p.phonetic}</div>}
                  {p.context && p.context !== 'General' && <div style={{ fontSize: 11, color: 'var(--accent2)', marginTop: 2 }}>📍 {p.context}</div>}
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{p.createdAt}</div>
                </div>
                <button type="button" className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: 12 }}
                  onClick={() => speak({ text: p.translated || p.text, lang: outputLang })}
                  aria-label={t?.playAriaLabel || 'Play phrase'}>🔊</button>
                <button type="button" className="btn btn-danger" style={{ padding: '5px 10px', fontSize: 12 }}
                  onClick={() => handleDeleteSaved(p.id)}
                  aria-label={t?.deleteAriaLabel || 'Delete phrase'}>🗑</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── PageHeading subcomponent ─────────────────────────────────────────────────
// Renders the "Assistive Communication" title with SOS button on the right.
// Drop this into your layout/page component if you prefer it outside VoiceToText.
export function PageHeading({ title, onSOSClick, t }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    }}>
      <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text, #111)' }}>
        {title}
      </h1>
      <button
        type="button"
        onClick={onSOSClick}
        aria-label={t?.openEmergencyCard || 'Open Emergency Card (SOS)'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 14px',
          background: 'var(--red, #ef4444)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontWeight: 700,
          fontSize: 14,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(239,68,68,0.35)',
          flexShrink: 0,
        }}
      >
        🆘 {t?.sos || 'SOS'}
      </button>
    </div>
  )
}