import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Serve the project root so /examples/html/*.html works
  publicDir: path.resolve(__dirname, '..'),
})
