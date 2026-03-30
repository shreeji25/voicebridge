// hooks/useSpeechRecognition.js
// Custom React hook that wraps the browser's Web Speech API (SpeechRecognition).
// Handles start/stop listening, interim results, and error states.

import { useState, useRef, useCallback } from 'react'

// Map our language labels to BCP-47 language codes used by the browser API
const LANG_CODES = {
  'en-US': 'en-US',
  'hi-IN': 'hi-IN',
  'gu-IN': 'gu-IN',
}

export function useSpeechRecognition({ langCode, onResult }) {
  const [isListening, setIsListening]   = useState(false)
  const [interimText, setInterimText]   = useState('')
  const [error, setError]               = useState(null)
  const recognitionRef                  = useRef(null)

  // Check if the browser supports SpeechRecognition
  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Your browser does not support voice recognition. Try Chrome or Edge.')
      return
    }

    // Create a new instance every time (safer across languages)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang            = LANG_CODES[langCode] || 'en-US'
    recognition.interimResults  = true  // Show text as you speak (not just when done)
    recognition.continuous      = false // Stop after a natural pause
    recognition.maxAlternatives = 1

    // Called every time the recognition returns a result
    recognition.onresult = (event) => {
      let interim = ''
      let final   = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript
        } else {
          interim += transcript
        }
      }

      setInterimText(interim)

      // When we have a confirmed final result, pass it up to the parent
      if (final) {
        onResult(final.trim())
        setInterimText('')
      }
    }

    recognition.onerror = (event) => {
      // Handle different error types with helpful messages
      const messages = {
        'not-allowed':   'Microphone access denied. Please allow mic permissions and try again.',
        'no-speech':     'No speech detected. Please try speaking clearly.',
        'audio-capture': 'No microphone found. Please connect a microphone.',
        'network':       'Network error during recognition. Check your connection.',
      }
      setError(messages[event.error] || `Recognition error: ${event.error}`)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimText('')
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
    setError(null)
  }, [langCode, isSupported, onResult])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
    setInterimText('')
  }, [])

  return { isListening, interimText, error, isSupported, startListening, stopListening }
}