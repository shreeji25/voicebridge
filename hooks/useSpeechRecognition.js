// hooks/useSpeechRecognition.js
// Updated: supports continuous recognition, confidence score, langCode passed to startListening()

import { useState, useRef, useEffect } from 'react';

export function useSpeechRecognition({ langCode, onResult } = {}) {
  const [isListening, setIsListening]   = useState(false);
  const [interimText, setInterimText]   = useState('');
  const [finalText, setFinalText]       = useState('');
  const [error, setError]               = useState('');
  const [confidence, setConfidence]     = useState(0);
  const [isSupported, setIsSupported]   = useState(false);
  const recognitionRef                  = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      setIsSupported(!!SR);
    }
  }, []);

  const startListening = (lang) => {
    const useLang = lang || langCode || 'en-US';
    if (!isSupported) {
      setError('Speech Recognition not supported in this browser. Use Chrome or Edge.');
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    // Always create a fresh instance (required for language switching)
    recognitionRef.current = new SR();
    const recognition = recognitionRef.current;

    recognition.lang            = useLang;
    recognition.continuous      = true;
    recognition.interimResults  = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      setInterimText('');
      setFinalText('');
      setConfidence(0);
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final   = '';
      let maxConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const conf       = event.results[i][0].confidence;
        if (event.results[i].isFinal) {
          final        += transcript + ' ';
          maxConfidence = Math.max(maxConfidence, conf);
        } else {
          interim += transcript;
        }
      }

      setInterimText(interim);

      if (final) {
        const trimmed = final.trim();
        setFinalText(trimmed);
        setConfidence(Math.round(maxConfidence * 100));
        // Support both the hook-prop callback and inline usage
        if (onResult) onResult(trimmed);
        setInterimText('');
      }
    };

    recognition.onerror = (event) => {
      const messages = {
        'not-allowed':   'Microphone access denied. Please allow mic permissions and try again.',
        'no-speech':     'No speech detected. Please try speaking clearly.',
        'audio-capture': 'No microphone found. Please connect a microphone.',
        'network':       'Network error during recognition. Check your connection.',
      };
      setError(messages[event.error] || `Recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
    };

    try {
      recognition.start();
    } catch (e) {
      // Already started — ignore
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsListening(false);
    setInterimText('');
  };

  const resetTranscript = () => {
    setFinalText('');
    setInterimText('');
    setConfidence(0);
  };

  return {
    isListening,
    interimText,
    finalText,
    error,
    confidence,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}