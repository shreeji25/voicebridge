// pages/_app.js
// This is the root wrapper for every page in Next.js.
// We import our global CSS here so it applies everywhere.

import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}