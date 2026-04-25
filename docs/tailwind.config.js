/** @type {import('tailwindcss').Config} */
import nightwirePreset from './tailwind.preset.js'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [nightwirePreset],
  theme: {
    extend: {},
  },
  plugins: [],
}

