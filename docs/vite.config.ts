import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { readFileSync } from 'fs'

// Version comes from the ROOT package.json (the published design system), not docs/package.json
const pkg = JSON.parse(readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __NW_VERSION__: JSON.stringify(pkg.version),
  },
  // Dev: serve repo root so /examples/html/*.html resolves from parent.
  // Production: use docs/public/ (favicon, nightwire.css, icons) — Docker build context is now repo root.
  publicDir: process.env.NODE_ENV === 'production' ? 'public' : path.resolve(__dirname, '..'),
})
