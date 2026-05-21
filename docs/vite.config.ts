import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Dev: serve repo root so /examples/html/*.html resolves from parent.
  // Production: use docs/public/ (favicon, nightwire.css, icons) — Docker build context is now repo root.
  publicDir: process.env.NODE_ENV === 'production' ? 'public' : path.resolve(__dirname, '..'),
})
