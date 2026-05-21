import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Serve the project root so /examples/html/*.html works in dev.
  // Disabled in production: the Docker build context is docs/ only,
  // so __dirname resolves to / which would copy the entire filesystem.
  publicDir: process.env.NODE_ENV === 'production' ? false : path.resolve(__dirname, '..'),
})
