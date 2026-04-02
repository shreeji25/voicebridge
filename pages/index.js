// pages/index.js — Updated with theme (light/dark) state + i18n t() passed to all components
// All existing features preserved. New: theme state, getT() helper passed down.

import { useState, useEffect } from "react";
import LanguageSelector from "../components/LanguageSelector";
import VoiceToText from "../components/VoiceToText";
import TextToSpeech from "../components/TextToSpeech";
import QuickPhrases from "../components/QuickPhrases";
import History from "../components/History";
import HelpModal from "../components/HelpModal";
import Settings from "../components/Settings";
import { getT } from "../translations";

export default function Home() {
  const [tab, setTab]           = useState("conversation");
  const [langCode, setLangCode] = useState("en-US");
  const [history, setHistory]   = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [largeText, setLargeText]       = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [helpOpen, setHelpOpen]         = useState(false);
  const [showBanner, setShowBanner]     = useState(false);

  // ── NEW: theme state ─────────────────────────────────────────────
  const [theme, setTheme] = useState("dark"); // "dark" | "light"

  // Apply theme to <html data-theme="...">
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  // ─────────────────────────────────────────────────────────────────

  // Apply accessibility classes
  useEffect(() => {
    document.documentElement.classList.toggle("large-text", largeText);
  }, [largeText]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  // Online / offline banner
  useEffect(() => {
    const onOn  = () => setIsOnline(true);
    const onOff = () => setIsOnline(false);
    window.addEventListener("online",  onOn);
    window.addEventListener("offline", onOff);
    return () => { window.removeEventListener("online", onOn); window.removeEventListener("offline", onOff); };
  }, []);

  // First-time welcome banner
  useEffect(() => {
    if (!localStorage.getItem("vb_seen")) {
      setShowBanner(true);
      localStorage.setItem("vb_seen", "1");
    }
  }, []);

  function addToHistory(item) {
    setHistory((prev) => [item, ...prev]);
  }

  const t = getT(langCode);

  return (
    <div className="page">
      {/* ── Offline banner ─────────────────────────────────── */}
      {!isOnline && <div className="offline-banner">{t.bannerOffline}</div>}

      {/* ── Welcome banner ─────────────────────────────────── */}
      {showBanner && (
        <div className="welcome-banner">
          <strong>{t.bannerWelcomeTitle}</strong> {t.bannerWelcomeText}
          <button onClick={() => setShowBanner(false)}>{t.bannerWelcomeDismiss}</button>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🌉</span>
          <div>
            <h1 className="logo-name">{t.appName}</h1>
            <p className="logo-sub">{t.appSubtitle}</p>
          </div>
        </div>
        <button className="help-pill" onClick={() => setHelpOpen(true)}>
          {t.helpButton}
        </button>
      </header>

      {/* ── Language selector (hidden on Settings tab) ─────── */}
      {tab !== "settings" && (
        <LanguageSelector
          selected={langCode}
          onChange={setLangCode}
          t={t}
        />
      )}

      {/* ── Tab bar ────────────────────────────────────────── */}
      <nav className="tab-bar">
        {[
          { key: "conversation", label: t.tabConversation },
          { key: "tts",          label: t.tabTextToSpeech },
          { key: "vtt",          label: t.tabVoiceToText  },
          { key: "settings",     label: t.tabSettings     },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`tab-btn ${tab === key ? "active" : ""}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* ── Tab content ────────────────────────────────────── */}
      <main className="main">
        {tab === "conversation" && (
          <>
            <QuickPhrases langCode={langCode} onAddToHistory={addToHistory} t={t} />
            <History items={history} langCode={langCode} onClear={() => setHistory([])} chatMode t={t} />
          </>
        )}
        {tab === "tts" && (
          <TextToSpeech langCode={langCode} onAddToHistory={addToHistory} t={t} />
        )}
        {tab === "vtt" && (
          <VoiceToText langCode={langCode} onAddToHistory={addToHistory} t={t} />
        )}
        {tab === "settings" && (
          <Settings
            history={history}
            onClearHistory={() => setHistory([])}
            largeText={largeText}
            onLargeTextChange={setLargeText}
            highContrast={highContrast}
            onHighContrastChange={setHighContrast}
            langCode={langCode}
            theme={theme}
            onThemeChange={setTheme}
          />
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="footer">
        <p>{t.footerText}</p>
      </footer>

      {/* ── Help modal ─────────────────────────────────────── */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} t={t} />
    </div>
  );
}