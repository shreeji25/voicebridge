// hooks/useSpeechSynthesis.js
// Custom React hook that wraps the browser's Web Speech API (SpeechSynthesis).
// Handles speaking text aloud with configurable rate, pitch, and language voice.

import { useState, useCallback } from 'react'

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Check if the browser supports SpeechSynthesis
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  // Speak the given text with optional settings
  const speak = useCallback(({ text, lang = 'en-US', rate = 1, pitch = 1 }) => {
    if (!isSupported || !text.trim()) return

    // Cancel any currently playing speech
    window.speechSynthesis.cancel()

    const utterance     = new SpeechSynthesisUtterance(text)
    utterance.lang      = lang
    utterance.rate      = rate   // Speed: 0.5 (slow) to 2.0 (fast)
    utterance.pitch     = pitch  // Pitch: 0.0 (low) to 2.0 (high)
    utterance.volume    = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend   = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [isSupported])

  const cancel = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSupported])

  return { isSpeaking, isSupported, speak, cancel }
}