// components/HelpModal.js
// A "How it works" help overlay triggered by the ? button in the nav.
// Shows a 3-step guide. Dismissible. First-time users also see a banner.

import { useEffect } from 'react'

const STEPS = [
  {
    number: '1',
    icon: '🌐',
    title: 'Pick your language',
    desc: 'Choose English, Hindi, or Gujarati at the top. This sets both the listening language and the speaking voice.',
  },
  {
    number: '2',
    icon: '🎤',
    title: 'Choose a mode',
    desc: 'Go to "Voice to Text" to speak and see your words on screen. Go to "Text to Speech" to type and have the device speak for you.',
  },
  {
    number: '3',
    icon: '⚡',
    title: 'Or use Quick Phrases',
    desc: 'In the Conversation tab, tap any Quick Phrase button for instant one-tap communication — no typing or speaking needed.',
  },
  {
    number: '4',
    icon: '📋',
    title: 'Your history is saved',
    desc: 'Every message appears in the Conversation tab as a chat. Tap any bubble to repeat it. Download or clear from Settings.',
  },
]

export default function HelpModal({ isOpen, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    // Backdrop — click outside to close
    <div className="help-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="How VoiceBridge works">
      <div className="help-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="help-header">
          <div className="help-title-row">
            <span className="help-icon">💬</span>
            <h2 className="help-title">How VoiceBridge works</h2>
          </div>
          <button className="help-close" onClick={onClose} aria-label="Close help">✕</button>
        </div>

        {/* Steps */}
        <div className="help-steps">
          {STEPS.map((step) => (
            <div key={step.number} className="help-step">
              <div className="help-step-num">{step.number}</div>
              <div className="help-step-body">
                <div className="help-step-title">
                  <span style={{ fontSize: 18 }}>{step.icon}</span>
                  {step.title}
                </div>
                <div className="help-step-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Privacy note */}
        <div className="help-privacy">
          🔒 Everything runs inside your browser. No audio or text is ever sent to any server.
        </div>

        {/* Close button */}
        <button className="btn btn-primary help-done" onClick={onClose}>
          Got it — let's start
        </button>
      </div>
    </div>
  )
}