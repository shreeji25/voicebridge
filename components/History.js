// components/History.js
// Session conversation log — two display modes:
//   chatMode=false (default) → classic list with icons, timestamps, re-speak
//   chatMode=true            → WhatsApp-style chat bubbles for Conversation tab

import { useRef, useEffect } from 'react'

// ── Icon map by message source ─────────────────────────────────────────────
const SOURCE_ICON = {
  'voice':       '🎤',
  'type':        '⌨️',
  'quick-phrase':'⚡',
  'quick':       '⚡',
}

// ── Speak a history item again ─────────────────────────────────────────────
function speakItem(item, langCode) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(item.text)
  u.lang  = langCode
  u.rate  = 0.95
  window.speechSynthesis.speak(u)
}

// ── Format timestamp ───────────────────────────────────────────────────────
function fmt(ts) {
  if (!ts) return ''
  const d = ts instanceof Date ? ts : new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// ── Download history as .txt ───────────────────────────────────────────────
function downloadHistory(items) {
  if (!items.length) return
  const text = items
    .map(i => `[${fmt(i.timestamp)}] ${SOURCE_ICON[i.source] || '💬'} ${i.text}`)
    .join('\n')
  const a    = document.createElement('a')
  a.href     = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  a.download = 'voicebridge-conversation.txt'
  a.click()
}

// ══════════════════════════════════════════════════════════════════════════
// CHAT BUBBLE MODE — used inside Conversation tab
// ══════════════════════════════════════════════════════════════════════════
function ChatHistory({ items, langCode, onClear }) {
  const bottomRef = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [items])

  if (!items.length) {
    return (
      <div className="chat-empty">
        <span style={{ fontSize: 32 }}>💬</span>
        <p>Your conversation will appear here.</p>
        <p style={{ fontSize: 12, opacity: 0.5 }}>Type a message or tap a Quick Phrase below.</p>
      </div>
    )
  }

  return (
    <div className="chat-wrap">
      <div className="chat-list">
        {items.map((item, i) => (
          <div key={i} className={`chat-bubble-row ${item.source === 'voice' ? 'them' : 'you'}`}>
            <div
              className={`chat-bubble ${item.source === 'voice' ? 'bubble-them' : 'bubble-you'}`}
              onClick={() => speakItem(item, langCode)}
              title="Tap to repeat"
            >
              <span className="bubble-icon">{SOURCE_ICON[item.source] || '💬'}</span>
              {item.text}
            </div>
            <div className="bubble-time">{fmt(item.timestamp)}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Toolbar */}
      <div className="chat-toolbar">
        <button className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 14px' }}
          onClick={() => downloadHistory(items)}>
          ⬇ Download
        </button>
        <button className="btn btn-danger" style={{ fontSize: 12, padding: '6px 14px' }}
          onClick={onClear}>
          🗑 Clear
        </button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// LIST MODE — used in Voice-to-Text and Text-to-Speech tabs
// ══════════════════════════════════════════════════════════════════════════
function ListHistory({ items, langCode, onClear }) {
  if (!items.length) {
    return (
      <div className="card">
        <div className="card-title"><span>📋</span> Session History</div>
        <div className="history-empty">
          No messages yet — your conversation will appear here.
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-title" style={{ justifyContent: 'space-between' }}>
        <span><span>📋</span> Session History</span>
        <div className="btn-row" style={{ gap: 8 }}>
          <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 12px' }}
            onClick={() => downloadHistory(items)}>
            ⬇ Download
          </button>
          <button className="btn btn-danger" style={{ fontSize: 12, padding: '4px 12px' }}
            onClick={onClear}>
            🗑 Clear
          </button>
        </div>
      </div>

      <div className="history-list">
        {[...items].reverse().map((item, i) => (
          <div
            key={i}
            className="history-item"
            onClick={() => speakItem(item, langCode)}
            title="Click to repeat this message"
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && speakItem(item, langCode)}
          >
            <div className="history-icon">{SOURCE_ICON[item.source] || '💬'}</div>
            <div className="history-text">{item.text}</div>
            <div className="history-meta">{fmt(item.timestamp)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN EXPORT — switches between modes via chatMode prop
// ══════════════════════════════════════════════════════════════════════════
export default function History({ items = [], langCode, onClear, chatMode = false }) {
  if (chatMode) {
    return <ChatHistory items={items} langCode={langCode} onClear={onClear} />
  }
  return <ListHistory items={items} langCode={langCode} onClear={onClear} />
}