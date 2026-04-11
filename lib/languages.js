// lib/languages.js
// Comprehensive language list with 50+ languages for From/To selection

export const LANGUAGES = [
  // European Languages
  { code: 'en-US', name: 'English', nativeName: 'English', flag: '🇺🇸', region: 'Americas' },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English', flag: '🇬🇧', region: 'Europe' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Europe' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'Europe' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Europe' },
  { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', region: 'Europe' },
  { code: 'pt-PT', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', region: 'Europe' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português Brasileiro', flag: '🇧🇷', region: 'Americas' },
  { code: 'nl-NL', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', region: 'Europe' },
  { code: 'sv-SE', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', region: 'Europe' },
  { code: 'pl-PL', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', region: 'Europe' },
  { code: 'ru-RU', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Europe' },
  { code: 'uk-UA', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', region: 'Europe' },

  // Asian Languages
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', region: 'Asia' },
  { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', region: 'Asia' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', region: 'Asia' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', region: 'Asia' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', region: 'Asia' },
  { code: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', region: 'Asia' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '中文', flag: '🇨🇳', region: 'Asia' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼', region: 'Asia' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Asia' },
  { code: 'ko-KR', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', region: 'Asia' },
  { code: 'th-TH', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', region: 'Asia' },
  { code: 'vi-VN', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', region: 'Asia' },
  { code: 'id-ID', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Asia' },
  { code: 'ms-MY', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', region: 'Asia' },
  { code: 'tl-PH', name: 'Tagalog', nativeName: 'Tagalog', flag: '🇵🇭', region: 'Asia' },

  // Middle East
  { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Middle East' },
  { code: 'ar-AE', name: 'Arabic (UAE)', nativeName: 'العربية', flag: '🇦🇪', region: 'Middle East' },
  { code: 'he-IL', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', region: 'Middle East' },

  // African Languages
  { code: 'sw-KE', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', region: 'Africa' },
  { code: 'af-ZA', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦', region: 'Africa' },
  { code: 'zu-ZA', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦', region: 'Africa' },
  { code: 'yo-NG', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬', region: 'Africa' },

  // Americas
  { code: 'es-MX', name: 'Spanish (Mexico)', nativeName: 'Español Mexicano', flag: '🇲🇽', region: 'Americas' },
  { code: 'es-AR', name: 'Spanish (Argentina)', nativeName: 'Español Argentino', flag: '🇦🇷', region: 'Americas' },

  // Other
  { code: 'tr-TR', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', region: 'Europe' },
  { code: 'el-GR', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', region: 'Europe' },
  { code: 'hu-HU', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', region: 'Europe' },
  { code: 'cs-CZ', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', region: 'Europe' },
  { code: 'sk-SK', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', region: 'Europe' },
  { code: 'ro-RO', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', region: 'Europe' },
]

export function getLanguageByCode(code) {
  return LANGUAGES.find(lang => lang.code === code)
}

export function getLanguagesByRegion(region) {
  return LANGUAGES.filter(lang => lang.region === region)
}

export function getAllRegions() {
  const regions = new Set(LANGUAGES.map(lang => lang.region))
  return Array.from(regions).sort()
}