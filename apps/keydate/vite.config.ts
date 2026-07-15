import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base ('./') keeps asset URLs relative so the same build works both
// when served from a GitHub Pages subpath (…/keydate/) and inside the Capacitor
// native WebView (served from the app bundle root).
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
})
