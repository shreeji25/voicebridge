// hooks/useSpeechSynthesis.js
// Updated: exposes rate/pitch state setters for Settings integration

import { useState, useRef, useEffect } from 'react';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [rate, setRate]               = useState(1);
  const [pitch, setPitch]             = useState(1);
  const utteranceRef                  = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSupported('speechSynthesis' in window);
    }
  }, []);

  const speak = ({ text, lang = 'en-US', rate: customRate, pitch: customPitch }) => {
    if (!isSupported) {
      console.error('Text-to-Speech not supported');
      return;
    }
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance       = new SpeechSynthesisUtterance(text);
    utterance.lang        = lang;
    utterance.rate        = customRate  !== undefined ? customRate  : rate;
    utterance.pitch       = customPitch !== undefined ? customPitch : pitch;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend   = () => setIsSpeaking(false);
    utterance.onerror = (err) => {
      console.error('Speech synthesis error:', err);
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return {
    isSpeaking,
    isSupported,
    rate,
    setRate,
    pitch,
    setPitch,
    speak,
    cancel,
  };
}