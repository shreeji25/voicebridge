// components/VoiceToText.js
// SPEAKING tab — User SPEAKS in fromLang → transcribed → TRANSLATED to toLanguage
// → translated text displayed + read aloud in toLanguage
// NEW: confidence bar, phonetic pronunciation, saved phrases, context-aware UI

import { useState, useCallback, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis }   from '../hooks/useSpeechSynthesis';
import { translateText }        from '../lib/translate';

export default function VoiceToText({ langCode, toLanguage, onAddToHistory, t, activeContext }) {
  const [originalText, setOriginalText]     = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating]   = useState(false);
  const [translationError, setTranslationError] = useState('');
  const [phonetic, setPhonetic]             = useState('');
  const [savedPhrases, setSavedPhrases]     = useState([]);

  const outputLang   = toLanguage || langCode;
  const sameLanguage = langCode?.split('-')[0] === outputLang?.split('-')[0];

  // Confidence comes from the updated hook
  const handleResult = useCallback((text) => {
    setOriginalText(prev => prev ? `${prev} ${text}` : text);
    setTranslatedText('');
  }, []);

  const {
    isListening, interimText, finalText, error, confidence,
    isSupported, startListening, stopListening, resetTranscript,
  } = useSpeechRecognition({ langCode, onResult: handleResult });

  const { isSpeaking, speak, cancel } = useSpeechSynthesis();

  // Load saved phrases from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vb_savedPhrases');
      if (saved) setSavedPhrases(JSON.parse(saved));
    } catch (e) { /* ignore */ }
  }, []);

  // Reset when language changes
  useEffect(() => {
    setOriginalText('');
    setTranslatedText('');
    setTranslationError('');
    setPhonetic('');
    stopListening();
    cancel();
  }, [langCode, outputLang]);

  async function handleTranslateAndSpeak() {
    if (!originalText.trim()) return;
    setTranslationError('');
    setIsTranslating(true);

    try {
      let textToSpeak         = originalText;
      let translatedForDisplay = originalText;

      if (!sameLanguage) {
        translatedForDisplay = await translateText(originalText, langCode, outputLang);
        textToSpeak          = translatedForDisplay;
      }

      setTranslatedText(translatedForDisplay);

      try {
        speak({ text: textToSpeak, lang: outputLang });
      } catch (speakErr) {
        console.error('Speech synthesis error:', speakErr);
        setTranslationError(t?.speakError || 'Voice not available for this language.');
      }

      onAddToHistory?.({
        text: sameLanguage ? originalText : `${originalText} → ${translatedForDisplay}`,
        type: 'voice',
        lang: langCode,
        translatedLang: outputLang,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Translation error:', err);
      setTranslationError(t?.translationFailed || 'Translation failed. Reading original text.');
      try { speak({ text: originalText, lang: langCode }); } catch (e) {}
    } finally {
      setIsTranslating(false);
    }
  }

  function handleReadAgain() {
    const textToSpeak = translatedText || originalText;
    const langToUse   = translatedText ? outputLang : langCode;
    if (!textToSpeak) return;
    try {
      speak({ text: textToSpeak, lang: langToUse });
    } catch (err) {
      setTranslationError(t?.speakError || 'Voice not available for this language.');
    }
  }

  function handleSavePhrase() {
    if (!originalText) return;
    const newPhrase = {
      id: Date.now(),
      text: originalText,
      translated: translatedText,
      phonetic,
      createdAt: new Date().toLocaleDateString(),
    };
    const updated = [newPhrase, ...savedPhrases];
    setSavedPhrases(updated);
    try { localStorage.setItem('vb_savedPhrases', JSON.stringify(updated)); } catch (e) {}
    onAddToHistory?.({ text: originalText, type: 'voice', lang: langCode, timestamp: new Date().toISOString() });
  }

  function handleDeleteSaved(id) {
    const updated = savedPhrases.filter(p => p.id !== id);
    setSavedPhrases(updated);
    try { localStorage.setItem('vb_savedPhrases', JSON.stringify(updated)); } catch (e) {}
  }

  function handleClear() {
    stopListening();
    cancel();
    setOriginalText('');
    setTranslatedText('');
    setTranslationError('');
    setPhonetic('');
    resetTranscript();
  }

  function handleCopy() {
    const text = translatedText || originalText;
    if (text) navigator.clipboard?.writeText(text).catch(() => {});
  }

  if (!isSupported) {
    return (
      <div className="support-banner">
        ⚠️ {t?.vttNotSupported || 'Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.'}
      </div>
    );
  }

  const confidencePct = confidence || 0;

  return (
    <div>
      {/* Active context badge */}
      {activeContext && activeContext !== 'General' && (
        <div style={{ marginBottom: 12 }}>
          <span className="badge badge-accent">
            {activeContext} mode active
          </span>
        </div>
      )}

      {/* Error display */}
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
            onClick={isListening ? stopListening : () => startListening(langCode)}
            aria-label={isListening ? (t?.stopListeningAriaLabel || 'Stop listening') : (t?.startListeningAriaLabel || 'Start listening')}
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
        {confidencePct > 0 && (
          <div className="confidence-section">
            <div className="confidence-label-row">
              <span className="confidence-label">Recognition Confidence</span>
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
            <label className="phonetic-label" style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>
              Phonetic pronunciation (optional)
            </label>
            <input
              type="text"
              className="text-input"
              value={phonetic}
              onChange={e => setPhonetic(e.target.value)}
              placeholder="How to pronounce…"
              style={{ fontSize: 13 }}
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
            onClick={handleTranslateAndSpeak}
            disabled={!originalText || isSpeaking || isTranslating}
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
            <button className="btn btn-secondary" onClick={handleReadAgain}>
              🔁 {t?.readAgain || 'Read Again'}
            </button>
          )}

          {isSpeaking && (
            <button className="btn btn-danger" onClick={cancel}>
              ⏹ {t?.stop || 'Stop'}
            </button>
          )}

          <button className="btn btn-secondary" onClick={handleCopy} disabled={!originalText && !translatedText}>
            📋 {translatedText ? (t?.copyTranslation || 'Copy Translation') : (t?.copy || 'Copy')}
          </button>

          {originalText && (
            <button className="btn btn-secondary" onClick={handleSavePhrase}>
              ⭐ Save phrase
            </button>
          )}

          <button className="btn btn-secondary" onClick={handleClear} disabled={!originalText && !interimText}>
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
          <div className="card-title"><span>📌</span> Your Saved Phrases</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {savedPhrases.map(p => (
              <div key={p.id} className="saved-phrase-item" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-inset)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--text)' }}>{p.text}</div>
                  {p.phonetic && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontStyle: 'italic' }}>{p.phonetic}</div>}
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{p.createdAt}</div>
                </div>
                <button className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => speak({ text: p.translated || p.text, lang: outputLang })}>🔊</button>
                <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => handleDeleteSaved(p.id)}>🗑</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}