// components/VoiceToText.js
// This component lets the user speak, converts speech to text using the browser's
// SpeechRecognition API, and displays the transcribed text live.

import { useState, useCallback } from 'react'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useSpeechSynthesis }   from '../hooks/useSpeechSynthesis'

export default function VoiceToText({ langCode, onAddToHistory }) {
  const [finalText, setFinalText] = useState('')

  // Called when the recognition engine gives us a confirmed result
  const handleResult = useCallback((text) => {
    setFinalText(prev => prev ? `${prev} ${text}` : text)
  }, [])

  const { isListening, interimText, error, isSupported, startListening, stopListening } =
    useSpeechRecognition({ langCode, onResult: handleResult })

  const { isSpeaking, speak, cancel } = useSpeechSynthesis()

  // Speak the transcribed text back aloud (useful for mute users to confirm what was captured)
  const handleSpeak = () => {
    if (!finalText.trim()) return
    speak({ text: finalText, lang: langCode })
    onAddToHistory?.({ text: finalText, type: 'voice', lang: langCode })
  }

  const handleClear = () => {
    stopListening()
    cancel()
    setFinalText('')
  }

  const handleCopy = () => {
    if (finalText) navigator.clipboard?.writeText(finalText)
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
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="card">
        <div className="card-title"><span>🎤</span> Voice → Text</div>

        {/* Microphone button with pulse animation when active */}
        <div className="mic-section">
          <button
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            onClick={isListening ? stopListening : startListening}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
            title={isListening ? 'Click to stop' : 'Click to start speaking'}
          >
            {isListening ? '⏹️' : '🎤'}
          </button>

          {/* Sound wave animation — shown only while listening */}
          <div className={`wave-container ${isListening ? 'visible' : ''}`}>
            {[...Array(7)].map((_, i) => (
              <div key={i} className="wave-bar" />
            ))}
          </div>

          <div className={`mic-label ${isListening ? 'active' : ''}`}>
            {isListening ? '🔴 Listening… speak now' : 'Click the mic to start speaking'}
          </div>
        </div>

        <div className="divider" />

        {/* Live transcript display */}
        <div
          className={`transcript-box ${finalText || interimText ? 'has-text' : ''}`}
          role="region"
          aria-label="Transcription output"
          aria-live="polite"
        >
          {!finalText && !interimText ? (
            <div className="transcript-placeholder">
              Your spoken words will appear here in real time…
            </div>
          ) : (
            <>
              <span className="final-text">{finalText}</span>
              {/* Interim text is shown greyed out while the engine is still processing */}
              {interimText && (
                <span className="interim-text"> {interimText}</span>
              )}
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="btn-row" style={{ marginTop: 16 }}>
          <button
            className="btn btn-primary"
            onClick={handleSpeak}
            disabled={!finalText || isSpeaking}
            title="Read the transcribed text aloud"
          >
            {isSpeaking ? '🔊 Speaking…' : '🔊 Read Aloud'}
          </button>

          {isSpeaking && (
            <button className="btn btn-danger" onClick={cancel}>
              ⏹ Stop
            </button>
          )}

          <button
            className="btn btn-secondary"
            onClick={handleCopy}
            disabled={!finalText}
            title="Copy text to clipboard"
          >
            📋 Copy
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleClear}
            disabled={!finalText && !interimText}
          >
            🗑 Clear
          </button>
        </div>
      </div>
    </div>
  )
}