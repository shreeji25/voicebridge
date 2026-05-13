// components/EmergencyCard.js
// SOS Emergency Card - displays critical health info in user's language
// Features: Name, blood type, medical conditions, allergies, emergency info in multiple languages
// Accessible from SOS button anywhere in the app
// FIX: Renders via React Portal so it covers the ENTIRE screen, not just the current module

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { translateText } from '../lib/translate'

export default function EmergencyCard({ 
  langCode, 
  onClose, 
  t,
  initialData = null 
}) {
  const [name, setName] = useState(initialData?.name || '')
  const [bloodType, setBloodType] = useState(initialData?.bloodType || '')
  const [condition, setCondition] = useState(initialData?.condition || '')
  const [allergies, setAllergies] = useState(initialData?.allergies || '')
  const [emergencyInfo, setEmergencyInfo] = useState(initialData?.emergencyInfo || '')
  const [isEditing, setIsEditing] = useState(!initialData)
  const [translatedInfo, setTranslatedInfo] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { speak } = useSpeechSynthesis()

  // Wait for DOM to be ready before portaling
  useEffect(() => {
    setMounted(true)
    // Prevent background scroll when card is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Auto-translate emergency info to user's language
  useEffect(() => {
    async function translateEmergencyInfo() {
      if (!emergencyInfo || langCode === 'en-US') {
        setTranslatedInfo(emergencyInfo)
        return
      }
      try {
        setIsTranslating(true)
        const translated = await translateText(emergencyInfo, 'en-US', langCode)
        setTranslatedInfo(translated)
      } catch (err) {
        console.error('Translation failed:', err)
        setTranslatedInfo(emergencyInfo)
      } finally {
        setIsTranslating(false)
      }
    }
    translateEmergencyInfo()
  }, [emergencyInfo, langCode])

  function handleSave() {
    const cardData = {
      name,
      bloodType,
      condition,
      allergies,
      emergencyInfo,
      updatedAt: new Date().toISOString(),
    }
    try {
      localStorage.setItem('vb_emergencyCard', JSON.stringify(cardData))
    } catch (e) {
      console.error('Failed to save emergency card:', e)
    }
    setIsEditing(false)
  }

  function handleShare() {
    const text = `
EMERGENCY CARD:
Name: ${name}
Blood Type: ${bloodType}
Medical Condition: ${condition}
Allergies: ${allergies}

Medical Info:
${translatedInfo || emergencyInfo}
    `.trim()

    if (navigator.share) {
      navigator.share({ title: 'Emergency Card', text }).catch(err => console.error('Share failed:', err))
    } else {
      navigator.clipboard?.writeText(text).then(() => {
        alert(t?.copiedToClipboard || 'Emergency card information copied to clipboard')
      })
    }
  }

  function handleSpeak() {
    const textToSpeak = translatedInfo || emergencyInfo
    if (!textToSpeak) return
    try {
      speak({ text: textToSpeak, lang: langCode })
    } catch (err) {
      console.error('Speak failed:', err)
    }
  }

  function handleClose() {
    if (isEditing && (name || bloodType || condition || allergies || emergencyInfo)) {
      if (window.confirm(t?.unsavedChanges || 'You have unsaved changes. Close anyway?')) {
        onClose?.()
      }
    } else {
      onClose?.()
    }
  }

  // Trap Escape key
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isEditing, name, bloodType, condition, allergies, emergencyInfo])

  const cardContent = (
    // This overlay sits at the very top of the DOM (body), covering everything
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: 'var(--bg-card, #fff)',
          borderRadius: 'var(--radius, 12px)',
          width: '100%',
          maxWidth: 520,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={t?.emergencyCard || 'Emergency Card'}
        aria-modal="true"
      >
        {/* Header */}
        <div className="emergency-card-header" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border, #e5e7eb)',
          background: 'var(--red, #ef4444)',
          color: '#fff',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🆘</span>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#fff' }}>
              {t?.emergencyCard || 'Emergency Card'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label={t?.close || 'Close'}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              cursor: 'pointer',
              fontSize: 16,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: t?.name || 'Name', value: name, setter: setName, placeholder: t?.namePlaceholder || 'Full name', type: 'input' },
                { label: t?.medicalCondition || 'Medical Condition', value: condition, setter: setCondition, placeholder: 'e.g., Asthma, Diabetes', type: 'input' },
                { label: t?.allergies || 'Allergies', value: allergies, setter: setAllergies, placeholder: 'e.g., Penicillin, Peanuts', type: 'input' },
              ].map(({ label, value, setter, placeholder }) => (
                <div key={label}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted, #6b7280)', display: 'block', marginBottom: 4 }}>{label}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className="emergency-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              ))}

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted, #6b7280)', display: 'block', marginBottom: 4 }}>
                  {t?.bloodType || 'Blood Type'}
                </label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="emergency-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                >
                  <option value="">{t?.selectBloodType || 'Select blood type'}</option>
                  {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(bt => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted, #6b7280)', display: 'block', marginBottom: 4 }}>
                  {t?.emergencyInfo || 'Emergency Information'}
                </label>
                <textarea
                  value={emergencyInfo}
                  onChange={(e) => setEmergencyInfo(e.target.value)}
                  placeholder={t?.emergencyInfoPlaceholder || 'Additional medical information, emergency contacts, etc.'}
                  className="emergency-input"
                  rows={5}
                  style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: t?.name || 'Name', value: name },
                { label: t?.bloodType || 'Blood Type', value: bloodType },
                { label: t?.medicalCondition || 'Condition', value: condition },
                { label: t?.allergies || 'Allergies', value: allergies },
              ].map(({ label, value }) => (
                <div key={label} className="emergency-field-display" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'var(--bg-inset, #f9fafb)',
                  borderRadius: 8,
                  border: '1px solid var(--border, #e5e7eb)',
                }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted, #6b7280)' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: value ? 'var(--text, #111)' : 'var(--text-dim, #9ca3af)' }}>
                    {value || '—'}
                  </span>
                </div>
              ))}

              {emergencyInfo && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted, #6b7280)', marginBottom: 6 }}>
                    🔤 {t?.medicalInfoIn || 'Medical information in'} <strong>{langCode}</strong>
                  </div>
                  {isTranslating ? (
                    <div style={{ color: 'var(--text-muted, #6b7280)', fontSize: 13 }}>
                      {t?.translating || 'Translating…'}
                    </div>
                  ) : (
                    <div style={{
                      padding: 12,
                      background: 'var(--bg-inset, #f9fafb)',
                      borderRadius: 8,
                      border: '1px solid var(--border, #e5e7eb)',
                      fontSize: 13,
                      lineHeight: '1.6',
                      color: 'var(--text, #111)',
                    }}>
                      {translatedInfo || emergencyInfo}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border, #e5e7eb)',
          background: 'var(--bg-card, #fff)',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted, #6b7280)', marginBottom: 12 }}>
            💡 {t?.keepInfoUpdated || 'Keep this information up to date. It is accessible from the SOS button at any time.'}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {isEditing ? (
              <>
                <button className="btn btn-primary" onClick={handleSave}>💾 {t?.save || 'Save'}</button>
                <button className="btn btn-secondary" onClick={handleClose}>{t?.cancel || 'Cancel'}</button>
              </>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>✏️ {t?.edit || 'Edit'}</button>
                <button
                  className="btn btn-secondary"
                  onClick={handleShare}
                  disabled={!name && !bloodType && !condition && !allergies && !emergencyInfo}
                >
                  📤 {t?.share || 'Share'}
                </button>
                {emergencyInfo && (
                  <button className="btn btn-secondary" onClick={handleSpeak}>
                    🔊 {t?.speak || 'Speak'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // Portal renders to document.body, outside of any module container
  if (!mounted) return null
  return createPortal(cardContent, document.body)
}