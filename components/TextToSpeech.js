// components/TextToSpeech.js
// User TYPES in their language (fromLang) → text is TRANSLATED → spoken in toLanguage
// Designed for mute users who want to communicate with people who speak a different language
// UPDATED: Context mode selector (Hospital, Airport, Market, Hotel, Transport, General)
// Quick phrases now display in FROM language (user's native language) and vary by context

import { useState, useEffect } from 'react'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { translateText } from '../lib/translate'

// Context-specific quick phrases
const QUICK_PHRASES_BY_CONTEXT = {
  General: [
    { emoji: '👋', text: 'Hello, how are you?' },
    { emoji: '🙏', text: 'Thank you very much.' },
    { emoji: '🆘', text: 'I need help please.' },
    { emoji: '💧', text: 'Can I have some water?' },
    { emoji: '👍', text: 'Yes, I agree.' },
    { emoji: '👎', text: 'No, I disagree.' },
    { emoji: '✋', text: 'Please wait a moment.' },
    { emoji: '📞', text: 'Please call my family.' },
  ],
  Hospital: [
    { emoji: '💊', text: 'I need my medicine.' },
    { emoji: '😣', text: 'I am in pain.' },
    { emoji: '🌡️', text: 'I have a fever.' },
    { emoji: '🤒', text: 'I feel sick.' },
    { emoji: '💉', text: 'I need a doctor.' },
    { emoji: '🚑', text: 'I need an ambulance.' },
    { emoji: '📋', text: 'Show me my medical history.' },
    { emoji: '💧', text: 'Can I have some water?' },
  ],
  Airport: [
    { emoji: '🛫', text: 'Where is my gate?' },
    { emoji: '🎫', text: 'I cannot find my ticket.' },
    { emoji: '🧳', text: 'Where is baggage claim?' },
    { emoji: '🚻', text: 'Where is the restroom?' },
    { emoji: '🍽️', text: 'Where is the restaurant?' },
    { emoji: '💱', text: 'Where is currency exchange?' },
    { emoji: '✈️', text: 'When is my flight?' },
    { emoji: '📱', text: 'Can I use my phone here?' },
  ],
  Market: [
    { emoji: '💰', text: 'How much does this cost?' },
    { emoji: '🧾', text: 'What is the total price?' },
    { emoji: '💳', text: 'Do you accept credit cards?' },
    { emoji: '🎁', text: 'Do you have this in a different size?' },
    { emoji: '📦', text: 'Can you wrap this?' },
    { emoji: '🚚', text: 'Do you deliver?' },
    { emoji: '🏷️', text: 'Is this on sale?' },
    { emoji: '👀', text: 'Can I see another color?' },
  ],
  Hotel: [
    { emoji: '🔑', text: 'I need my room key.' },
    { emoji: '🛏️', text: 'Can I have extra blankets?' },
    { emoji: '🧹', text: 'I need housekeeping.' },
    { emoji: '📺', text: 'How do I turn on the TV?' },
    { emoji: '❄️', text: 'The room is too cold.' },
    { emoji: '🔥', text: 'The room is too hot.' },
    { emoji: '🔇', text: 'It is too noisy.' },
    { emoji: '☕', text: 'Can I order room service?' },
  ],
  Transport: [
    { emoji: '🚕', text: 'Can you take me to this address?' },
    { emoji: '🗺️', text: 'What is the best route?' },
    { emoji: '💳', text: 'Do you accept credit cards?' },
    { emoji: '⏱️', text: 'How long will it take?' },
    { emoji: '🚦', text: 'Can you avoid traffic?' },
    { emoji: '📍', text: 'Where are we now?' },
    { emoji: '🎵', text: 'Can you turn down the music?' },
    { emoji: '❄️', text: 'Can you adjust the temperature?' },
  ],
}

export default function TextToSpeech({ langCode, toLanguage, onAddToHistory, t, onContextChange }) {
  const [text, setText]                   = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [rate, setRate]                   = useState(1)
  const [pitch, setPitch]                 = useState(1)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationError, setTranslationError] = useState('')
  const [activeContext, setActiveContext] = useState('General')
  // Quick phrases: displayed in FROM language, with audio in output language
  const [quickPhrasesTranslated, setQuickPhrasesTranslated] = useState(QUICK_PHRASES_BY_CONTEXT.General)

  const { isSpeaking, isSupported, speak, cancel } = useSpeechSynthesis()

  // Determine the effective output language
  const outputLang = toLanguage || langCode
  const sameLanguage = langCode?.split('-')[0] === outputLang?.split('-')[0]

  // Context modes
  const contexts = ['General', 'Hospital', 'Airport', 'Market', 'Hotel', 'Transport']

  // ── Translate quick phrases to FROM language (user's native language) ──
  // Phrases display in user's language, but speak in output language
  useEffect(() => {
    async function translateQuickPhrases() {
      const basePhrases = QUICK_PHRASES_BY_CONTEXT[activeContext] || QUICK_PHRASES_BY_CONTEXT.General

      if (langCode === 'en-US') {
        // If user's language is English, no translation needed
        setQuickPhrasesTranslated(basePhrases)
        return
      }

      try {
        const translated = await Promise.all(
          basePhrases.map(async (p) => ({
            ...p,
            // Translate base English phrase to user's FROM language (for display)
            displayText: await translateText(p.text, 'en-US', langCode),
            // Also get version for speaking (may differ from display)
            speakText: toLanguage && !sameLanguage 
              ? await translateText(p.text, 'en-US', toLanguage)
              : await translateText(p.text, 'en-US', langCode)
          }))
        )
        setQuickPhrasesTranslated(translated)
      } catch (err) {
        console.error('Quick phrases translation failed:', err)
        setQuickPhrasesTranslated(basePhrases)
      }
    }

    translateQuickPhrases()
  }, [langCode, toLanguage, sameLanguage, activeContext])

  // Notify parent of context change
  useEffect(() => {
    onContextChange?.(activeContext)
  }, [activeContext, onContextChange])

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
        setTranslationError(t?.speakError || 'Voice not available for this language')
      }

      onAddToHistory?.({
        text: sameLanguage ? text : `${text} → ${translatedForDisplay}`,
        type: 'typed',
        lang: langCode,
        translatedLang: outputLang,
        context: activeContext,
        timestamp: new Date().toISOString()
      })
    } catch (err) {
      console.error('Translation error:', err)
      setTranslationError(t?.translationFailed || 'Translation failed. Speaking original text.')
      try {
        speak({ text, lang: langCode, rate, pitch })
      } catch (e) {
        console.error('Fallback speak failed:', e)
      }
    } finally {
      setIsTranslating(false)
    }
  }

  // Quick phrases: user clicks phrase shown in their FROM language
  // then it gets translated to output language and spoken
  async function handleQuickPhrase(phrase) {
    setText(phrase.displayText || phrase.text)
    setTranslationError('')
    setIsTranslating(true)

    try {
      let textToSpeak = phrase.speakText || phrase.displayText || phrase.text

      setTranslatedText(textToSpeak)
      
      try {
        speak({ text: textToSpeak, lang: outputLang, rate, pitch })
      } catch (speakErr) {
        console.error('Quick phrase speak error:', speakErr)
      }

      onAddToHistory?.({
        text: sameLanguage 
          ? (phrase.displayText || phrase.text)
          : `${phrase.displayText || phrase.text} → ${textToSpeak}`,
        type: 'quick',
        lang: langCode,
        translatedLang: outputLang,
        context: activeContext,
        timestamp: new Date().toISOString()
      })
    } catch (err) {
      console.error('Quick phrase translation failed:', err)
      setTranslatedText('')
      try {
        speak({ text: phrase.displayText || phrase.text, lang: langCode, rate, pitch })
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
        ⚠️ {t?.ttsNotSupported || "Text-to-speech is not supported in this browser. Please use Chrome, Edge, or Safari."}
      </div>
    )
  }

  return (
    <div>
      {/* Translation direction indicator */}
      {!sameLanguage && (
        <div className="tts-lang-bar">
          <span className="tts-lang-from">✍️ {t?.typeIn || "Type in"} <strong>{langCode}</strong></span>
          <span className="tts-lang-arrow">→</span>
          <span className="tts-lang-to">🔊 {t?.speaksIn || "Speaks in"} <strong>{outputLang}</strong></span>
        </div>
      )}

      {/* Quick Phrases with Context Selector */}
      <div className="card">
        <div className="card-title"><span>⚡</span> {t?.quickPhrases || "Quick Phrases"}</div>
        
        {/* Context mode selector */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
            {t?.contextMode || 'Context mode'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {contexts.map((ctx) => (
              <button
                key={ctx}
                className={`context-pill ${activeContext === ctx ? 'active' : ''}`}
                onClick={() => setActiveContext(ctx)}
                style={{
                  padding: '6px 12px',
                  fontSize: 12,
                  borderRadius: 'var(--radius-sm)',
                  border: activeContext === ctx ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: activeContext === ctx ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                  color: activeContext === ctx ? 'var(--accent)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {ctx === 'Hospital' && '🏥'}
                {ctx === 'Airport' && '✈️'}
                {ctx === 'Market' && '🛒'}
                {ctx === 'Hotel' && '🏨'}
                {ctx === 'Transport' && '🚕'}
                {ctx === 'General' && '👥'}
                {' '}{ctx}
              </button>
            ))}
          </div>
        </div>

        <p className="tts-quick-note">
          {sameLanguage
            ? t?.tapToSpeak || 'Tap a phrase to speak it instantly.'
            : t?.phraseWillTranslate || `Tap a phrase in ${langCode} — it will be translated to ${outputLang} and spoken aloud.`}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {quickPhrasesTranslated.map((p, idx) => (
            <button
              key={idx}
              className="btn btn-secondary"
              style={{ fontSize: 13, padding: '8px 14px' }}
              onClick={() => handleQuickPhrase(p)}
              disabled={isTranslating || isSpeaking}
              title={
                sameLanguage 
                  ? (p.displayText || p.text)
                  : `${p.displayText || p.text} → ${p.speakText || p.displayText || p.text}`
              }
              aria-label={`${p.emoji} ${p.displayText || p.text}`}
            >
              {p.emoji} {p.displayText || p.text}
            </button>
          ))}
        </div>
      </div>

      {/* Main input */}
      <div className="card">
        <div className="card-title"><span>⌨️</span> {t?.typeToSpeak || "Type to Speak"}</div>

        <div className="input-group">
          <textarea
            className="text-input"
            placeholder={
              sameLanguage
                ? t?.typeAnything || 'Type anything here and press Speak…'
                : t?.typeToTranslate || `Type in ${langCode} — will be translated to ${outputLang} and spoken aloud`
            }
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setTranslatedText('')
            }}
            rows={4}
            aria-label={t?.typeToSpeakAriaLabel || "Text to translate and speak"}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSpeak()
            }}
          />

          {/* Translation preview box */}
          {!sameLanguage && (translatedText || isTranslating) && (
            <div className="tts-translation-preview">
              <span className="tts-preview-label">
                {isTranslating ? t?.translating || '⏳ Translating…' : `🌐 ${outputLang} ${t?.translation || "translation"}:`}
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
              <label>{t?.speed || "Speed"} <span className="control-value">{rate.toFixed(1)}×</span></label>
              <input
                type="range" min={0.5} max={2} step={0.1}
                value={rate} onChange={(e) => setRate(parseFloat(e.target.value))}
                aria-label={t?.speedAriaLabel || "Speech speed"}
              />
            </div>
            <div className="control-group">
              <label>{t?.pitch || "Pitch"} <span className="control-value">{pitch.toFixed(1)}</span></label>
              <input
                type="range" min={0.5} max={2} step={0.1}
                value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))}
                aria-label={t?.pitchAriaLabel || "Speech pitch"}
              />
            </div>
          </div>

          {isSpeaking && (
            <div>
              <span className="speaking-badge">
                <span className="speaking-dot" />
                {sameLanguage ? (t?.speaking || 'Speaking…') : `${t?.speakingIn || "Speaking in"} ${outputLang}…`}
              </span>
            </div>
          )}

          <div className="btn-row">
            <button
              className="btn btn-primary"
              onClick={handleSpeak}
              disabled={!text.trim() || isSpeaking || isTranslating}
              title={t?.translateAndSpeakTitle || "Translate and speak the text"}
              aria-label={t?.translateAndSpeakAriaLabel || "Translate and speak"}
            >
              {isTranslating ? (t?.translating || '⏳ Translating…') : (sameLanguage ? (t?.speak || '🔊 Speak') : (t?.translateAndSpeak || '🔊 Translate & Speak'))}
            </button>

            {isSpeaking && (
              <button className="btn btn-danger" onClick={cancel} aria-label={t?.stopAriaLabel || 'Stop speaking'}>
                ⏹ {t?.stop || "Stop"}
              </button>
            )}

            <button
              className="btn btn-secondary"
              onClick={handleClear}
              disabled={!text && !translatedText}
              title={t?.clearTitle || "Clear all text"}
              aria-label={t?.clearAriaLabel || 'Clear all text'}
            >
              🗑 {t?.clear || "Clear"}
            </button>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
            {t?.keyboardTip || "Tip:"} {' '}
            <kbd style={{
              background: 'var(--bg-inset)', border: '1px solid var(--border)',
              borderRadius: 4, padding: '1px 5px', fontFamily: 'monospace', fontSize: 11
            }}>Ctrl+Enter</kbd>{' '}
            {t?.keyboardTipText || "to translate & speak quickly"}
          </div>
        </div>
      </div>
    </div>
  )
}