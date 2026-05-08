// components/EmergencyCard.js
// SOS Emergency Card - displays critical health info in user's language
// Features: Name, blood type, medical conditions, allergies, emergency info in multiple languages
// Accessible from SOS button anywhere in the app

import { useState, useEffect } from 'react'
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

  const { speak } = useSpeechSynthesis()

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
    // Save to localStorage
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
    const shareData = {
      name,
      bloodType,
      condition,
      allergies,
      emergencyInfo: translatedInfo || emergencyInfo,
    }
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
      navigator.share({
        title: 'Emergency Card',
        text: text,
      }).catch(err => console.error('Share failed:', err))
    } else {
      // Fallback: copy to clipboard
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

  return (
    <div className="emergency-card-overlay" onClick={handleClose}>
      <div 
        className="emergency-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={t?.emergencyCard || 'Emergency Card'}
        aria-modal="true"
      >
        {/* Header with close button */}
        <div className="emergency-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🆘</span>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
              {t?.emergencyCard || 'Emergency Card'}
            </h2>
          </div>
          <button 
            className="emergency-card-close" 
            onClick={handleClose}
            aria-label={t?.close || 'Close'}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="emergency-card-content">
          {isEditing ? (
            <>
              {/* Edit mode */}
              <div className="emergency-card-fields">
                <div className="emergency-card-field">
                  <label>{t?.name || 'Name'}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t?.namePlaceholder || 'Full name'}
                    className="emergency-input"
                  />
                </div>

                <div className="emergency-card-field">
                  <label>{t?.bloodType || 'Blood Type'}</label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="emergency-input"
                  >
                    <option value="">{t?.selectBloodType || 'Select blood type'}</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div className="emergency-card-field">
                  <label>{t?.medicalCondition || 'Medical Condition'}</label>
                  <input
                    type="text"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    placeholder={t?.conditionPlaceholder || 'e.g., Asthma, Diabetes'}
                    className="emergency-input"
                  />
                </div>

                <div className="emergency-card-field">
                  <label>{t?.allergies || 'Allergies'}</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder={t?.allergiesPlaceholder || 'e.g., Penicillin, Peanuts'}
                    className="emergency-input"
                  />
                </div>

                <div className="emergency-card-field">
                  <label>{t?.emergencyInfo || 'Emergency Information'}</label>
                  <textarea
                    value={emergencyInfo}
                    onChange={(e) => setEmergencyInfo(e.target.value)}
                    placeholder={t?.emergencyInfoPlaceholder || 'Additional medical information, emergency contacts, etc.'}
                    className="emergency-input"
                    rows={5}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* View mode */}
              <div className="emergency-card-display">
                <div className="emergency-field-display">
                  <span className="emergency-field-label">{t?.name || 'Name'}</span>
                  <span className="emergency-field-value">{name || '—'}</span>
                </div>

                <div className="emergency-field-display">
                  <span className="emergency-field-label">{t?.bloodType || 'Blood Type'}</span>
                  <span className="emergency-field-value">{bloodType || '—'}</span>
                </div>

                <div className="emergency-field-display">
                  <span className="emergency-field-label">{t?.medicalCondition || 'Condition'}</span>
                  <span className="emergency-field-value">{condition || '—'}</span>
                </div>

                <div className="emergency-field-display">
                  <span className="emergency-field-label">{t?.allergies || 'Allergies'}</span>
                  <span className="emergency-field-value">{allergies || '—'}</span>
                </div>

                {/* Emergency info in user's language */}
                {emergencyInfo && (
                  <div className="emergency-info-box">
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                      🔤 {t?.medicalInfoIn || 'Medical information in'} <strong>{langCode}</strong>
                    </div>
                    {isTranslating ? (
                      <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                        {t?.translating || 'Translating…'}
                      </div>
                    ) : (
                      <div style={{ 
                        padding: 12, 
                        background: 'var(--bg-inset)', 
                        borderRadius: 'var(--radius-sm)', 
                        border: '1px solid var(--border)',
                        fontSize: 13,
                        lineHeight: '1.6',
                        color: 'var(--text)'
                      }}>
                        {translatedInfo || emergencyInfo}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer with actions */}
        <div className="emergency-card-footer">
          <div className="emergency-card-note">
            💡 {t?.keepInfoUpdated || 'Keep this information up to date. It is accessible from the SOS button at any time.'}}
          </div>

          <div className="emergency-card-actions">
            {isEditing ? (
              <>
                <button 
                  className="btn btn-primary"
                  onClick={handleSave}
                  aria-label={t?.save || 'Save'}
                >
                  💾 {t?.save || 'Save'}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleClose}
                  aria-label={t?.cancel || 'Cancel'}
                >
                  {t?.cancel || 'Cancel'}
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(true)}
                  aria-label={t?.editCard || 'Edit card'}
                >
                  ✏️ {t?.edit || 'Edit'}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleShare}
                  disabled={!name && !bloodType && !condition && !allergies && !emergencyInfo}
                  aria-label={t?.shareCard || 'Share card'}
                >
                  📤 {t?.share || 'Share'}
                </button>
                {emergencyInfo && (
                  <button 
                    className="btn btn-secondary"
                    onClick={handleSpeak}
                    aria-label={t?.speakAriaLabel || 'Speak medical information'}
                  >
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
}