// components/History.js
// Shows a session history of all communications (spoken or typed).
// Items can be clicked to repeat them as speech.

import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'

const TYPE_ICONS = {
  voice: '🎤',
  typed: '⌨️',
  quick: '⚡',
}

// Format a Date object into a short HH:MM string
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function History({ items, langCode, onClear }) {
  const { speak } = useSpeechSynthesis()

  const handleRepeat = (item) => {
    speak({ text: item.text, lang: item.lang || langCode })
  }

  return (
    <div className="card">
      <div className="card-title" style={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center', width: '100%' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>📋</span> Session History
          {items.length > 0 && <span className="badge">{items.length}</span>}
        </span>
        {items.length > 0 && (
          <button
            className="btn btn-secondary"
            style={{ padding: '4px 12px', fontSize: 12 }}
            onClick={onClear}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="history-list">
        {items.length === 0 ? (
          <div className="history-empty">
            No messages yet. Start speaking or typing to build a history.
          </div>
        ) : (
          // Show newest first
          [...items].reverse().map((item, idx) => (
            <div
              key={idx}
              className="history-item"
              onClick={() => handleRepeat(item)}
              title="Click to repeat this message"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleRepeat(item)}
            >
              <span className="history-icon">{TYPE_ICONS[item.type] || '💬'}</span>
              <span className="history-text">{item.text}</span>
              <span className="history-meta">
                {formatTime(item.timestamp)}<br />
                <span style={{ opacity: 0.6 }}>{item.lang}</span>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}