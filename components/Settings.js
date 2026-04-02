// components/Settings.js — Updated with Light/Dark mode + full i18n support
// Props: history, onClearHistory, largeText, onLargeTextChange,
//        highContrast, onHighContrastChange, langCode, theme, onThemeChange

import { useState, useEffect } from "react";
import { getT } from "../translations";

export default function Settings({
  history = [],
  onClearHistory,
  largeText,
  onLargeTextChange,
  highContrast,
  onHighContrastChange,
  langCode = "en-US",
  theme,          // "dark" | "light"  — passed from index.js
  onThemeChange,  // (newTheme) => void
}) {
  const t = getT(langCode);

  const [reduceMotion, setReduceMotion] = useState(false);
  const [fontSize, setFontSize] = useState("medium");
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [micStatus, setMicStatus] = useState("unknown");
  const [voiceSupported] = useState(() => "SpeechRecognition" in window || "webkitSpeechRecognition" in window);
  const [ttsSupported] = useState(() => "speechSynthesis" in window);
  const [openSection, setOpenSection] = useState("appearance");

  // Sync reduceMotion class
  useEffect(() => {
    document.body.classList.toggle("reduce-motion", reduceMotion);
  }, [reduceMotion]);

  // Sync font size
  useEffect(() => {
    document.documentElement.setAttribute("data-fontsize", fontSize);
  }, [fontSize]);

  function handleTestVoice() {
    if (!ttsSupported) return;
    const u = new SpeechSynthesisUtterance(t.settingsTestVoice);
    u.lang = langCode;
    u.rate = rate;
    u.pitch = pitch;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  async function handleTestMic() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStatus("granted");
    } catch (e) {
      setMicStatus("denied");
    }
  }

  function handleDownload() {
    const lines = history.map(
      (m) => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.source}: ${m.text}`
    );
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "voicebridge-history.txt";
    a.click();
  }

  function handleClear() {
    if (window.confirm(t.historyClearConfirm)) onClearHistory();
  }

  const toggleSection = (key) => setOpenSection(openSection === key ? null : key);

  const SectionHeader = ({ sectionKey, label }) => (
    <button
      className="settings-section-title"
      onClick={() => toggleSection(sectionKey)}
      aria-expanded={openSection === sectionKey}
    >
      {label}
      <span className="settings-chevron">{openSection === sectionKey ? "▲" : "▼"}</span>
    </button>
  );

  const Toggle = ({ checked, onChange, label, desc }) => (
    <div className="settings-row">
      <div className="settings-label-group">
        <span className="settings-label">{label}</span>
        {desc && <span className="settings-desc">{desc}</span>}
      </div>
      <label className="toggle-switch">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="toggle-thumb" />
      </label>
    </div>
  );

  const micStatusText =
    micStatus === "granted"
      ? t.settingsGranted
      : micStatus === "denied"
      ? t.settingsDenied
      : micStatus === "prompt"
      ? t.settingsPrompt
      : t.settingsUnknown;

  const isDark = theme === "dark";

  return (
    <div className="settings-page">
      <h2 className="settings-main-title">{t.settingsTitle}</h2>

      {/* ── APPEARANCE (Light / Dark) ─────────────────────────── */}
      <div className="settings-section">
        <SectionHeader sectionKey="appearance" label={t.settingsAppearance} />
        {openSection === "appearance" && (
          <div className="settings-body">
            <div className="settings-row">
              <div className="settings-label-group">
                <span className="settings-label">
                  {isDark ? t.settingsDarkMode : t.settingsLightMode}
                </span>
                <span className="settings-desc">{t.settingsThemeDesc}</span>
              </div>
              <button
                className={`theme-toggle-btn ${isDark ? "theme-btn-dark" : "theme-btn-light"}`}
                onClick={() => onThemeChange(isDark ? "light" : "dark")}
                aria-label={isDark ? t.settingsLightMode : t.settingsDarkMode}
                title={isDark ? t.settingsLightMode : t.settingsDarkMode}
              >
                {isDark ? "☀️" : "🌙"}
                <span>{isDark ? t.settingsLightMode : t.settingsDarkMode}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── ACCESSIBILITY ─────────────────────────────────────── */}
      <div className="settings-section">
        <SectionHeader sectionKey="accessibility" label={t.settingsAccessibility} />
        {openSection === "accessibility" && (
          <div className="settings-body">
            <Toggle
              checked={largeText}
              onChange={onLargeTextChange}
              label={t.settingsLargeText}
              desc={t.settingsLargeTextDesc}
            />
            <Toggle
              checked={highContrast}
              onChange={onHighContrastChange}
              label={t.settingsHighContrast}
              desc={t.settingsHighContrastDesc}
            />
            <Toggle
              checked={reduceMotion}
              onChange={setReduceMotion}
              label={t.settingsReduceMotion}
              desc={t.settingsReduceMotionDesc}
            />
            <div className="settings-row settings-row-col">
              <span className="settings-label">{t.settingsFontSize}</span>
              <div className="fontsize-tabs">
                {["small", "medium", "large", "xlarge"].map((s, i) => (
                  <button
                    key={s}
                    className={`fontsize-tab ${fontSize === s ? "active" : ""}`}
                    onClick={() => setFontSize(s)}
                  >
                    {[t.settingsFontSmall, t.settingsFontMedium, t.settingsFontLarge, t.settingsFontXLarge][i]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── VOICE SETTINGS ───────────────────────────────────── */}
      <div className="settings-section">
        <SectionHeader sectionKey="voice" label={t.settingsVoice} />
        {openSection === "voice" && (
          <div className="settings-body">
            <div className="settings-slider-row">
              <label>{t.settingsSpeechRate} <b>{rate.toFixed(1)}×</b></label>
              <input type="range" min="0.5" max="2" step="0.1" value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))} />
            </div>
            <div className="settings-slider-row">
              <label>{t.settingsSpeechPitch} <b>{pitch.toFixed(1)}</b></label>
              <input type="range" min="0.5" max="2" step="0.1" value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))} />
            </div>
            <button className="btn-secondary" onClick={handleTestVoice}>{t.settingsTestVoice}</button>
          </div>
        )}
      </div>

      {/* ── CONVERSATION HISTORY ─────────────────────────────── */}
      <div className="settings-section">
        <SectionHeader sectionKey="history" label={t.settingsHistory} />
        {openSection === "history" && (
          <div className="settings-body">
            <p className="settings-desc">
              <b>{history.length}</b> {t.settingsMessages}
            </p>
            <div className="settings-btn-row">
              <button className="btn-secondary" onClick={handleDownload}>{t.settingsDownload}</button>
              <button className="btn-danger" onClick={handleClear}>{t.settingsClear}</button>
            </div>
          </div>
        )}
      </div>

      {/* ── BROWSER COMPATIBILITY ────────────────────────────── */}
      <div className="settings-section">
        <SectionHeader sectionKey="compat" label={t.settingsCompat} />
        {openSection === "compat" && (
          <div className="settings-body">
            <ul className="compat-list">
              <li>
                <span>{t.settingsVoiceRecog}</span>
                <span className={voiceSupported ? "compat-ok" : "compat-no"}>
                  {voiceSupported ? t.settingsAvailable : t.settingsNotAvailable}
                </span>
              </li>
              <li>
                <span>{t.settingsTextSpeech}</span>
                <span className={ttsSupported ? "compat-ok" : "compat-no"}>
                  {ttsSupported ? t.settingsAvailable : t.settingsNotAvailable}
                </span>
              </li>
              <li>
                <span>{t.settingsMicPerm}</span>
                <span className={micStatus === "granted" ? "compat-ok" : "compat-warn"}>
                  {micStatusText}
                </span>
              </li>
            </ul>
            <button className="btn-secondary" onClick={handleTestMic}>{t.settingsTestMic}</button>
            {micStatus === "denied" && (
              <p className="settings-desc settings-warn">{t.settingsMicDeniedFix}</p>
            )}
          </div>
        )}
      </div>

      {/* ── ABOUT & PRIVACY ─────────────────────────────────── */}
      <div className="settings-section">
        <SectionHeader sectionKey="about" label={t.settingsAbout} />
        {openSection === "about" && (
          <div className="settings-body">
            <div className="about-grid">
              <span>{t.settingsVersion}</span>
              <span>{t.settingsBuiltWith}</span>
              <span>{t.settingsPrivacy}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}