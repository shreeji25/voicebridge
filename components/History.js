// components/History.js
// chatMode=true  → WhatsApp-style chat bubbles, auto-scroll, Download + Clear in header
// chatMode=false → original list style

import { useEffect, useRef } from 'react'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'

const TYPE_ICONS = { voice: '🎤', typed: '⌨️', quick: '⚡' }

function formatTime(date) {
  if (!date) return ''
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function downloadHistory(items) {
  if (!items.length) return
  const lines = items.map(h =>
    `${formatTime(h.timestamp)}  ${TYPE_ICONS[h.type] || ''}  ${h.text}`
  )
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `voicebridge-${new Date().toISOString().slice(0, 10)}.txt`
  a.click()
}

export default function History({ items, langCode, onClear, chatMode = false }) {
  const { speak } = useSpeechSynthesis()
  const bottomRef = useRef(null)

  // Auto-scroll to newest message
  useEffect(() => {
    if (chatMode && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [items, chatMode])

  const handleRepeat = (item) => {
    speak({ text: item.text, lang: item.lang || langCode })
  }

  // ── CHAT BUBBLE MODE ─────────────────────────────────────
  if (chatMode) {
    return (
      <div className="card chat-card">
        {/* Header: title + Download + Clear */}
        <div className="chat-header">
          <div className="card-title" style={{ margin: 0 }}>
            <span>💬</span> Conversation
            {items.length > 0 && (
              <span className="badge" style={{ marginLeft: 8 }}>{items.length}</span>
            )}
          </div>
          {items.length > 0 && (
            <div className="chat-actions">
              <button
                className="btn btn-secondary chat-action-btn"
                onClick={() => downloadHistory(items)}
              >
                ⬇ Download
              </button>
              <button
                className="btn btn-danger chat-action-btn"
                onClick={onClear}
              >
                🗑 Clear
              </button>
            </div>
          )}
        </div>

        {/* Bubbles */}
        <div className="chat-bubbles">
          {items.length === 0 ? (
            <div className="chat-empty">
              <div className="chat-empty-icon">💬</div>
              <div>No messages yet.</div>
              <div style={{ fontSize: 13, marginTop: 4, opacity: 0.7 }}>
                Tap a quick phrase above, or use the Voice / Text tabs.
              </div>
            </div>
          ) : (
            items.map((item, idx) => {
              const isLeft = item.type === 'voice'
              return (
                <div key={idx} className={`bubble-row ${isLeft ? 'bubble-left' : 'bubble-right'}`}>
                  <div
                    className={`bubble ${isLeft ? 'bubble-voice' : 'bubble-typed'}`}
                    onClick={() => handleRepeat(item)}
                    title="Tap to repeat"
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && handleRepeat(item)}
                  >
                    <span className="bubble-icon">{TYPE_ICONS[item.type] || '💬'}</span>
                    <span className="bubble-text">{item.text}</span>
                  </div>
                  <div className={`bubble-meta ${isLeft ? '' : 'bubble-meta-right'}`}>
                    {formatTime(item.timestamp)}
                  </div>
                </div>
              )
            })
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    )
  }

  // ── LIST MODE ────────────────────────────────────────────
  return (
    <div className="card">
      <div className="card-title" style={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center', width: '100%' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>📋</span> Session history
          {items.length > 0 && <span className="badge">{items.length}</span>}
        </span>
        {items.length > 0 && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: 12 }} onClick={() => downloadHistory(items)}>⬇ Download</button>
            <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: 12 }} onClick={onClear}>Clear</button>
          </div>
        )}
      </div>
      <div className="history-list">
        {items.length === 0 ? (
          <div className="history-empty">No messages yet.</div>
        ) : (
          [...items].reverse().map((item, idx) => (
            <div key={idx} className="history-item" onClick={() => handleRepeat(item)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && handleRepeat(item)}>
              <span className="history-icon">{TYPE_ICONS[item.type] || '💬'}</span>
              <span className="history-text">{item.text}</span>
              <span className="history-meta">{formatTime(item.timestamp)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}