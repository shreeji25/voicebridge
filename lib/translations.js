// lib/translations.js
// Full UI translations for VoiceBridge
// - 9 languages have complete manual translations
// - All other languages get auto-translated at runtime via MyMemory API
// - Results are cached in localStorage so translation only happens once per language

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETE BASE TRANSLATIONS (manual, high quality)
// ─────────────────────────────────────────────────────────────────────────────

const BASE = {
  'en-US': {
    appName: 'VoiceBridge',
    appSubtitle: 'Assistive Communication',
    helpButton: '? Help',

    setupTitle: 'Choose Languages',
    setupSubtitle: 'Select the language you speak and the language you want',
    setupStep1: 'Step 1: Your Language (FROM)',
    setupStep1Desc: 'Select the language you speak',
    setupStep2: 'Step 2: Output Language (TO)',
    setupStep2Desc: 'Select the language for translation output',
    setupConfirm: 'Confirm & Start',
    setupCancel: 'Cancel',
    setupRegion: 'Region',
    setupShowAll: 'All',

    tabConversation: 'Conversation',
    tabWriting: 'Writing',
    tabSpeaking: 'Speaking',
    tabSettings: 'Settings',

    langEnglish: 'English',
    langHindi: 'Hindi',
    langGujarati: 'Gujarati',
    langSpanish: 'Spanish',
    langFrench: 'French',
    langChinese: 'Chinese',
    langJapanese: 'Japanese',
    langKorean: 'Korean',
    langArabic: 'Arabic',

    vttTitle: 'Voice to Text',
    vttSubtitle: 'Speak and convert to text',
    vttInputLabel: 'INPUT — VOICE',
    vttPlaceholder: 'Your spoken words will appear here…',
    vttStartListening: 'Start Listening',
    vttStopListening: 'Stop Listening',
    vttListeningLabel: '🔴 Listening… speak now',
    vttIdleLabel: 'Click the mic to start speaking',
    vttReadAloud: 'Read Aloud',
    vttCopy: 'Copy',
    vttClear: 'Clear',
    vttSpeaking: '🔊 Speaking...',

    ttsTitle: 'Text to Speech',
    ttsSubtitle: 'Type and hear it read aloud',
    ttsInputLabel: 'INPUT — TEXT',
    ttsPlaceholder: 'Type anything here and press Speak…',
    ttsSpeak: 'Translate & Speak',
    ttsStop: 'Stop',
    ttsClear: 'Clear',
    ttsRate: 'Speed',
    ttsPitch: 'Pitch',
    ttsTestVoice: 'Test Voice',
    ttsSample: 'Hello, this is a test.',

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

    historyTitle: 'Conversation',
    historyEmpty: 'No messages yet. Start speaking or typing!',
    historyDownload: 'Download',
    historyClear: 'Clear All',
    historyClearConfirm: 'Are you sure you want to clear all messages?',

    settingsTitle: 'Settings',
    settingsAppearance: 'Appearance',
    settingsThemeDesc: 'Switch between dark and light interface',
    settingsDarkMode: 'Dark mode',
    settingsLightMode: 'Light mode',
    settingsAccessibility: 'Accessibility',
    settingsLargeText: 'Large Text & Buttons',
    settingsLargeTextDesc: 'Increases font size and button size across the app',
    settingsHighContrast: 'High Contrast',
    settingsHighContrastDesc: 'Black and white mode for maximum readability',
    settingsReduceMotion: 'Reduce Animations',
    settingsReduceMotionDesc: 'Disables all animations and transitions',
    settingsFontSize: 'Font Size',
    settingsFontSizeDesc: 'Choose your preferred reading size',
    settingsFontSmall: 'Small',
    settingsFontMedium: 'Medium',
    settingsFontLarge: 'Large',
    settingsFontXLarge: 'X-Large',
    settingsVoice: 'Voice Settings',
    settingsSpeechRate: 'Speech rate',
    settingsSpeechPitch: 'Speech pitch',
    settingsVolume: 'Volume',
    settingsTestVoice: 'Test voice',
    settingsHistory: 'Conversation History',
    settingsMessages: 'messages this session',
    settingsDownload: 'Download .txt',
    settingsClear: 'Clear history',
    settingsCompat: 'Browser Compatibility',
    settingsVoiceRecog: 'Voice recognition',
    settingsTextSpeech: 'Text-to-speech',
    settingsMicPerm: 'Mic permission',
    settingsAvailable: 'Available',
    settingsNotAvailable: 'Not available',
    settingsGranted: 'Granted',
    settingsDenied: 'Denied',
    settingsPrompt: 'Pending',
    settingsUnknown: 'Unknown',
    settingsMicDeniedFix: 'Microphone access was denied. Please allow it in your browser settings.',
    settingsAbout: 'About & Privacy',
    settingsVersionLabel: 'Version',
    settingsBuiltWith: 'Built with',
    settingsDataStorage: 'Data storage',
    settingsOnDevice: 'On-device only',
    settingsNetwork: 'Network requests',
    settingsNone: 'None',
    settingsPrivacy: 'Zero data sent to servers — all processing is 100% on-device.',
    settingsLanguageSettings: 'Language Settings',
    statusOnline: 'Online',
    statusOffline: 'Offline',

    bannerOffline: '📡 You are offline. Some features may not work.',
    bannerWelcomeTitle: 'Welcome to VoiceBridge!',
    bannerWelcomeText: 'Use your voice to communicate across languages.',
    bannerWelcomeDismiss: 'Got it',

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

    footerText: '🌍 VoiceBridge v2.0 • Free • No data collection',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETE MANUAL TRANSLATIONS for key languages
// ─────────────────────────────────────────────────────────────────────────────

BASE['hi-IN'] = {
  appName: 'वॉइसब्रिज',
  appSubtitle: 'सहायक संचार',
  helpButton: '? सहायता',
  setupTitle: 'भाषा चुनें',
  setupSubtitle: 'अपनी भाषा और आउटपुट भाषा चुनें',
  setupStep1: 'आपकी भाषा (FROM)',
  setupStep1Desc: 'वह भाषा चुनें जो आप बोलते हैं',
  setupStep2: 'आउटपुट भाषा (TO)',
  setupStep2Desc: 'अनुवाद के लिए भाषा चुनें',
  setupConfirm: 'पुष्टि करें और शुरू करें',
  setupCancel: 'रद्द करें',
  setupRegion: 'क्षेत्र',
  setupShowAll: 'सभी',
  tabConversation: 'बातचीत',
  tabWriting: 'लिखना',
  tabSpeaking: 'बोलना',
  tabSettings: 'सेटिंग्स',
  langEnglish: 'अंग्रेजी', langHindi: 'हिंदी', langGujarati: 'गुजराती',
  vttTitle: 'वाणी से पाठ', vttSubtitle: 'बोलें और पाठ में रूपांतरित करें',
  vttInputLabel: 'इनपुट — वाणी',
  vttPlaceholder: 'आपके बोले गए शब्द यहाँ दिखेंगे…',
  vttStartListening: 'सुनना शुरू करें', vttStopListening: 'सुनना बंद करें',
  vttListeningLabel: '🔴 सुन रहे हैं… अभी बोलें',
  vttIdleLabel: 'बोलना शुरू करने के लिए माइक पर क्लिक करें',
  vttReadAloud: 'जोर से पढ़ें', vttCopy: 'कॉपी', vttClear: 'साफ करें',
  vttSpeaking: '🔊 बोल रहे हैं...',
  ttsTitle: 'पाठ से वाणी', ttsSubtitle: 'टाइप करें और सुनें',
  ttsInputLabel: 'इनपुट — पाठ',
  ttsPlaceholder: 'यहाँ कुछ टाइप करें…',
  ttsSpeak: 'अनुवाद करें और बोलें', ttsStop: 'रोकें', ttsClear: 'साफ करें',
  ttsRate: 'गति', ttsPitch: 'पिच', ttsTestVoice: 'वॉयस टेस्ट', ttsSample: 'नमस्ते, यह एक परीक्षण है।',
  qpTitle: 'त्वरित वाक्यांश', qpDesc: 'तुरंत बोलने के लिए टैप करें',
  qpIHelp: 'मुझे मदद चाहिए', qpThirsty: 'मुझे प्यास लगी है',
  qpWait: 'कृपया प्रतीक्षा करें', qpDoctor: 'डॉक्टर को बुलाएं',
  qpPain: 'मुझे दर्द है', qpThank: 'धन्यवाद',
  qpSleep: 'मुझे सोना है', qpHungry: 'मुझे भूख लगी है',
  historyTitle: 'बातचीत',
  historyEmpty: 'कोई संदेश नहीं। बोलना या टाइप करना शुरू करें!',
  historyDownload: 'डाउनलोड', historyClear: 'सभी साफ करें',
  historyClearConfirm: 'क्या आप सभी संदेश हटाना चाहते हैं?',
  settingsTitle: 'सेटिंग्स',
  settingsAppearance: 'रूप-रंग',
  settingsThemeDesc: 'डार्क और लाइट मोड के बीच बदलें',
  settingsDarkMode: 'डार्क मोड', settingsLightMode: 'लाइट मोड',
  settingsAccessibility: 'पहुँच',
  settingsLargeText: 'बड़ा पाठ और बटन',
  settingsLargeTextDesc: 'पूरे ऐप में फ़ॉन्ट और बटन का आकार बढ़ाएं',
  settingsHighContrast: 'उच्च कंट्रास्ट',
  settingsHighContrastDesc: 'अधिकतम पठनीयता के लिए श्वेत-श्याम मोड',
  settingsReduceMotion: 'एनिमेशन कम करें',
  settingsReduceMotionDesc: 'सभी एनिमेशन और संक्रमण अक्षम करें',
  settingsFontSize: 'फ़ॉन्ट आकार', settingsFontSizeDesc: 'अपना पसंदीदा पढ़ने का आकार चुनें',
  settingsFontSmall: 'छोटा', settingsFontMedium: 'मध्यम', settingsFontLarge: 'बड़ा', settingsFontXLarge: 'अति बड़ा',
  settingsVoice: 'वॉयस सेटिंग्स',
  settingsSpeechRate: 'बोलने की गति', settingsSpeechPitch: 'वॉयस पिच', settingsVolume: 'आवाज़',
  settingsTestVoice: 'वॉयस टेस्ट करें',
  settingsHistory: 'बातचीत इतिहास', settingsMessages: 'इस सत्र के संदेश',
  settingsDownload: 'डाउनलोड .txt', settingsClear: 'इतिहास साफ करें',
  settingsCompat: 'ब्राउज़र संगतता',
  settingsVoiceRecog: 'वॉयस रिकॉग्निशन', settingsTextSpeech: 'टेक्स्ट-टू-स्पीच',
  settingsMicPerm: 'माइक अनुमति',
  settingsAvailable: 'उपलब्ध', settingsNotAvailable: 'उपलब्ध नहीं',
  settingsGranted: 'मंजूर', settingsDenied: 'अस्वीकृत', settingsPrompt: 'लंबित', settingsUnknown: 'अज्ञात',
  settingsMicDeniedFix: 'माइक्रोफ़ोन एक्सेस अस्वीकृत। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।',
  settingsAbout: 'के बारे में और गोपनीयता',
  settingsVersionLabel: 'संस्करण', settingsBuiltWith: 'बनाया गया',
  settingsDataStorage: 'डेटा संग्रहण', settingsOnDevice: 'केवल डिवाइस पर',
  settingsNetwork: 'नेटवर्क अनुरोध', settingsNone: 'कोई नहीं',
  settingsPrivacy: 'सर्वर पर कोई डेटा नहीं — सब कुछ डिवाइस पर।',
  settingsLanguageSettings: 'भाषा सेटिंग्स',
  statusOnline: 'ऑनलाइन', statusOffline: 'ऑफ़लाइन',
  bannerOffline: '📡 आप ऑफ़लाइन हैं।',
  bannerWelcomeTitle: 'वॉइसब्रिज में स्वागत है!',
  bannerWelcomeText: 'अपनी आवाज़ से संवाद करें।',
  bannerWelcomeDismiss: 'ठीक है',
  helpTitle: 'VoiceBridge कैसे उपयोग करें',
  helpStep1: 'चरण 1: भाषा चुनें', helpStep1Text: 'वह भाषा चुनें जो आप बोलते हैं।',
  helpStep2: 'चरण 2: मोड चुनें', helpStep2Text: 'वॉयस टू टेक्स्ट या टेक्स्ट टू स्पीच।',
  helpStep3: 'चरण 3: त्वरित वाक्यांश', helpStep3Text: 'तत्काल संचार के लिए बटन टैप करें।',
  helpStep4: 'चरण 4: आपका इतिहास', helpStep4Text: 'सभी संदेश बातचीत टैब में।',
  helpClose: 'बंद करें',
  footerText: '🌍 वॉइसब्रिज v2.0 • मुफ्त • कोई डेटा एकत्र नहीं',
}

BASE['gu-IN'] = {
  appName: 'વૉઇસબ્રિજ',
  appSubtitle: 'સહાયક સંચાર',
  helpButton: '? મદદ',
  setupTitle: 'ભાષા પસંદ કરો',
  setupSubtitle: 'તમારી ભાષા અને આઉટપુટ ભાષા પસંદ કરો',
  setupStep1: 'તમારી ભાષા (FROM)',
  setupStep1Desc: 'તમે જે ભાષા બોલો છો તે પસંદ કરો',
  setupStep2: 'આઉટપુટ ભાષા (TO)',
  setupStep2Desc: 'અનુવાદ માટે ભાષા પસંદ કરો',
  setupConfirm: 'પુષ્ટિ કરો અને શરૂ કરો',
  setupCancel: 'રદ કરો',
  setupRegion: 'પ્રદેશ',
  setupShowAll: 'બધી',
  tabConversation: 'વાતચીત',
  tabWriting: 'લખવું',
  tabSpeaking: 'બોલવું',
  tabSettings: 'સેટિંગ્સ',
  langEnglish: 'અંગ્રેજી', langHindi: 'હિંદી', langGujarati: 'ગુજરાતી',
  vttTitle: 'વાણી થી લખાણ', vttSubtitle: 'બોલો અને લખાણમાં ફેરવો',
  vttInputLabel: 'ઇનપુટ — વાણી',
  vttPlaceholder: 'તમારા બોલેલા શબ્દો અહીં દેખાશે…',
  vttStartListening: 'સાંભળવું શરૂ કરો', vttStopListening: 'સાંભળવું બંધ કરો',
  vttListeningLabel: '🔴 સાંભળી રહ્યા છીએ… હવે બોલો',
  vttIdleLabel: 'બોલવું શરૂ કરવા માઇક પર ક્લિક કરો',
  vttReadAloud: 'મોટેથી વાંચો', vttCopy: 'કૉપિ', vttClear: 'સાફ કરો',
  vttSpeaking: '🔊 બોલી રહ્યા છીએ...',
  ttsTitle: 'લખાણ થી વાણી', ttsSubtitle: 'ટાઇપ કરો અને સાંભળો',
  ttsInputLabel: 'ઇનપુટ — લખાણ',
  ttsPlaceholder: 'અહીં કંઇક લખો…',
  ttsSpeak: 'અનુવાદ કરો અને બોલો', ttsStop: 'બંધ કરો', ttsClear: 'સાફ કરો',
  ttsRate: 'ઝડપ', ttsPitch: 'પિચ', ttsTestVoice: 'વૉઇસ ટેસ્ટ', ttsSample: 'નમસ્તે, આ એક પરીક્ષણ છે.',
  qpTitle: 'ઝડપી વાક્યાંશો', qpDesc: 'તરત બોલવા માટે ટૅપ કરો',
  qpIHelp: 'મને મદદ ચાહિએ', qpThirsty: 'મને તરસ લાગી છે',
  qpWait: 'કૃપા કરીને રાહ જુઓ', qpDoctor: 'ડૉક્ટરને બોલાવો',
  qpPain: 'મને દર્દ છે', qpThank: 'આભાર',
  qpSleep: 'મને સૂવું છે', qpHungry: 'મને ભૂખ છે',
  historyTitle: 'વાતચીત',
  historyEmpty: 'કોઈ સંદેશ નથી. બોલવું અથવા ટાઇપ કરવું શરૂ કરો!',
  historyDownload: 'ડાઉનલોડ', historyClear: 'બધું સાફ કરો',
  historyClearConfirm: 'શું તમે ખરેખર બધા સંદેશ કાઢી નાખવા માંગો છો?',
  settingsTitle: 'સેટિંગ્સ',
  settingsAppearance: 'દેખાવ',
  settingsThemeDesc: 'ડાર્ક અને લાઇટ મોડ વચ્ચે બદલો',
  settingsDarkMode: 'ડાર્ક મોડ', settingsLightMode: 'લાઇટ મોડ',
  settingsAccessibility: 'સુલભતા',
  settingsLargeText: 'મોટો ટેક્સ્ટ અને બટન',
  settingsLargeTextDesc: 'સમગ્ર ઍપમાં ફૉન્ટ અને બટનનો આકાર વધારો',
  settingsHighContrast: 'ઉચ્ચ કૉન્ટ્રાસ્ટ',
  settingsHighContrastDesc: 'વધુ સ્પષ્ટ વાચન માટે ડાળ-ગોળ (B&W) મોડ',
  settingsReduceMotion: 'ઍનિમેશન ઘટાડો',
  settingsReduceMotionDesc: 'બધી ઍનિમેશન અને ટ્રાન્ઝિશન બંધ કરો',
  settingsFontSize: 'ફૉન્ટ સાઇઝ', settingsFontSizeDesc: 'તમારી પસંદગીનું વાચન કદ પસંદ કરો',
  settingsFontSmall: 'નાનો', settingsFontMedium: 'મધ્યમ', settingsFontLarge: 'મોટો', settingsFontXLarge: 'ખૂબ મોટો',
  settingsVoice: 'વૉઇસ સેટિંગ્સ',
  settingsSpeechRate: 'બોલવાની ઝડપ', settingsSpeechPitch: 'વૉઇસ પિચ', settingsVolume: 'વૉલ્યુમ',
  settingsTestVoice: 'વૉઇસ ટેસ્ટ કરો',
  settingsHistory: 'વાતચીત ઇતિહાસ', settingsMessages: 'આ સત્રના સંદેશ',
  settingsDownload: 'ડાઉનલોડ .txt', settingsClear: 'ઇતિહાસ સાફ કરો',
  settingsCompat: 'બ્રાઉઝર સુસંગતતા',
  settingsVoiceRecog: 'વૉઇસ ઓળખ', settingsTextSpeech: 'ટેક્સ્ટ-ટુ-સ્પીચ',
  settingsMicPerm: 'માઇક પરવાનગી',
  settingsAvailable: 'ઉપલબ્ધ', settingsNotAvailable: 'ઉપલબ્ધ નથી',
  settingsGranted: 'મંજૂર', settingsDenied: 'નકારી', settingsPrompt: 'પ્રતીક્ષા', settingsUnknown: 'અજ્ઞાત',
  settingsMicDeniedFix: 'માઇક્રોફોન ઍક્સેસ નકારી. કૃપા કરીને બ્રાઉઝર સેટિંગ્સમાં પરવાનગી આપો.',
  settingsAbout: 'વિશે અને ગોપનીયતા',
  settingsVersionLabel: 'આવૃત્તિ', settingsBuiltWith: 'સ્ નિર્મિત',
  settingsDataStorage: 'ડેટા સ્ટોરેજ', settingsOnDevice: 'ફક્ત ડિવાઇસ પર',
  settingsNetwork: 'નેટવર્ક વિનંતીઓ', settingsNone: 'કોઈ નહીં',
  settingsPrivacy: 'સર્વર પર ડેટા નહીં — બધી પ્રક્રિયા ડિવાઇસ પર.',
  settingsLanguageSettings: 'ભાષા સેટિંગ્સ',
  statusOnline: 'ઑનલાઇન', statusOffline: 'ઑફલાઇન',
  bannerOffline: '📡 તમે ઑફલાઇન છો.',
  bannerWelcomeTitle: 'વૉઇસબ્રિજમાં આપનું સ્વાગત છે!',
  bannerWelcomeText: 'ભાષાઓ પાર વાતચીત કરો.',
  bannerWelcomeDismiss: 'સારું',
  helpTitle: 'VoiceBridge કેવી રીતે વાપરવું',
  helpStep1: 'પગલું 1: ભાષા પસંદ કરો', helpStep1Text: 'તમે જે ભાષા બોલો છો તે પસંદ કરો.',
  helpStep2: 'પગલું 2: મોડ પસંદ કરો', helpStep2Text: 'વૉઇસ ટુ ટેક્સ્ટ અથવા ટેક્સ્ટ ટુ સ્પીચ.',
  helpStep3: 'પગલું 3: ઝડપી વાક્યાંશો', helpStep3Text: 'તત્કાળ સંચાર માટે બટન ટૅપ કરો.',
  helpStep4: 'પગલું 4: ઇતિહાસ', helpStep4Text: 'બધા સંદેશ વાતચીત ટૅબમાં.',
  helpClose: 'બંધ કરો',
  footerText: '🌍 વૉઇસબ્રિજ v2.0 • મફત • કોઈ ડેટા એકત્ર નથી',
}

BASE['es-ES'] = {
  appName: 'VoiceBridge', appSubtitle: 'Comunicación Asistida', helpButton: '? Ayuda',
  setupTitle: 'Elegir Idiomas', setupSubtitle: 'Selecciona tu idioma y el idioma de salida',
  setupStep1: 'Tu Idioma (DESDE)', setupStep1Desc: 'Selecciona el idioma que hablas',
  setupStep2: 'Idioma de Salida (HACIA)', setupStep2Desc: 'Selecciona el idioma para traducción',
  setupConfirm: 'Confirmar y Comenzar', setupCancel: 'Cancelar', setupRegion: 'Región', setupShowAll: 'Todos',
  tabConversation: 'Conversación', tabWriting: 'Escribir', tabSpeaking: 'Hablar', tabSettings: 'Configuración',
  vttTitle: 'Voz a Texto', vttPlaceholder: 'Tus palabras aparecerán aquí…',
  vttStartListening: 'Empezar a escuchar', vttStopListening: 'Dejar de escuchar',
  vttListeningLabel: '🔴 Escuchando… habla ahora', vttIdleLabel: 'Haz clic en el micrófono para empezar',
  vttReadAloud: 'Leer en voz alta', vttCopy: 'Copiar', vttClear: 'Limpiar',
  ttsTitle: 'Texto a Voz', ttsPlaceholder: 'Escribe algo aquí…',
  ttsSpeak: 'Traducir y Hablar', ttsStop: 'Detener', ttsClear: 'Limpiar',
  ttsRate: 'Velocidad', ttsPitch: 'Tono', ttsTestVoice: 'Probar voz',
  qpTitle: 'Frases Rápidas', qpDesc: 'Toca para hablar al instante',
  qpIHelp: 'Necesito ayuda', qpThirsty: 'Tengo sed', qpWait: 'Por favor espera',
  qpDoctor: 'Llama al médico', qpPain: 'Tengo dolor', qpThank: 'Gracias', qpSleep: 'Quiero dormir', qpHungry: 'Tengo hambre',
  historyTitle: 'Conversación', historyEmpty: 'Sin mensajes. ¡Empieza a hablar o escribir!',
  historyDownload: 'Descargar', historyClear: 'Borrar todo', historyClearConfirm: '¿Seguro que quieres borrar todo?',
  settingsTitle: 'Configuración', settingsAppearance: 'Apariencia', settingsThemeDesc: 'Cambiar entre modo oscuro y claro',
  settingsDarkMode: 'Modo oscuro', settingsLightMode: 'Modo claro',
  settingsAccessibility: 'Accesibilidad', settingsLargeText: 'Texto y botones grandes',
  settingsLargeTextDesc: 'Aumenta el tamaño de fuente y botones',
  settingsHighContrast: 'Alto contraste', settingsHighContrastDesc: 'Modo blanco y negro',
  settingsReduceMotion: 'Reducir animaciones', settingsReduceMotionDesc: 'Desactiva todas las animaciones',
  settingsFontSize: 'Tamaño de fuente', settingsFontSizeDesc: 'Elige tu tamaño de lectura preferido',
  settingsFontSmall: 'Pequeño', settingsFontMedium: 'Mediano', settingsFontLarge: 'Grande', settingsFontXLarge: 'Muy grande',
  settingsVoice: 'Configuración de voz', settingsSpeechRate: 'Velocidad del habla',
  settingsSpeechPitch: 'Tono de voz', settingsVolume: 'Volumen', settingsTestVoice: 'Probar voz',
  settingsHistory: 'Historial de conversación', settingsMessages: 'mensajes en esta sesión',
  settingsDownload: 'Descargar .txt', settingsClear: 'Borrar historial',
  settingsCompat: 'Compatibilidad del navegador',
  settingsVoiceRecog: 'Reconocimiento de voz', settingsTextSpeech: 'Texto a voz',
  settingsMicPerm: 'Permiso del micrófono',
  settingsAvailable: 'Disponible', settingsNotAvailable: 'No disponible',
  settingsGranted: 'Concedido', settingsDenied: 'Denegado', settingsPrompt: 'Pendiente', settingsUnknown: 'Desconocido',
  settingsMicDeniedFix: 'Acceso al micrófono denegado. Permítelo en la configuración del navegador.',
  settingsAbout: 'Acerca de y privacidad',
  settingsVersionLabel: 'Versión', settingsBuiltWith: 'Construido con',
  settingsDataStorage: 'Almacenamiento de datos', settingsOnDevice: 'Solo en el dispositivo',
  settingsNetwork: 'Solicitudes de red', settingsNone: 'Ninguna',
  settingsPrivacy: 'Sin datos enviados a servidores — todo se procesa en el dispositivo.',
  settingsLanguageSettings: 'Configuración de idioma',
  statusOnline: 'En línea', statusOffline: 'Sin conexión',
  bannerOffline: '📡 Estás sin conexión.',
  bannerWelcomeTitle: '¡Bienvenido a VoiceBridge!', bannerWelcomeText: 'Comunícate en cualquier idioma.',
  bannerWelcomeDismiss: 'Entendido',
  helpTitle: 'Cómo usar VoiceBridge',
  helpStep1: 'Paso 1: Elige tu idioma', helpStep1Text: 'Selecciona el idioma que hablas.',
  helpStep2: 'Paso 2: Elige un modo', helpStep2Text: 'Usa Voz a Texto o Texto a Voz.',
  helpStep3: 'Paso 3: Frases rápidas', helpStep3Text: 'Toca botones para comunicación instantánea.',
  helpStep4: 'Paso 4: Tu historial', helpStep4Text: 'Todos los mensajes en la pestaña Conversación.',
  helpClose: 'Cerrar',
  footerText: '🌍 VoiceBridge v2.0 • Gratis • Sin recopilación de datos',
}

BASE['fr-FR'] = {
  appName: 'VoiceBridge', appSubtitle: 'Communication Assistée', helpButton: '? Aide',
  setupTitle: 'Choisir les langues', setupSubtitle: 'Sélectionnez votre langue et la langue de sortie',
  setupStep1: 'Votre langue (DE)', setupStep1Desc: 'Sélectionnez la langue que vous parlez',
  setupStep2: 'Langue de sortie (VERS)', setupStep2Desc: 'Sélectionnez la langue de traduction',
  setupConfirm: 'Confirmer et commencer', setupCancel: 'Annuler', setupRegion: 'Région', setupShowAll: 'Tous',
  tabConversation: 'Conversation', tabWriting: 'Écrire', tabSpeaking: 'Parler', tabSettings: 'Paramètres',
  vttTitle: 'Parole à texte', vttPlaceholder: 'Vos mots apparaîtront ici…',
  vttStartListening: 'Commencer à écouter', vttStopListening: "Arrêter d'écouter",
  vttListeningLabel: '🔴 Écoute… parlez maintenant', vttIdleLabel: 'Cliquez sur le micro pour commencer',
  vttReadAloud: 'Lire à voix haute', vttCopy: 'Copier', vttClear: 'Effacer',
  ttsTitle: 'Texte à parole', ttsPlaceholder: 'Tapez quelque chose ici…',
  ttsSpeak: 'Traduire et parler', ttsStop: 'Arrêter', ttsClear: 'Effacer',
  ttsRate: 'Vitesse', ttsPitch: 'Tonalité', ttsTestVoice: 'Tester la voix',
  qpTitle: 'Phrases rapides', qpDesc: 'Appuyez pour parler instantanément',
  qpIHelp: "J'ai besoin d'aide", qpThirsty: "J'ai soif", qpWait: 'Veuillez patienter',
  qpDoctor: 'Appeler le médecin', qpPain: "J'ai mal", qpThank: 'Merci', qpSleep: 'Je veux dormir', qpHungry: "J'ai faim",
  historyTitle: 'Conversation', historyEmpty: 'Aucun message. Commencez à parler ou à taper !',
  historyDownload: 'Télécharger', historyClear: 'Tout effacer', historyClearConfirm: 'Voulez-vous vraiment tout effacer ?',
  settingsTitle: 'Paramètres', settingsAppearance: 'Apparence', settingsThemeDesc: 'Basculer entre mode sombre et clair',
  settingsDarkMode: 'Mode sombre', settingsLightMode: 'Mode clair',
  settingsAccessibility: 'Accessibilité', settingsLargeText: 'Texte et boutons grands',
  settingsLargeTextDesc: 'Augmenter la taille de la police et des boutons',
  settingsHighContrast: 'Contraste élevé', settingsHighContrastDesc: 'Mode noir et blanc',
  settingsReduceMotion: 'Réduire les animations', settingsReduceMotionDesc: 'Désactiver toutes les animations',
  settingsFontSize: 'Taille de police', settingsFontSizeDesc: 'Choisissez votre taille de lecture préférée',
  settingsFontSmall: 'Petit', settingsFontMedium: 'Moyen', settingsFontLarge: 'Grand', settingsFontXLarge: 'Très grand',
  settingsVoice: 'Paramètres vocaux', settingsSpeechRate: 'Vitesse de parole',
  settingsSpeechPitch: 'Tonalité vocale', settingsVolume: 'Volume', settingsTestVoice: 'Tester la voix',
  settingsHistory: 'Historique de conversation', settingsMessages: 'messages cette session',
  settingsDownload: 'Télécharger .txt', settingsClear: "Effacer l'historique",
  settingsCompat: 'Compatibilité navigateur',
  settingsVoiceRecog: 'Reconnaissance vocale', settingsTextSpeech: 'Synthèse vocale',
  settingsMicPerm: 'Permission micro',
  settingsAvailable: 'Disponible', settingsNotAvailable: 'Non disponible',
  settingsGranted: 'Accordé', settingsDenied: 'Refusé', settingsPrompt: 'En attente', settingsUnknown: 'Inconnu',
  settingsMicDeniedFix: 'Accès au microphone refusé. Autorisez-le dans les paramètres du navigateur.',
  settingsAbout: 'À propos et confidentialité',
  settingsVersionLabel: 'Version', settingsBuiltWith: 'Construit avec',
  settingsDataStorage: 'Stockage des données', settingsOnDevice: 'Sur appareil uniquement',
  settingsNetwork: 'Requêtes réseau', settingsNone: 'Aucune',
  settingsPrivacy: 'Aucune donnée envoyée aux serveurs — tout est traité sur votre appareil.',
  settingsLanguageSettings: 'Paramètres de langue',
  statusOnline: 'En ligne', statusOffline: 'Hors ligne',
  bannerOffline: '📡 Vous êtes hors ligne.',
  bannerWelcomeTitle: 'Bienvenue sur VoiceBridge !', bannerWelcomeText: 'Communiquez dans toutes les langues.',
  bannerWelcomeDismiss: 'Compris',
  helpTitle: 'Comment utiliser VoiceBridge',
  helpStep1: 'Étape 1 : Choisissez votre langue', helpStep1Text: 'Sélectionnez la langue que vous parlez.',
  helpStep2: 'Étape 2 : Choisissez un mode', helpStep2Text: 'Parole à texte ou texte à parole.',
  helpStep3: 'Étape 3 : Phrases rapides', helpStep3Text: 'Appuyez sur les boutons pour une communication instantanée.',
  helpStep4: 'Étape 4 : Votre historique', helpStep4Text: "Tous les messages dans l'onglet Conversation.",
  helpClose: 'Fermer',
  footerText: '🌍 VoiceBridge v2.0 • Gratuit • Aucune collecte de données',
}

BASE['zh-CN'] = {
  appName: '语音桥', appSubtitle: '辅助通讯', helpButton: '? 帮助',
  setupTitle: '选择语言', setupSubtitle: '选择您的语言和输出语言',
  setupStep1: '您的语言（从）', setupStep1Desc: '选择您说的语言',
  setupStep2: '输出语言（到）', setupStep2Desc: '选择翻译输出的语言',
  setupConfirm: '确认并开始', setupCancel: '取消', setupRegion: '地区', setupShowAll: '全部',
  tabConversation: '对话', tabWriting: '写作', tabSpeaking: '说话', tabSettings: '设置',
  vttTitle: '语音转文字', vttPlaceholder: '您的话语将显示在这里…',
  vttStartListening: '开始收听', vttStopListening: '停止收听',
  vttListeningLabel: '🔴 正在收听…现在说话', vttIdleLabel: '点击麦克风开始说话',
  vttReadAloud: '朗读', vttCopy: '复制', vttClear: '清除',
  ttsTitle: '文字转语音', ttsPlaceholder: '在此输入…',
  ttsSpeak: '翻译并朗读', ttsStop: '停止', ttsClear: '清除',
  ttsRate: '速度', ttsPitch: '音调', ttsTestVoice: '测试语音',
  qpTitle: '常用短语', qpDesc: '点击立即说话',
  qpIHelp: '我需要帮助', qpThirsty: '我渴了', qpWait: '请稍等',
  qpDoctor: '叫医生', qpPain: '我很痛', qpThank: '谢谢', qpSleep: '我想睡觉', qpHungry: '我饿了',
  historyTitle: '对话', historyEmpty: '没有消息。开始说话或输入！',
  historyDownload: '下载', historyClear: '清除全部', historyClearConfirm: '确定要清除所有消息吗？',
  settingsTitle: '设置', settingsAppearance: '外观', settingsThemeDesc: '在深色和浅色模式之间切换',
  settingsDarkMode: '深色模式', settingsLightMode: '浅色模式',
  settingsAccessibility: '无障碍', settingsLargeText: '大字体和按钮',
  settingsLargeTextDesc: '增大全应用字体和按钮大小',
  settingsHighContrast: '高对比度', settingsHighContrastDesc: '黑白模式',
  settingsReduceMotion: '减少动画', settingsReduceMotionDesc: '禁用所有动画',
  settingsFontSize: '字体大小', settingsFontSizeDesc: '选择您首选的阅读大小',
  settingsFontSmall: '小', settingsFontMedium: '中', settingsFontLarge: '大', settingsFontXLarge: '特大',
  settingsVoice: '语音设置', settingsSpeechRate: '语速', settingsSpeechPitch: '音调', settingsVolume: '音量',
  settingsTestVoice: '测试语音',
  settingsHistory: '对话历史', settingsMessages: '本次对话消息',
  settingsDownload: '下载 .txt', settingsClear: '清除历史',
  settingsCompat: '浏览器兼容性', settingsVoiceRecog: '语音识别', settingsTextSpeech: '文字转语音',
  settingsMicPerm: '麦克风权限',
  settingsAvailable: '可用', settingsNotAvailable: '不可用',
  settingsGranted: '已授权', settingsDenied: '已拒绝', settingsPrompt: '待定', settingsUnknown: '未知',
  settingsMicDeniedFix: '麦克风访问被拒绝。请在浏览器设置中允许。',
  settingsAbout: '关于和隐私',
  settingsVersionLabel: '版本', settingsBuiltWith: '构建于',
  settingsDataStorage: '数据存储', settingsOnDevice: '仅设备端',
  settingsNetwork: '网络请求', settingsNone: '无',
  settingsPrivacy: '没有数据发送到服务器 — 所有处理均在设备上完成。',
  settingsLanguageSettings: '语言设置',
  statusOnline: '在线', statusOffline: '离线',
  bannerOffline: '📡 您已离线。',
  bannerWelcomeTitle: '欢迎使用语音桥！', bannerWelcomeText: '用声音跨语言交流。',
  bannerWelcomeDismiss: '知道了',
  helpTitle: '如何使用语音桥',
  helpStep1: '第1步：选择语言', helpStep1Text: '选择您说的语言。',
  helpStep2: '第2步：选择模式', helpStep2Text: '使用语音转文字或文字转语音。',
  helpStep3: '第3步：常用短语', helpStep3Text: '点击按钮即时交流。',
  helpStep4: '第4步：您的历史', helpStep4Text: '所有消息保存在对话选项卡中。',
  helpClose: '关闭',
  footerText: '🌍 语音桥 v2.0 • 免费 • 不收集数据',
}

BASE['ja-JP'] = {
  appName: 'VoiceBridge', appSubtitle: 'アシスティブ通信', helpButton: '? ヘルプ',
  setupTitle: '言語を選択', setupSubtitle: '話す言語と出力言語を選択してください',
  setupStep1: 'あなたの言語（FROM）', setupStep1Desc: '話す言語を選択',
  setupStep2: '出力言語（TO）', setupStep2Desc: '翻訳出力の言語を選択',
  setupConfirm: '確認して開始', setupCancel: 'キャンセル', setupRegion: '地域', setupShowAll: 'すべて',
  tabConversation: '会話', tabWriting: '書く', tabSpeaking: '話す', tabSettings: '設定',
  vttTitle: '音声テキスト化', vttPlaceholder: '話した言葉がここに表示されます…',
  vttStartListening: '聞き始める', vttStopListening: '聞き終わる',
  vttListeningLabel: '🔴 聞いています…今話してください', vttIdleLabel: 'マイクをクリックして話し始める',
  vttReadAloud: '読み上げ', vttCopy: 'コピー', vttClear: 'クリア',
  ttsTitle: 'テキスト読み上げ', ttsPlaceholder: 'ここに入力…',
  ttsSpeak: '翻訳して話す', ttsStop: '停止', ttsClear: 'クリア',
  ttsRate: '速度', ttsPitch: 'ピッチ', ttsTestVoice: '音声テスト',
  qpTitle: 'クイックフレーズ', qpDesc: 'タップして即座に話す',
  qpIHelp: '助けが必要です', qpThirsty: 'のどが渇きました', qpWait: 'お待ちください',
  qpDoctor: '医者を呼んでください', qpPain: '痛いです', qpThank: 'ありがとう', qpSleep: '眠りたい', qpHungry: 'お腹が空きました',
  historyTitle: '会話', historyEmpty: 'メッセージなし。話すか入力してください！',
  historyDownload: 'ダウンロード', historyClear: 'すべて消去', historyClearConfirm: 'すべてのメッセージを消去しますか？',
  settingsTitle: '設定', settingsAppearance: '外観', settingsThemeDesc: 'ダークとライトモードの切り替え',
  settingsDarkMode: 'ダークモード', settingsLightMode: 'ライトモード',
  settingsAccessibility: 'アクセシビリティ', settingsLargeText: '大きな文字とボタン',
  settingsLargeTextDesc: 'フォントとボタンのサイズを拡大',
  settingsHighContrast: 'ハイコントラスト', settingsHighContrastDesc: '白黒モード',
  settingsReduceMotion: 'アニメーション削減', settingsReduceMotionDesc: 'すべてのアニメーションを無効化',
  settingsFontSize: 'フォントサイズ', settingsFontSizeDesc: '好みの読書サイズを選択',
  settingsFontSmall: '小', settingsFontMedium: '中', settingsFontLarge: '大', settingsFontXLarge: '特大',
  settingsVoice: '音声設定', settingsSpeechRate: '話速', settingsSpeechPitch: '音声ピッチ', settingsVolume: '音量',
  settingsTestVoice: '音声テスト',
  settingsHistory: '会話履歴', settingsMessages: 'このセッションのメッセージ',
  settingsDownload: 'ダウンロード .txt', settingsClear: '履歴を消去',
  settingsCompat: 'ブラウザ互換性', settingsVoiceRecog: '音声認識', settingsTextSpeech: 'テキスト読み上げ',
  settingsMicPerm: 'マイク許可',
  settingsAvailable: '利用可能', settingsNotAvailable: '利用不可',
  settingsGranted: '許可済み', settingsDenied: '拒否', settingsPrompt: '保留中', settingsUnknown: '不明',
  settingsMicDeniedFix: 'マイクへのアクセスが拒否されました。ブラウザの設定で許可してください。',
  settingsAbout: '情報とプライバシー',
  settingsVersionLabel: 'バージョン', settingsBuiltWith: '使用技術',
  settingsDataStorage: 'データ保存', settingsOnDevice: 'デバイスのみ',
  settingsNetwork: 'ネットワークリクエスト', settingsNone: 'なし',
  settingsPrivacy: 'サーバーへのデータ送信なし — すべての処理はデバイス上。',
  settingsLanguageSettings: '言語設定',
  statusOnline: 'オンライン', statusOffline: 'オフライン',
  bannerOffline: '📡 オフラインです。',
  bannerWelcomeTitle: 'VoiceBridgeへようこそ！', bannerWelcomeText: '言語を超えてコミュニケーション。',
  bannerWelcomeDismiss: 'わかった',
  helpTitle: 'VoiceBridgeの使い方',
  helpStep1: 'ステップ1：言語を選択', helpStep1Text: '話す言語を選択。',
  helpStep2: 'ステップ2：モードを選択', helpStep2Text: '音声テキスト化またはテキスト読み上げ。',
  helpStep3: 'ステップ3：クイックフレーズ', helpStep3Text: 'ボタンをタップして即座にコミュニケーション。',
  helpStep4: 'ステップ4：履歴', helpStep4Text: 'すべてのメッセージは会話タブに保存。',
  helpClose: '閉じる',
  footerText: '🌍 VoiceBridge v2.0 • 無料 • データ収集なし',
}

BASE['ar-SA'] = {
  appName: 'جسر الصوت', appSubtitle: 'الاتصالات المساعدة', helpButton: '? مساعدة',
  setupTitle: 'اختر اللغات', setupSubtitle: 'اختر لغتك ولغة الإخراج',
  setupStep1: 'لغتك (من)', setupStep1Desc: 'اختر اللغة التي تتحدثها',
  setupStep2: 'لغة الإخراج (إلى)', setupStep2Desc: 'اختر لغة الترجمة',
  setupConfirm: 'تأكيد وابدأ', setupCancel: 'إلغاء', setupRegion: 'المنطقة', setupShowAll: 'الكل',
  tabConversation: 'محادثة', tabWriting: 'كتابة', tabSpeaking: 'التحدث', tabSettings: 'الإعدادات',
  vttTitle: 'كلام إلى نص', vttPlaceholder: 'ستظهر كلماتك هنا…',
  vttStartListening: 'بدء الاستماع', vttStopListening: 'إيقاف الاستماع',
  vttListeningLabel: '🔴 جارٍ الاستماع… تحدث الآن', vttIdleLabel: 'انقر على الميكروفون للبدء',
  vttReadAloud: 'قراءة بصوت عالٍ', vttCopy: 'نسخ', vttClear: 'مسح',
  ttsTitle: 'نص إلى كلام', ttsPlaceholder: 'اكتب شيئاً هنا…',
  ttsSpeak: 'ترجمة وتحدث', ttsStop: 'إيقاف', ttsClear: 'مسح',
  ttsRate: 'السرعة', ttsPitch: 'النبرة', ttsTestVoice: 'اختبار الصوت',
  qpTitle: 'عبارات سريعة', qpDesc: 'اضغط للتحدث فوراً',
  qpIHelp: 'أحتاج مساعدة', qpThirsty: 'أنا عطشان', qpWait: 'انتظر من فضلك',
  qpDoctor: 'اتصل بالطبيب', qpPain: 'أنا في ألم', qpThank: 'شكراً', qpSleep: 'أريد النوم', qpHungry: 'أنا جائع',
  historyTitle: 'محادثة', historyEmpty: 'لا رسائل. ابدأ بالتحدث أو الكتابة!',
  historyDownload: 'تحميل', historyClear: 'مسح الكل', historyClearConfirm: 'هل تريد حذف جميع الرسائل؟',
  settingsTitle: 'الإعدادات', settingsAppearance: 'المظهر', settingsThemeDesc: 'التبديل بين الوضع الداكن والفاتح',
  settingsDarkMode: 'الوضع الداكن', settingsLightMode: 'الوضع الفاتح',
  settingsAccessibility: 'إمكانية الوصول', settingsLargeText: 'نص وأزرار كبيرة',
  settingsLargeTextDesc: 'زيادة حجم الخط والأزرار',
  settingsHighContrast: 'تباين عالٍ', settingsHighContrastDesc: 'وضع أبيض وأسود',
  settingsReduceMotion: 'تقليل الحركة', settingsReduceMotionDesc: 'تعطيل جميع الرسوم المتحركة',
  settingsFontSize: 'حجم الخط', settingsFontSizeDesc: 'اختر حجم القراءة المفضل',
  settingsFontSmall: 'صغير', settingsFontMedium: 'متوسط', settingsFontLarge: 'كبير', settingsFontXLarge: 'كبير جداً',
  settingsVoice: 'إعدادات الصوت', settingsSpeechRate: 'سرعة الكلام', settingsSpeechPitch: 'نبرة الصوت', settingsVolume: 'الصوت',
  settingsTestVoice: 'اختبار الصوت',
  settingsHistory: 'سجل المحادثة', settingsMessages: 'رسائل في هذه الجلسة',
  settingsDownload: 'تحميل .txt', settingsClear: 'مسح السجل',
  settingsCompat: 'توافق المتصفح', settingsVoiceRecog: 'التعرف على الصوت', settingsTextSpeech: 'تحويل النص إلى كلام',
  settingsMicPerm: 'إذن الميكروفون',
  settingsAvailable: 'متاح', settingsNotAvailable: 'غير متاح',
  settingsGranted: 'ممنوح', settingsDenied: 'مرفوض', settingsPrompt: 'معلق', settingsUnknown: 'غير معروف',
  settingsMicDeniedFix: 'تم رفض الوصول إلى الميكروفون. يرجى السماح به في إعدادات المتصفح.',
  settingsAbout: 'حول والخصوصية',
  settingsVersionLabel: 'الإصدار', settingsBuiltWith: 'مبني بـ',
  settingsDataStorage: 'تخزين البيانات', settingsOnDevice: 'على الجهاز فقط',
  settingsNetwork: 'طلبات الشبكة', settingsNone: 'لا شيء',
  settingsPrivacy: 'لا بيانات ترسل للخوادم — جميع المعالجة على الجهاز.',
  settingsLanguageSettings: 'إعدادات اللغة',
  statusOnline: 'متصل', statusOffline: 'غير متصل',
  bannerOffline: '📡 أنت غير متصل.',
  bannerWelcomeTitle: 'مرحباً بك في جسر الصوت!', bannerWelcomeText: 'تواصل عبر اللغات.',
  bannerWelcomeDismiss: 'فهمت',
  helpTitle: 'كيفية استخدام جسر الصوت',
  helpStep1: 'الخطوة 1: اختر لغتك', helpStep1Text: 'اختر اللغة التي تتحدثها.',
  helpStep2: 'الخطوة 2: اختر وضعاً', helpStep2Text: 'استخدم كلام إلى نص أو نص إلى كلام.',
  helpStep3: 'الخطوة 3: عبارات سريعة', helpStep3Text: 'اضغط الأزرار للتواصل الفوري.',
  helpStep4: 'الخطوة 4: سجلك', helpStep4Text: 'جميع الرسائل في تبويب المحادثة.',
  helpClose: 'إغلاق',
  footerText: '🌍 جسر الصوت v2.0 • مجاني • بدون جمع البيانات',
}

// Copy same translations for language variants
BASE['en-GB']  = { ...BASE['en-US'] }
BASE['es-MX']  = { ...BASE['es-ES'] }
BASE['es-AR']  = { ...BASE['es-ES'] }
BASE['ar-AE']  = { ...BASE['ar-SA'] }
BASE['pt-BR']  = { ...BASE['pt-PT'] || BASE['en-US'] }
BASE['zh-TW']  = { ...BASE['zh-CN'] }

// ─────────────────────────────────────────────────────────────────────────────
// RUNTIME AUTO-TRANSLATION for any language not manually translated
// Uses MyMemory free API. Results cached in localStorage.
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_PREFIX = 'vb_ui_t_'
const pendingTranslations = {}  // in-memory during session

async function autoTranslate(langCode) {
  // Check localStorage cache first
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + langCode)
    if (cached) return JSON.parse(cached)
  } catch {}

  // Prevent duplicate requests
  if (pendingTranslations[langCode]) return pendingTranslations[langCode]

  const base = BASE['en-US']
  const targetLang = langCode.split('-')[0]

  // Build a batch of all UI strings to translate
  const keys   = Object.keys(base)
  const values = keys.map(k => base[k])

  // MyMemory allows ~500 chars per request, so we batch carefully
  // Translate in chunks of 15 values joined by |||
  const CHUNK = 15
  const translated = { ...base }

  async function translateChunk(chunk) {
    const joined = chunk.map(v => v).join(' ||| ')
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(joined)}&langpair=en|${targetLang}`
      const res  = await fetch(url)
      const data = await res.json()
      if (data.responseStatus === 200) {
        return data.responseData.translatedText.split(' ||| ')
      }
    } catch {}
    return chunk  // fallback
  }

  const promise = (async () => {
    for (let i = 0; i < keys.length; i += CHUNK) {
      const chunkKeys   = keys.slice(i, i + CHUNK)
      const chunkValues = values.slice(i, i + CHUNK)
      const results     = await translateChunk(chunkValues)
      chunkKeys.forEach((k, idx) => {
        if (results[idx] && results[idx].trim()) {
          translated[k] = results[idx].trim()
        }
      })
    }

    // Cache in localStorage for future visits
    try {
      localStorage.setItem(CACHE_PREFIX + langCode, JSON.stringify(translated))
    } catch {}

    return translated
  })()

  pendingTranslations[langCode] = promise
  return promise
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

// Subscribers notified when auto-translation completes
const subscribers = new Set()

export function onTranslationReady(callback) {
  subscribers.add(callback)
  return () => subscribers.delete(callback)
}

/**
 * Get UI translations synchronously.
 * - For manually translated languages: returns full translations immediately.
 * - For other languages: returns English first, then triggers background
 *   auto-translation and notifies subscribers when ready.
 */
export function getT(langCode) {
  if (!langCode) return BASE['en-US']

  // Have manual translation → return it directly
  if (BASE[langCode]) return BASE[langCode]

  // Check localStorage cache synchronously
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + langCode)
    if (cached) return JSON.parse(cached)
  } catch {}

  // Trigger background auto-translation
  autoTranslate(langCode).then((result) => {
    subscribers.forEach(cb => cb(langCode, result))
  })

  // Return English as fallback while translating
  return BASE['en-US']
}

/**
 * Pre-warm translation for a language (call when user picks a language).
 * Returns a promise that resolves to the full translation object.
 */
export async function preloadTranslation(langCode) {
  if (BASE[langCode]) return BASE[langCode]
  return autoTranslate(langCode)
}

export function getAvailableLanguageCodes() {
  return Object.keys(BASE)
}

export function clearTranslationCache(langCode) {
  try {
    if (langCode) localStorage.removeItem(CACHE_PREFIX + langCode)
    else {
      Object.keys(localStorage)
        .filter(k => k.startsWith(CACHE_PREFIX))
        .forEach(k => localStorage.removeItem(k))
    }
  } catch {}
}