// lib/translate.js
// Free translation using MyMemory API — no API key required
// Supports all language codes used in VoiceBridge (e.g. "gu-IN", "hi-IN", "en-US")

/**
 * Translate text from one language to another.
 * @param {string} text       - Text to translate
 * @param {string} fromCode   - BCP-47 source language code e.g. "gu-IN"
 * @param {string} toCode     - BCP-47 target language code e.g. "hi-IN"
 * @returns {Promise<string>} - Translated text, or original text on failure
 */
export async function translateText(text, fromCode, toCode) {
  if (!text?.trim()) return text

  // If same language, no translation needed
  const fromBase = fromCode.split('-')[0]
  const toBase   = toCode.split('-')[0]
  if (fromBase === toBase) return text

  try {
    // MyMemory uses simple 2-letter codes: "gu|hi", "en|fr", etc.
    const langPair = `${fromBase}|${toBase}`
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`

    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()

    // MyMemory returns responseStatus 200 on success
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText
    }

    console.warn('Translation failed:', data.responseMessage)
    return text // fallback to original
  } catch (err) {
    console.error('translateText error:', err)
    return text // fallback to original
  }
}