// components/Settings.js
// Full Settings page with:
// - Accessibility (font size slider, large text, high contrast, reduce animations)
// - Voice settings (rate, pitch, test voice)
// - Conversation history (message count, download txt/pdf, clear)
// - Browser compatibility (with mic permission status + test mic)
// - About & Privacy section

import { useState, useEffect, useCallback } from 'react'

// ── Toggle Switch ──────────────────────────────────────────────
function ToggleSwitch({ checked, onChange, label, icon, description }) {
  return (
    <label className="toggle-row" title={description}>
      <div className="toggle-left">
        {icon && <span className="toggle-icon">{icon}</span>}
        <div>
          <div className="toggle-label">{label}</div>
          {description && <div className="toggle-desc">{description}</div>}
        </div>
      </div>
      <div
        className={`toggle-switch ${checked ? 'on' : ''}`}
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onChange(!checked)}
      >
        <div className="toggle-thumb" />
      </div>
    </label>
  )
}

// ── Section wrapper ────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="settings-section">
      <div className="settings-section-title">{title}</div>
      {children}
    </div>
  )
}

export default function Settings({
  history,
  onClearHistory,
  // accessibility props passed from index.js
  largeText, onLargeTextChange,
  highContrast, onHighContrastChange,
}) {
  // ── Voice settings state ───────────────────────────────────
  const [rate, setRate]   = useState(1)
  const [pitch, setPitch] = useState(1)
  const [isTesting, setIsTesting] = useState(false)

  // ── Accessibility extras ───────────────────────────────────
  const [reduceMotion, setReduceMotion] = useState(false)
  const [fontSize, setFontSize]         = useState(2) // 1=small 2=medium 3=large 4=xl

  // ── Mic permission ─────────────────────────────────────────
  const [micStatus, setMicStatus]   = useState('unknown') // unknown | granted | denied | prompt
  const [micTesting, setMicTesting] = useState(false)

  // ── Browser support ────────────────────────────────────────
  const hasSR = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  const hasSS = typeof window !== 'undefined' && 'speechSynthesis' in window

  // Check mic permission on mount
  useEffect(() => {
    if (!navigator.permissions) return
    navigator.permissions.query({ name: 'microphone' })
      .then(result => {
        setMicStatus(result.state)
        result.onchange = () => setMicStatus(result.state)
      })
      .catch(() => setMicStatus('unknown'))
  }, [])

  // Apply reduce-motion class to body
  useEffect(() => {
    document.body.classList.toggle('reduce-motion', reduceMotion)
  }, [reduceMotion])

  // Apply font-size scale
  const fontSizeLabels = ['Small', 'Medium', 'Large', 'Extra large']
  useEffect(() => {
    document.documentElement.setAttribute('data-fontsize', fontSize)
  }, [fontSize])

  // ── Test voice ────────────────────────────────────────────
  const handleTestVoice = () => {
    if (!hasSS) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance('Hello! This is how I will sound when speaking for you.')
    u.rate = rate; u.pitch = pitch
    u.onstart = () => setIsTesting(true)
    u.onend   = () => setIsTesting(false)
    u.onerror = () => setIsTesting(false)
    window.speechSynthesis.speak(u)
  }

  // ── Test mic ──────────────────────────────────────────────
  const handleTestMic = useCallback(async () => {
    setMicTesting(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(t => t.stop())
      setMicStatus('granted')
    } catch {
      setMicStatus('denied')
    } finally {
      setMicTesting(false)
    }
  }, [])

  // ── Download conversation as .txt ─────────────────────────
  const handleDownloadTxt = () => {
    if (!history.length) return
    const lines = history.map(h => {
      const time = h.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ''
      const type = h.type === 'voice' ? '[Voice]' : '[Typed]'
      return `${time} ${type} ${h.text}`
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const a    = document.createElement('a')
    a.href     = URL.createObjectURL(blob)
    a.download = `voicebridge-conversation-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
  }

  // ── Mic status badge ──────────────────────────────────────
  const micBadge = {
    granted: { label: 'Microphone: Granted ✓',  color: 'var(--accent3)' },
    denied:  { label: 'Microphone: Denied ✗',   color: 'var(--red)' },
    prompt:  { label: 'Microphone: Not asked yet', color: 'var(--yellow)' },
    unknown: { label: 'Microphone: Status unknown', color: 'var(--text-muted)' },
  }[micStatus] || { label: 'Microphone: Unknown', color: 'var(--text-muted)' }

  return (
    <div className="settings-page">

      {/* ── ACCESSIBILITY ──────────────────────────────────── */}
      <Section title="♿ Accessibility">
        <ToggleSwitch
          checked={largeText}
          onChange={onLargeTextChange}
          label="Large text & buttons"
          icon="🔡"
          description="Makes all text and buttons bigger for easier reading"
        />
        <ToggleSwitch
          checked={highContrast}
          onChange={onHighContrastChange}
          label="High contrast"
          icon="◑"
          description="Increases colour contrast for low-vision users"
        />
        <ToggleSwitch
          checked={reduceMotion}
          onChange={setReduceMotion}
          label="Reduce animations"
          icon="⏸"
          description="Stops pulse and wave animations — helpful for motion sensitivity"
        />

        {/* Font size slider */}
        <div className="settings-row">
          <div className="settings-row-label">
            <span>🔠</span>
            <div>
              <div className="toggle-label">Font size</div>
              <div className="toggle-desc">Currently: {fontSizeLabels[fontSize - 1]}</div>
            </div>
          </div>
          <div className="font-slider-wrap">
            <span className="font-sz-label">A</span>
            <input
              type="range" min={1} max={4} step={1}
              value={fontSize}
              onChange={e => setFontSize(Number(e.target.value))}
              style={{ flex: 1 }}
              aria-label="Font size"
            />
            <span className="font-sz-label large">A</span>
          </div>
          <div className="font-size-ticks">
            {fontSizeLabels.map((l, i) => (
              <span key={l} className={`font-tick ${fontSize === i + 1 ? 'active' : ''}`}>{l}</span>
            ))}
          </div>
        </div>
      </Section>

      {/* ── VOICE SETTINGS ─────────────────────────────────── */}
      <Section title="🔊 Voice settings">
        <div className="settings-row">
          <div className="settings-row-label">
            <span>⚡</span>
            <div>
              <div className="toggle-label">Speech speed</div>
              <div className="toggle-desc">{rate.toFixed(1)}× — {rate < 0.8 ? 'Slow' : rate > 1.3 ? 'Fast' : 'Normal'}</div>
            </div>
          </div>
          <input type="range" min={0.5} max={2} step={0.1}
            value={rate} onChange={e => setRate(parseFloat(e.target.value))}
            style={{ width: '100%', marginTop: 8 }} aria-label="Speech speed"
          />
        </div>

        <div className="settings-row">
          <div className="settings-row-label">
            <span>🎵</span>
            <div>
              <div className="toggle-label">Speech pitch</div>
              <div className="toggle-desc">{pitch.toFixed(1)} — {pitch < 0.8 ? 'Low' : pitch > 1.3 ? 'High' : 'Normal'}</div>
            </div>
          </div>
          <input type="range" min={0.5} max={2} step={0.1}
            value={pitch} onChange={e => setPitch(parseFloat(e.target.value))}
            style={{ width: '100%', marginTop: 8 }} aria-label="Speech pitch"
          />
        </div>

        <button
          className={`btn ${isTesting ? 'btn-danger' : 'btn-secondary'}`}
          style={{ width: '100%', marginTop: 4 }}
          onClick={isTesting ? () => { window.speechSynthesis.cancel(); setIsTesting(false) } : handleTestVoice}
          disabled={!hasSS}
        >
          {isTesting ? '⏹ Stop test' : '▶ Test voice with these settings'}
        </button>
        {!hasSS && (
          <div className="settings-warn">Text-to-speech not supported in this browser.</div>
        )}
      </Section>

      {/* ── CONVERSATION HISTORY ───────────────────────────── */}
      <Section title="📋 Conversation history">
        <div className="settings-privacy-note">
          🔒 All data stays on your device. Nothing is stored on any server.
        </div>

        {/* Message count */}
        <div className="history-count-badge">
          {history.length === 0
            ? 'No messages yet'
            : `${history.length} message${history.length !== 1 ? 's' : ''} in your current session`}
        </div>

        <button
          className="btn btn-secondary"
          style={{ width: '100%', marginBottom: 10 }}
          onClick={handleDownloadTxt}
          disabled={!history.length}
        >
          ⬇ Download conversation (.txt)
        </button>

        <button
          className="btn btn-danger-outline"
          style={{ width: '100%' }}
          onClick={() => {
            if (window.confirm(`Clear all ${history.length} messages? This cannot be undone.`)) {
              onClearHistory()
            }
          }}
          disabled={!history.length}
        >
          🗑 Clear conversation history
        </button>
      </Section>

      {/* ── BROWSER COMPATIBILITY ──────────────────────────── */}
      <Section title="🌐 Browser compatibility">
        <div className="compat-list">
          <div className={`compat-item ${hasSR ? 'ok' : 'fail'}`}>
            {hasSR ? '✓' : '✗'} Voice recognition {hasSR ? 'available' : 'not available'}
          </div>
          <div className={`compat-item ${hasSS ? 'ok' : 'fail'}`}>
            {hasSS ? '✓' : '✗'} Text-to-speech {hasSS ? 'available' : 'not available'}
          </div>
          <div className="compat-item" style={{ color: micBadge.color }}>
            {micBadge.label}
          </div>
        </div>

        <button
          className="btn btn-secondary"
          style={{ width: '100%', marginTop: 12 }}
          onClick={handleTestMic}
          disabled={micTesting}
        >
          {micTesting ? '🎤 Testing mic…' : '🎤 Test microphone permission'}
        </button>

        {micStatus === 'denied' && (
          <div className="settings-warn" style={{ color: 'var(--red)' }}>
            Mic access is blocked. Go to your browser settings → Site permissions → Microphone → Allow this site.
          </div>
        )}
        {micStatus === 'granted' && (
          <div className="settings-warn" style={{ color: 'var(--accent3)' }}>
            Microphone is ready to use.
          </div>
        )}

        {!hasSR && (
          <div className="settings-warn">
            Voice recognition requires Google Chrome or Microsoft Edge. Firefox is not supported.
          </div>
        )}
      </Section>

      {/* ── ABOUT & PRIVACY ────────────────────────────────── */}
      <Section title="ℹ️ About & privacy">
        <div className="about-grid">
          <div className="about-item">
            <div className="about-label">Version</div>
            <div className="about-value">1.0.0</div>
          </div>
          <div className="about-item">
            <div className="about-label">Built with</div>
            <div className="about-value">Next.js + Web Speech API</div>
          </div>
          <div className="about-item">
            <div className="about-label">Cost</div>
            <div className="about-value">100% free, forever</div>
          </div>
          <div className="about-item">
            <div className="about-label">Data sent to servers</div>
            <div className="about-value" style={{ color: 'var(--accent3)' }}>None — ever</div>
          </div>
        </div>
        <div className="settings-privacy-note" style={{ marginTop: 12 }}>
          All speech recognition and text-to-speech processing happens entirely inside your browser using the built-in Web Speech API. No audio, text, or personal data is ever transmitted to any external server. No account or sign-up is required.
        </div>
      </Section>

    </div>
  )
}