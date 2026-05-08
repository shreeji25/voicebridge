// components/Settings.js
// UPDATED: Offline language packs with download progress, new accessibility toggles,
// haptic feedback, symbol/picture mode
// Props: history, onClearHistory, largeText, onLargeTextChange,
//        highContrast, onHighContrastChange, fromLanguage, toLanguage,
//        onOpenLanguageSetup, onResetSetup, theme, onThemeChange, t

import { useState, useEffect } from "react";
import { getT } from "../lib/translations";
import { LANGUAGES } from "../lib/languages";

// Mock offline language packs - in real app, would be actual downloadable packages
const LANGUAGE_PACKS = [
  { lang: 'in Hindi', code: 'hi-IN', size: '12 MB', status: 'downloaded' },
  { lang: 'us English', code: 'en-US', size: '10 MB', status: 'downloaded' },
  { lang: 'in Gujarati', code: 'gu-IN', size: '11 MB', status: 'available' },
  { lang: 'in Marathi', code: 'mr-IN', size: '11 MB', status: 'available' },
  { lang: 'es Spanish', code: 'es-ES', size: '12 MB', status: 'available' },
  { lang: 'fr French', code: 'fr-FR', size: '13 MB', status: 'available' },
]

export default function Settings({
  history = [],
  onClearHistory,
  largeText,
  onLargeTextChange,
  highContrast,
  onHighContrastChange,
  fromLanguage = "en-US",
  toLanguage   = "hi-IN",
  onOpenLanguageSetup,
  onResetSetup,
  theme,
  onThemeChange,
  t: tProp,
}) {
  const t = tProp || getT(fromLanguage);

  const [reduceMotion, setReduceMotion] = useState(false);
  const [fontSize, setFontSize]         = useState("medium");
  const [rate, setRate]                 = useState(1.0);
  const [pitch, setPitch]               = useState(1.0);
  const [volume, setVolume]             = useState(100);
  const [micStatus, setMicStatus]       = useState("unknown");
  const [openSection, setOpenSection]   = useState("language");
  const [isOnline, setIsOnline]         = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  // New accessibility features
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [symbolPictureMode, setSymbolPictureMode] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  // Language pack downloads
  const [downloadingPacks, setDownloadingPacks] = useState({});
  const [packProgress, setPackProgress] = useState({});

  const [voiceSupported] = useState(
    () => typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  );
  const [ttsSupported] = useState(
    () => typeof window !== "undefined" && "speechSynthesis" in window
  );

  const fromLangObj = LANGUAGES.find(l => l.code === fromLanguage);
  const toLangObj   = LANGUAGES.find(l => l.code === toLanguage);

  useEffect(() => {
    const on  = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  useEffect(() => { 
    document.body.classList.toggle("reduce-motion", reduceMotion); 
  }, [reduceMotion]);
  
  useEffect(() => { 
    document.documentElement.setAttribute("data-fontsize", fontSize); 
  }, [fontSize]);

  useEffect(() => { 
    document.body.classList.toggle("dyslexia-font", dyslexiaFont); 
  }, [dyslexiaFont]);

  useEffect(() => { 
    document.body.classList.toggle("symbol-picture-mode", symbolPictureMode); 
  }, [symbolPictureMode]);

  function handleTestVoice() {
    if (!ttsSupported) return;
    const u = new SpeechSynthesisUtterance(t.settingsTestVoice || "Testing voice output");
    u.lang = fromLanguage; u.rate = rate; u.pitch = pitch; u.volume = volume / 100;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    triggerHaptic();
  }

  async function handleTestMic() {
    try { 
      await navigator.mediaDevices.getUserMedia({ audio: true }); 
      setMicStatus("granted"); 
    }
    catch { 
      setMicStatus("denied"); 
    }
  }

  function handleDownload() {
    if (!history.length) return;
    const lines = history.map((m) => `[${new Date(m.timestamp).toLocaleTimeString()}]  ${m.text}`);
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `voicebridge-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
  }

  function handleExportPDF() {
    // In real app, use a PDF library like jsPDF
    if (!history.length) return;
    const content = history
      .map((m) => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.text}`)
      .join('\n');
    const blob = new Blob([content], { type: "application/pdf" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `voicebridge-${new Date().toISOString().slice(0, 10)}.pdf`;
    a.click();
  }

  function handleClear() {
    if (window.confirm(t.historyClearConfirm || "Clear all history?")) onClearHistory?.();
  }

  function handleDownloadLanguagePack(code) {
    // Simulate download progress
    setDownloadingPacks(prev => ({ ...prev, [code]: true }));
    setPackProgress(prev => ({ ...prev, [code]: 0 }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setDownloadingPacks(prev => ({ ...prev, [code]: false }));
        setPackProgress(prev => ({ ...prev, [code]: 100 }));
        // Mark as downloaded
        setTimeout(() => {
          setPackProgress(prev => ({ ...prev, [code]: 0 }));
        }, 1000);
      } else {
        setPackProgress(prev => ({ ...prev, [code]: Math.min(progress, 99) }));
      }
    }, 300);
  }

  function triggerHaptic() {
    if (hapticFeedback && navigator.vibrate) {
      navigator.vibrate(10);
    }
  }

  const toggleSection = (key) => setOpenSection((prev) => (prev === key ? null : key));
  const isDark = theme === "dark";

  const micStatusText =
    micStatus === "granted" ? (t.settingsGranted   || "Granted")
    : micStatus === "denied"  ? (t.settingsDenied  || "Denied")
    : micStatus === "prompt"  ? (t.settingsPrompt  || "Pending")
    :                           (t.settingsUnknown || "Unknown");

  const micBadgeClass =
    micStatus === "granted" ? "badge-ok" : micStatus === "denied" ? "badge-fail" : "badge-warn";

  function SectionHeader({ sectionKey, icon, label }) {
    const isOpen = openSection === sectionKey;
    return (
      <button className="sp-header" onClick={() => { toggleSection(sectionKey); triggerHaptic(); }} aria-expanded={isOpen}>
        <div className="sp-header-left">
          <span className="sp-icon">{icon}</span>
          <span className="sp-title">{label}</span>
        </div>
        <svg className={`sp-chevron${isOpen ? " open" : ""}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="4,6 8,10 12,6" />
        </svg>
      </button>
    );
  }

  function ToggleRow({ checked, onChange, label, desc }) {
    return (
      <div className="sp-toggle-row">
        <div className="sp-toggle-left">
          <span className="sp-toggle-label">{label}</span>
          {desc && <span className="sp-toggle-desc">{desc}</span>}
        </div>
        <button
          className={`sp-toggle${checked ? " on" : ""}`}
          onClick={() => { onChange(!checked); triggerHaptic(); }}
          role="switch"
          aria-checked={checked}
        >
          <span className="sp-toggle-thumb" />
        </button>
      </div>
    );
  }

  function SliderRow({ label, displayValue, min, max, step, onInput }) {
    return (
      <div className="sp-slider-row">
        <div className="sp-slider-label">
          <span className="sp-slider-name">{label}</span>
          <span className="sp-slider-val">{displayValue}</span>
        </div>
        <input
          type="range"
          min={min} max={max} step={step}
          value={parseFloat(displayValue)}
          onChange={(e) => { onInput(parseFloat(e.target.value)); triggerHaptic(); }}
        />
      </div>
    );
  }

  return (
    <div className="settings-page">

      {/* Status badge */}
      <div className="sp-page-header">
        <h2 className="sp-page-title">{t.settingsTitle || "Settings"}</h2>
        <span className={`sp-status-badge${isOnline ? " online" : " offline"}`}>
          <span className="sp-status-dot" />
          {isOnline ? (t.statusOnline || "Online") : (t.statusOffline || "Offline")}
        </span>
      </div>

      {/* ── LANGUAGE SETTINGS ─────────────────────────────────────── */}
      <div className="sp-section">
        <SectionHeader sectionKey="language" icon="🌐" label={t.languageSettings || "Language Settings"} />
        {openSection === "language" && (
          <div className="sp-body">
            <div className="sp-lang-display">
              <div className="sp-lang-item">
                <span className="sp-lang-label">{t.settingsSpeaking || "SPEAKING"}</span>
                <span className="sp-lang-code">{fromLanguage}</span>
                <span className="sp-lang-name">{fromLangObj?.name || fromLanguage}</span>
              </div>
              <span className="sp-lang-arrow">→</span>
              <div className="sp-lang-item">
                <span className="sp-lang-label">{t.settingsOutput || "OUTPUT"}</span>
                <span className="sp-lang-code">{toLanguage}</span>
                <span className="sp-lang-name">{toLangObj?.name || toLanguage}</span>
              </div>
            </div>
            <div className="sp-lang-btn-row">
              <button className="sp-action-btn" onClick={() => { onOpenLanguageSetup?.(); triggerHaptic(); }}>
                🔄 {t.changeLanguages || "Change Languages"}
              </button>
              <button className="sp-danger-btn" onClick={() => { onResetSetup?.(); triggerHaptic(); }}>
                ↺ {t.resetRedoSetup || "Reset & Redo Setup"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── OFFLINE LANGUAGE PACKS ──────────────────────────────────── */}
      <div className="sp-section">
        <SectionHeader sectionKey="offline" icon="📦" label={t.offlineLanguagePacks || "Offline Language Packs"} />
        {openSection === "offline" && (
          <div className="sp-body">
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
              {t.downloadLanguages || "Download language packs for offline use. Each pack includes speech recognition & text-to-speech."}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {LANGUAGE_PACKS.map((pack) => (
                <div key={pack.code} className="sp-pack-item">
                  <div className="sp-pack-info">
                    <div className="sp-pack-lang">
                      <span className="sp-pack-code">{pack.code}</span>
                      <span className="sp-pack-name">{pack.lang}</span>
                    </div>
                    <span className="sp-pack-size">{pack.size} • Speech recognition & TTS</span>
                  </div>
                  
                  {packProgress[pack.code] > 0 && packProgress[pack.code] < 100 ? (
                    <div style={{ width: '100px' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>
                        {Math.round(packProgress[pack.code])}%
                      </div>
                      <div style={{ 
                        background: 'var(--bg-inset)', 
                        height: 4, 
                        borderRadius: 2, 
                        overflow: 'hidden' 
                      }}>
                        <div style={{ 
                          background: 'var(--accent)', 
                          height: '100%', 
                          width: `${packProgress[pack.code]}%`,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  ) : pack.status === 'downloaded' ? (
                    <button 
                      className="sp-badge"
                      style={{ background: 'var(--accent3)', color: 'white', cursor: 'default' }}
                    >
                      ✓ {t.downloaded || "Downloaded"}
                    </button>
                  ) : (
                    <button 
                      className="sp-action-btn"
                      onClick={() => { handleDownloadLanguagePack(pack.code); triggerHaptic(); }}
                      disabled={downloadingPacks[pack.code]}
                      style={{ width: '100px' }}
                    >
                      {downloadingPacks[pack.code] ? '⏳' : '↓'} {t.download || "Download"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── APPEARANCE ──────────────────────────────────────────────── */}
      <div className="sp-section">
        <SectionHeader sectionKey="appearance" icon="☀️" label={t.settingsAppearance || "Appearance"} />
        {openSection === "appearance" && (
          <div className="sp-body">
            <div className="sp-appear-row">
              <div className="sp-toggle-left">
                <span className="sp-toggle-label">
                  {isDark ? (t.settingsDarkMode || "Dark mode") : (t.settingsLightMode || "Light mode")}
                </span>
                <span className="sp-toggle-desc">
                  {t.settingsThemeDesc || "Switch between dark and light interface"}
                </span>
              </div>
              <button
                className={`sp-theme-btn${isDark ? " theme-dark" : " theme-light"}`}
                onClick={() => { onThemeChange?.(isDark ? "light" : "dark"); triggerHaptic(); }}
                aria-label={t.toggleTheme || 'Toggle theme'}
              >
                <span className="sp-theme-dot" style={{ background: isDark ? "#7c3aed" : "#f59e0b" }} />
                {isDark ? (t.settingsLightMode || "Switch to light") : (t.settingsDarkMode || "Switch to dark")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── ACCESSIBILITY ────────────────────────────────────────────── */}
      <div className="sp-section">
        <SectionHeader sectionKey="accessibility" icon="♿" label={t.settingsAccessibility || "Accessibility"} />
        {openSection === "accessibility" && (
          <div className="sp-body">
            <ToggleRow 
              checked={largeText}    
              onChange={onLargeTextChange}    
              label={t.settingsLargeText    || "Large text & buttons"}  
              desc={t.settingsLargeTextDesc    || "Increases font size and button size across the app"} 
            />
            <ToggleRow 
              checked={highContrast} 
              onChange={onHighContrastChange} 
              label={t.settingsHighContrast || "High contrast"}          
              desc={t.settingsHighContrastDesc || "Black and white mode for maximum readability"} 
            />
            <ToggleRow 
              checked={reduceMotion} 
              onChange={setReduceMotion}      
              label={t.settingsReduceMotion || "Reduce animations"}      
              desc={t.settingsReduceMotionDesc || "Disables all animations and transitions"} 
            />
            <ToggleRow 
              checked={dyslexiaFont} 
              onChange={setDyslexiaFont}      
              label={t.settingsDyslexiaFont || "Dyslexia-friendly font"}      
              desc={t.settingsDyslexiaFontDesc || "Uses specialized font for easier reading"} 
            />
            <ToggleRow 
              checked={symbolPictureMode} 
              onChange={setSymbolPictureMode}      
              label={t.settingsSymbolPictureMode || "Symbol / Picture mode"}      
              desc={t.settingsSymbolPictureModeDesc || "Shows symbols and pictures alongside text"} 
            />
            <ToggleRow 
              checked={screenReaderMode} 
              onChange={setScreenReaderMode}      
              label={t.settingsScreenReaderMode || "Screen reader mode"}      
              desc={t.settingsScreenReaderModeDesc || "Optimizes for screen reader compatibility"} 
            />
            <ToggleRow 
              checked={hapticFeedback} 
              onChange={setHapticFeedback}      
              label={t.settingsHapticFeedback || "Haptic feedback"}      
              desc={t.settingsHapticFeedbackDesc || "Vibration feedback on interactions (if device supports)"} 
            />
            
            <div className="sp-fontsize-row">
              <div className="sp-toggle-left">
                <span className="sp-toggle-label">{t.settingsFontSize || "Font size"}</span>
                <span className="sp-toggle-desc">{t.settingsFontSizeDesc || "Choose your preferred reading size"}</span>
              </div>
              <div className="sp-fontsize-pills">
                {[
                  ["small",  t.settingsFontSmall  || "Small"],
                  ["medium", t.settingsFontMedium || "Medium"],
                  ["large",  t.settingsFontLarge  || "Large"],
                  ["xlarge", t.settingsFontXLarge || "X-Large"],
                ].map(([key, lbl]) => (
                  <button 
                    key={key} 
                    className={`sp-pill${fontSize === key ? " active" : ""}`} 
                    onClick={() => { setFontSize(key); triggerHaptic(); }}
                    aria-label={`${t.fontSize || 'Font size'}: ${lbl}`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── VOICE SETTINGS ───────────────────────────────────────────── */}
      <div className="sp-section">
        <SectionHeader sectionKey="voice" icon="🎙️" label={t.settingsVoice || "Voice settings"} />
        {openSection === "voice" && (
          <div className="sp-body">
            <SliderRow 
              label={t.settingsSpeechRate  || "Speech rate"}  
              displayValue={rate.toFixed(1) + "×"} 
              min={0.5} max={2}   step={0.1} 
              onInput={setRate}   
            />
            <SliderRow 
              label={t.settingsSpeechPitch || "Speech pitch"} 
              displayValue={pitch.toFixed(1)}      
              min={0}   max={2}   step={0.1} 
              onInput={setPitch}  
            />
            <SliderRow 
              label={t.settingsVolume      || "Volume"}       
              displayValue={volume + "%"}           
              min={0}   max={100} step={1}   
              onInput={setVolume} 
            />
            <button 
              className="sp-action-btn" 
              onClick={handleTestVoice}
              aria-label={t.testVoice || 'Test voice'}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3 4.5l10 3.5-10 3.5V4.5z"/></svg>
              {t.settingsTestVoice || "Test voice"}
            </button>
          </div>
        )}
      </div>

      {/* ── CONVERSATION HISTORY ──────────────────────────────────────── */}
      <div className="sp-section">
        <SectionHeader sectionKey="history" icon="💬" label={t.settingsHistory || "Conversation history"} />
        {openSection === "history" && (
          <div className="sp-body">
            <div className="sp-hist-stat">
              <span className="sp-hist-count">{history.length}</span>
              <span className="sp-hist-sub">{t.settingsMessages || "messages this session"}</span>
            </div>
            <div className="sp-btn-row">
              <button 
                className="sp-action-btn" 
                onClick={() => { handleExportPDF(); triggerHaptic(); }} 
                disabled={!history.length}
                aria-label={t.exportPDF || 'Export as PDF'}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 12l-5-5 1.4-1.4L7 9.2V2h2v7.2l2.6-3.6L13 7l-5 5zm-6 2v-2h12v2H2z"/></svg>
                {t.settingsExportPDF || "Export PDF"}
              </button>
              <button 
                className="sp-action-btn" 
                onClick={() => { handleDownload(); triggerHaptic(); }} 
                disabled={!history.length}
                aria-label={t.downloadTxt || 'Download as text'}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 12l-5-5 1.4-1.4L7 9.2V2h2v7.2l2.6-3.6L13 7l-5 5zm-6 2v-2h12v2H2z"/></svg>
                {t.settingsDownload || "Download .txt"}
              </button>
              <button 
                className="sp-danger-btn" 
                onClick={handleClear} 
                disabled={!history.length}
                aria-label={t.clearHistory || 'Clear history'}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M6 2h4v1H6V2zM2 4h12v1H3.5l.8 9H11.7l.8-9H13v-1H2V4zM6 7h1v5H6V7zm3 0h1v5H9V7z"/></svg>
                {t.settingsClear || "Clear history"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── BROWSER COMPATIBILITY ─────────────────────────────────────── */}
      <div className="sp-section">
        <SectionHeader sectionKey="compat" icon="🌐" label={t.settingsCompat || "Browser compatibility"} />
        {openSection === "compat" && (
          <div className="sp-body">
            <div className="sp-compat-item">
              <span className="sp-compat-name">{t.settingsVoiceRecog || "Voice recognition"}</span>
              <span className={`sp-badge ${voiceSupported ? "badge-ok" : "badge-fail"}`}>{voiceSupported ? (t.settingsAvailable || "Available") : (t.settingsNotAvailable || "Not available")}</span>
            </div>
            <div className="sp-compat-item">
              <span className="sp-compat-name">{t.settingsTextSpeech || "Text-to-speech"}</span>
              <span className={`sp-badge ${ttsSupported ? "badge-ok" : "badge-fail"}`}>{ttsSupported ? (t.settingsAvailable || "Available") : (t.settingsNotAvailable || "Not available")}</span>
            </div>
            <div className="sp-compat-item">
              <span className="sp-compat-name">{t.settingsMicPerm || "Mic permission"}</span>
              <span className={`sp-badge ${micBadgeClass}`}>{micStatusText}</span>
            </div>
            <button 
              className="sp-action-btn" 
              style={{ marginTop: "14px" }} 
              onClick={() => { handleTestMic(); triggerHaptic(); }}
              aria-label={t.testMic || 'Test microphone'}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 1a3 3 0 0 1 3 3v4a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3zm-5 7a5 5 0 0 0 10 0h-1a4 4 0 0 1-8 0H3zm4 7v-2H6v-1h4v1H9v2H7z"/></svg>
              {t.settingsTestMic || "Test microphone"}
            </button>
            {micStatus === "denied" && (
              <p className="sp-warn-note">{t.settingsMicDeniedFix || "Microphone access was denied. Please allow it in your browser settings."}</p>
            )}
          </div>
        )}
      </div>

      {/* ── ABOUT & PRIVACY ───────────────────────────────────────────── */}
      <div className="sp-section">
        <SectionHeader sectionKey="about" icon="ℹ️" label={t.settingsAbout || "About & privacy"} />
        {openSection === "about" && (
          <div className="sp-body">
            <div className="sp-about-grid">
              <div className="sp-about-card">
                <div className="sp-about-key">{t.settingsVersionLabel || "Version"}</div>
                <div className="sp-about-val">2.0.0</div>
              </div>
              <div className="sp-about-card">
                <div className="sp-about-key">{t.settingsBuiltWith || "Built with"}</div>
                <div className="sp-about-val">Next.js + Web Speech API</div>
              </div>
              <div className="sp-about-card">
                <div className="sp-about-key">{t.settingsDataStorage || "Data storage"}</div>
                <div className="sp-about-val">{t.settingsOnDevice || "On-device only"}</div>
              </div>
              <div className="sp-about-card">
                <div className="sp-about-key">{t.settingsNetwork || "Network requests"}</div>
                <div className="sp-about-val">{t.settingsNone || "None"}</div>
              </div>
            </div>
            <div className="sp-privacy-note">
              🔒 {t.settingsPrivacy || "Zero data sent to servers — all processing is 100% on-device."}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}