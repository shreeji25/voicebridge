// pages/_app.js
import '../styles/globals.css'
import '../styles/language-setup.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}