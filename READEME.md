# 🗣️ VoiceBridge — Assistive Communication App

A free, browser-based assistive communication tool that helps people who cannot
speak or hear communicate easily using Voice-to-Text and Text-to-Speech.

---

## 📁 Folder Structure

```
voicebridge/
├── components/
│   ├── LanguageSelector.js   ← Language toggle buttons
│   ├── VoiceToText.js        ← Mic → live transcript → read aloud
│   ├── TextToSpeech.js       ← Type text → speak it out
│   └── History.js            ← Session conversation log
├── hooks/
│   ├── useSpeechRecognition.js  ← Web SpeechRecognition wrapper
│   └── useSpeechSynthesis.js    ← Web SpeechSynthesis wrapper
├── pages/
│   ├── _app.js               ← Global styles loader
│   └── index.js              ← Main page (composes all components)
├── styles/
│   └── globals.css           ← All styling
├── next.config.js
├── package.json
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18 or higher (https://nodejs.org)
- npm (comes with Node.js)

### Step 1 — Install dependencies
```bash
cd voicebridge
npm install
```

### Step 2 — Start the development server
```bash
npm run dev
```

### Step 3 — Open in browser
Go to: http://localhost:3000

> ⚠️ **Important**: Voice recognition requires HTTPS in production.
> Locally on localhost it works fine without HTTPS.

---

## 🌐 How to Deploy on Vercel (Free)

### Option A — Via Vercel CLI (fastest)
```bash
npm install -g vercel
vercel
```
Follow the prompts. Your app will be live in ~60 seconds.

### Option B — Via GitHub + Vercel Dashboard
1. Push this folder to a GitHub repository
2. Go to https://vercel.com and sign in (free account)
3. Click "Add New Project" → Import your GitHub repo
4. Vercel auto-detects Next.js — just click "Deploy"
5. Your app is live at `https://your-project.vercel.app`

> Voice recognition works on Vercel because it uses HTTPS automatically ✅

---

## 🔑 Key Technologies

| Technology         | Purpose                              |
|--------------------|--------------------------------------|
| Next.js 14         | React framework, routing, SSR        |
| React 18           | UI components and state management   |
| Web SpeechRecognition API | Convert speech → text (free, browser-native) |
| Web SpeechSynthesis API   | Convert text → speech (free, browser-native) |
| CSS Custom Properties | Theming and design system        |

**No paid APIs used. Everything runs inside the browser.**

---

## 🌍 Supported Languages

| Language  | Code    | Voice Recognition | Text-to-Speech |
|-----------|---------|-------------------|----------------|
| English   | en-US   | ✅                | ✅             |
| Hindi     | hi-IN   | ✅ (Chrome)       | ✅             |
| Gujarati  | gu-IN   | ✅ (Chrome)       | ✅             |

> Hindi and Gujarati recognition work best in Google Chrome.

---

## 🌐 Browser Compatibility

| Browser            | Voice → Text | Text → Speech |
|--------------------|--------------|---------------|
| Chrome (desktop)   | ✅ Best      | ✅            |
| Edge (desktop)     | ✅ Good      | ✅            |
| Safari (iOS/Mac)   | ⚠️ Limited  | ✅            |
| Firefox            | ❌           | ✅            |

---

## 👥 Who Is This For?

- **Mute users** — type a message, the device speaks it for you
- **Deaf users** — speak nearby and have words transcribed instantly  
- **Elderly users** — large buttons, simple layout, quick phrases
- **Caregivers** — use quick phrases to communicate needs fast
- **General users** — anyone needing hands-free text or voice output

---

## 🔒 Privacy

- All speech processing happens **100% inside your browser**
- No audio is ever recorded or sent to any server
- No account, login, or signup required
- Works fully offline after the first page load (except Google Fonts)