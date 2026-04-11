// lib/translations.js
// Multi-language UI translations
// Supports: English, Hindi, Gujarati, Spanish, French, Chinese, Japanese, Korean, Arabic, and more

const translations = {
  'en-US': {
    appName: 'VoiceBridge',
    appSubtitle: 'Assistive Communication',
    helpButton: '? Help',

    // Language selection
    setupTitle: 'Language Setup',
    setupSubtitle: 'Choose your language and output preferences',
    setupStep1: 'Step 1: Your Language (FROM)',
    setupStep1Desc: 'Select the language you speak and want the app to use',
    setupStep2: 'Step 2: Output Language (TO)',
    setupStep2Desc: 'Select one or more languages for translated output',
    setupTip: '💡 You can select multiple output languages to get translations in all of them',
    setupConfirm: 'Confirm & Start',
    setupCancel: 'Cancel',
    setupRegion: 'Region',
    setupShowAll: 'Show All Languages',

    // Navigation
    tabConversation: 'Conversation',
    tabTextToSpeech: 'Text to Speech',
    tabVoiceToText: 'Voice to Text',
    tabSettings: 'Settings',

    // Languages
    langEnglish: 'English',
    langHindi: 'Hindi',
    langGujarati: 'Gujarati',
    langSpanish: 'Spanish',
    langFrench: 'French',
    langChinese: 'Chinese',
    langJapanese: 'Japanese',
    langKorean: 'Korean',
    langArabic: 'Arabic',

    // Voice to Text
    vttTitle: 'Voice to Text',
    vttSubtitle: 'Speak and convert to text',
    vttInputLabel: 'INPUT — VOICE',
    vttPlaceholder: 'Click the mic or say something...',
    vttStartBtn: 'Start Listening',
    vttStopBtn: 'Stop Listening',
    vttReadAloud: 'Read Aloud',
    vttCopy: 'Copy',
    vttClear: 'Clear',
    vttSpeaking: '🔊 Speaking...',

    // Text to Speech
    ttsTitle: 'Text to Speech',
    ttsSubtitle: 'Type and hear it read aloud',
    ttsInputLabel: 'INPUT — TEXT',
    ttsPlaceholder: 'Type something here...',
    ttsSpeak: 'Speak',
    ttsStop: 'Stop',
    ttsClear: 'Clear',
    ttsRate: 'Speed',
    ttsPitch: 'Pitch',
    ttsTestVoice: 'Test Voice',
    ttsSample: 'Hello, this is a test.',

    // Quick Phrases
    qpTitle: 'Quick Phrases',
    qpDesc: 'Tap to speak instantly',
    qpIHelp: 'I need help',
    qpThirsty: 'I am thirsty',
    qpWait: 'Please wait',
    qpDoctor: 'Call doctor',
    qpPain: 'I am in pain',
    qpThank: 'Thank you',
    qpSleep: 'I want to sleep',
    qpHungry: 'I am hungry',

    // History
    historyTitle: 'Conversation',
    historyEmpty: 'No messages yet. Start speaking or typing!',
    historyDownload: 'Download',
    historyClear: 'Clear All',
    historyConfirmClear: 'Are you sure you want to clear all messages?',

    // Settings
    settingsTitle: 'Settings',
    settingsAccessibility: 'Accessibility',
    settingsLargeText: 'Large Text & Buttons',
    settingsHighContrast: 'High Contrast Mode',
    settingsReduceMotion: 'Reduce Animations',
    settingsFontSize: 'Font Size',
    settingsVoice: 'Voice Settings',
    settingsRate: 'Speech Rate',
    settingsPitch: 'Voice Pitch',
    settingsHistory: 'Conversation History',
    settingsMessages: 'Messages',
    settingsBrowser: 'Browser Compatibility',
    settingsAbout: 'About & Privacy',
    settingsVersion: 'Version',
    settingsPrivacy: 'All data stays on your device. Nothing is sent to servers.',
    settingsMicPermission: 'Microphone Permission',
    settingsAvailable: 'Available',
    settingsUnavailable: 'Not available',
    settingsLanguageSettings: 'Language Settings',
    settingsChangeLanguage: 'Change Language Preference',
    settingsTheme: 'Theme',
    settingsDarkMode: 'Dark Mode',
    settingsLightMode: 'Light Mode',

    // Banners
    bannerOffline: '📡 You are offline. Some features may not work.',
    bannerWelcomeTitle: 'Welcome to VoiceBridge!',
    bannerWelcomeText: 'Use your voice to communicate across languages.',
    bannerWelcomeDismiss: 'Got it',

    // Help Modal
    helpTitle: 'How to Use VoiceBridge',
    helpStep1: 'Step 1: Choose your language',
    helpStep1Text: 'Select the language you speak.',
    helpStep2: 'Step 2: Pick a mode',
    helpStep2Text: 'Use Voice to Text or Text to Speech.',
    helpStep3: 'Step 3: Quick Phrases',
    helpStep3Text: 'Tap buttons for instant communication.',
    helpStep4: 'Step 4: Your History',
    helpStep4Text: 'All messages saved in Conversation tab.',
    helpClose: 'Close',

    // Footer
    footerText: '🌍 VoiceBridge v2.0 • Free • No data collection',
  },

  'hi-IN': {
    appName: 'वॉइसब्रिज',
    appSubtitle: 'सहायक संचार',
    helpButton: '? सहायता',

    setupTitle: 'भाषा सेटअप',
    setupSubtitle: 'अपनी भाषा चुनें',
    setupStep1: 'चरण 1: आपकी भाषा (FROM)',
    setupStep1Desc: 'वह भाषा चुनें जो आप बोलते हैं',
    setupStep2: 'चरण 2: आउटपुट भाषा (TO)',
    setupStep2Desc: 'अनुवाद के लिए एक या अधिक भाषाएँ चुनें',
    setupTip: '💡 एक से अधिक भाषाएँ चुनें',
    setupConfirm: 'पुष्टि करें & शुरू करें',
    setupCancel: 'रद्द करें',
    setupRegion: 'क्षेत्र',
    setupShowAll: 'सभी भाषाएँ',

    tabConversation: 'बातचीत',
    tabTextToSpeech: 'पाठ से वाणी',
    tabVoiceToText: 'वाणी से पाठ',
    tabSettings: 'सेटिंग्स',

    langEnglish: 'अंग्रेजी',
    langHindi: 'हिंदी',
    langGujarati: 'गुजराती',

    vttTitle: 'वाणी से पाठ',
    vttSubtitle: 'बोलें और पाठ में रूपांतरित करें',
    vttInputLabel: 'इनपुट — वाणी',
    vttPlaceholder: 'माइक पर क्लिक करें या कुछ कहें...',
    vttStartBtn: 'सुनना शुरू करें',
    vttStopBtn: 'सुनना बंद करें',
    vttReadAloud: 'जोर से पढ़ें',
    vttCopy: 'कॉपी करें',
    vttClear: 'साफ करें',
    vttSpeaking: '🔊 बोल रहे हैं...',

    ttsTitle: 'पाठ से वाणी',
    ttsSubtitle: 'टाइप करें और सुनें',
    ttsInputLabel: 'इनपुट — पाठ',
    ttsPlaceholder: 'यहाँ कुछ टाइप करें...',
    ttsSpeak: 'बोलें',
    ttsStop: 'रोकें',
    ttsClear: 'साफ करें',
    ttsRate: 'गति',
    ttsPitch: 'पिच',
    ttsTestVoice: 'वॉयस टेस्ट करें',
    ttsSample: 'नमस्ते, यह एक परीक्षण है।',

    qpTitle: 'त्वरित वाक्यांश',
    qpDesc: 'तुरंत बोलने के लिए टैप करें',
    qpIHelp: 'मुझे मदद चाहिए',
    qpThirsty: 'मुझे प्यास लगी है',
    qpWait: 'कृपया प्रतीक्षा करें',
    qpDoctor: 'डॉक्टर को बुलाएं',
    qpPain: 'मुझे दर्द है',
    qpThank: 'धन्यवाद',
    qpSleep: 'मुझे सोना चाहता हूं',
    qpHungry: 'मुझे भूख लगी है',

    historyTitle: 'बातचीत',
    historyEmpty: 'कोई संदेश नहीं। बोलना या टाइप करना शुरू करें!',
    historyDownload: 'डाउनलोड करें',
    historyClear: 'सभी साफ करें',
    historyConfirmClear: 'क्या आप सभी संदेश साफ करना चाहते हैं?',

    settingsTitle: 'सेटिंग्स',
    settingsAccessibility: 'पहुंच',
    settingsLargeText: 'बड़ा पाठ',
    settingsHighContrast: 'उच्च कंट्रास्ट',
    settingsReduceMotion: 'एनिमेशन कम करें',

    bannerOffline: '📡 आप ऑफ़लाइन हैं।',
    bannerWelcomeTitle: 'वॉइसब्रिज में स्वागत है!',
    bannerWelcomeText: 'अपनी आवाज़ से संवाद करें।',
    bannerWelcomeDismiss: 'ठीक है',

    footerText: '🌍 वॉइसब्रिज v2.0 • मुफ्त • कोई डेटा एकत्र नहीं',
  },

  'gu-IN': {
    appName: 'વૉઇસબ્રિજ',
    appSubtitle: 'સહાયક સંચાર',
    helpButton: '? મદદ',

    setupTitle: 'ભાષા સેટઅપ',
    setupSubtitle: 'તમારી ભાષા પસંદ કરો',
    setupStep1: 'પગલું 1: તમારી ભાષા (FROM)',
    setupStep1Desc: 'તમે જે ભાષા બોલો છો તે પસંદ કરો',
    setupStep2: 'પગલું 2: આઉટપુટ ભાષા (TO)',
    setupStep2Desc: 'અનુવાદ માટે એક અથવા વધુ ભાષાઓ પસંદ કરો',
    setupConfirm: 'પુષ્ટি કરો & શરૂ કરો',
    setupCancel: 'રદ કરો',

    tabConversation: 'વાતચીત',
    tabTextToSpeech: 'લખાણ થી વાણી',
    tabVoiceToText: 'વાણી થી લખાણ',
    tabSettings: 'સેટિંગ્સ',

    langEnglish: 'અંગ્રેજી',
    langHindi: 'હિંદી',
    langGujarati: 'ગુજરાતી',

    vttTitle: 'વાણી થી લખાણ',
    vttInputLabel: 'ઇનપુટ — વાણી',
    vttPlaceholder: 'માઇક પર ક્લિક કરો અથવા કંઇક કહો...',
    vttStartBtn: 'સાંભળવું શરૂ કરો',
    vttStopBtn: 'સાંભળવું બંધ કરો',

    ttsTitle: 'લખાણ થી વાણી',
    ttsInputLabel: 'ઇનપુટ — લખાણ',
    ttsPlaceholder: 'અહીં કંઇક લખો...',

    qpTitle: 'ઝડપી વાક્યાંશો',
    qpIHelp: 'મને મદદ ચાહિએ',
    qpThirsty: 'મને તરસ લાગી છે',
    qpWait: 'કૃપયા રાહ જુઓ',
    qpDoctor: 'ડોક્ટરને બોલાવો',
    qpPain: 'મને દર્દ છે',
    qpThank: 'આભાર',
    qpSleep: 'મને સુવું છે',
    qpHungry: 'મને ભૂખ છે',

    historyTitle: 'વાતચીત',
    historyEmpty: 'કોઈ સંદેશ નથી। બોલવું અથવા લખવું શરૂ કરો!',

    settingsTitle: 'સેટિંગ્સ',
    bannerWelcomeTitle: 'વૉઇસબ્રિજમાં આપનું સ્વાગત છે!',
    footerText: '🌍 વૉઇસબ્રિજ v2.0 • મફત • કોઈ ડેટા એકત્ર નથી',
  },

  'es-ES': {
    appName: 'VoiceBridge',
    appSubtitle: 'Comunicación Asistida',
    helpButton: '? Ayuda',

    setupTitle: 'Configuración de Idioma',
    setupSubtitle: 'Elige tu idioma',
    setupStep1: 'Paso 1: Tu Idioma (DESDE)',
    setupStep1Desc: 'Selecciona el idioma que hablas',
    setupStep2: 'Paso 2: Idioma de Salida (HACIA)',
    setupConfirm: 'Confirmar y Comenzar',
    setupCancel: 'Cancelar',

    tabConversation: 'Conversación',
    tabTextToSpeech: 'Texto a Voz',
    tabVoiceToText: 'Voz a Texto',
    tabSettings: 'Configuración',

    vttTitle: 'Voz a Texto',
    ttsTitle: 'Texto a Voz',
    qpTitle: 'Frases Rápidas',
    historyTitle: 'Conversación',
    settingsTitle: 'Configuración',

    footerText: '🌍 VoiceBridge v2.0 • Gratuito • Sin recopilación de datos',
  },

  'fr-FR': {
    appName: 'VoiceBridge',
    appSubtitle: 'Communication Assistée',
    helpButton: '? Aide',

    setupTitle: 'Configuration Linguistique',
    setupSubtitle: 'Choisissez votre langue',
    setupStep1: 'Étape 1: Votre Langue (DE)',
    setupStep1Desc: 'Sélectionnez la langue que vous parlez',
    setupStep2: 'Étape 2: Langue de Sortie (VERS)',
    setupConfirm: 'Confirmer et Commencer',
    setupCancel: 'Annuler',

    tabConversation: 'Conversation',
    tabTextToSpeech: 'Texte à Parole',
    tabVoiceToText: 'Parole à Texte',
    tabSettings: 'Paramètres',

    footerText: '🌍 VoiceBridge v2.0 • Gratuit • Aucune collecte de données',
  },

  'zh-CN': {
    appName: '语音桥',
    appSubtitle: '辅助通讯',
    helpButton: '? 帮助',

    setupTitle: '语言设置',
    setupSubtitle: '选择您的语言',
    setupStep1: '步骤 1: 您的语言 (来自)',
    setupConfirm: '确认并开始',
    setupCancel: '取消',

    tabConversation: '对话',
    tabTextToSpeech: '文字转语音',
    tabVoiceToText: '语音转文字',
    tabSettings: '设置',

    footerText: '🌍 语音桥 v2.0 • 免费 • 不收集数据',
  },

  'ja-JP': {
    appName: 'VoiceBridge',
    appSubtitle: 'アシスティブ通信',
    helpButton: '? ヘルプ',

    setupTitle: '言語設定',
    setupSubtitle: '言語を選択',
    setupStep1: 'ステップ 1: あなたの言語 (FROM)',
    setupConfirm: '確認して開始',
    setupCancel: 'キャンセル',

    tabConversation: '会話',
    tabTextToSpeech: 'テキスト読み上げ',
    tabVoiceToText: '音声テキスト化',
    tabSettings: '設定',

    footerText: '🌍 VoiceBridge v2.0 • 無料 • データ収集なし',
  },

  'ko-KR': {
    appName: 'VoiceBridge',
    appSubtitle: '보조 통신',
    helpButton: '? 도움말',

    setupTitle: '언어 설정',
    setupSubtitle: '언어 선택',
    setupStep1: '단계 1: 당신의 언어 (출발)',
    setupConfirm: '확인 및 시작',
    setupCancel: '취소',

    tabConversation: '대화',
    tabTextToSpeech: '텍스트 음성 변환',
    tabVoiceToText: '음성 텍스트 변환',
    tabSettings: '설정',

    footerText: '🌍 VoiceBridge v2.0 • 무료 • 데이터 수집 없음',
  },

  'ar-SA': {
    appName: 'جسر الصوت',
    appSubtitle: 'الاتصالات المساعدة',
    helpButton: '? مساعدة',

    setupTitle: 'إعداد اللغة',
    setupSubtitle: 'اختر لغتك',
    setupStep1: 'الخطوة 1: لغتك (من)',
    setupConfirm: 'تأكيد وابدأ',
    setupCancel: 'إلغاء',

    tabConversation: 'محادثة',
    tabTextToSpeech: 'نص إلى كلام',
    tabVoiceToText: 'كلام إلى نص',
    tabSettings: 'الإعدادات',

    footerText: '🌍 جسر الصوت v2.0 • مجاني • بدون جمع البيانات',
  },
}

// Helper function to get translations for a specific language code
export function getT(langCode) {
  // Return translations for the requested language, fallback to English
  return translations[langCode] || translations['en-US']
}

// Get all available language codes
export function getAvailableLanguageCodes() {
  return Object.keys(translations)
}