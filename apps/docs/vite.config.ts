import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { readFileSync } from 'fs'
import { docsCounts } from './build-counts.mjs'

// Version comes from the ROOT package.json (the published design system), not apps/docs/package.json
const pkg = JSON.parse(readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8'))
// Token and component counts come from tokens.json and src/components, not from the docs source.
const counts = docsCounts(path.resolve(__dirname, '../..'))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __NW_VERSION__: JSON.stringify(pkg.version),
    __NW_TOKEN_COUNT__: JSON.stringify(counts.tokens),
    __NW_COMPONENT_COUNT__: JSON.stringify(counts.components),
  },
  // The stylesheet is the repo-root build output; the docs app never keeps a copy.
  resolve: {
    alias: {
      '@nightwire/css': path.resolve(__dirname, '../../nightwire.css'),
    },
  },
  // Dev: serve the repo root so /examples/html/*.html and /nightwire.css resolve.
  // Production: apps/docs/public/ (favicon, icons); the nginx image adds /nightwire.css and /examples.
  publicDir: process.env.NODE_ENV === 'production' ? 'public' : path.resolve(__dirname, '../..'),
})
