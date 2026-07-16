/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#000000',
          warm: '#0a0a0a',
          panel: '#111111',
          raised: '#1a1a1a',
          // v2: surface tier 4 (overlays)
          surface: '#242424',
        },
        nw: {
          primary: {
            DEFAULT: '#6699ff',
            dim: '#4477cc',
            hot: '#99bbff',
          },
          green: {
            DEFAULT: '#7aed7a',
            dim: '#5cb85c',
          },
          cyan: {
            DEFAULT: '#66ddff',
            dim: '#44aacc',
          },
          red: {
            DEFAULT: '#ff6688',
            dim: '#cc4466',
            hot: '#ff99aa',
          },
          yellow: '#e8993a',
          purple: '#b266e0',
          text: {
            DEFAULT: '#ffffff',
            dim: '#aaaaaa',
            // v2: split text tier (was dim doing too much in v1)
            strong: '#ffffff',
            default: '#e6e6e6',
            mute: '#aaaaaa',
            disabled: '#5a5a5a',
            // v2.1: expose the faint/line tiers as color tokens so
            // text-/bg-/border-nw-text-{faint,line} resolve. These
            // mirror the --nw-text-faint / --nw-text-line CSS vars,
            // which previously only existed as vars + borderColor.
            faint: 'rgba(255, 255, 255, 0.06)',
            line: 'rgba(255, 255, 255, 0.12)',
          },
          // ── v2 · Semantic role aliases ──────────────────
          // Reference the role, not the color. Lets you fork
          // the palette without touching component code.
          chrome: {
            DEFAULT: '#6699ff',
            mute: '#4477cc',
            hot: '#99bbff',
          },
          data: {
            DEFAULT: '#7aed7a',
            mute: '#5cb85c',
          },
          'signal-info':  '#66ddff',
          'signal-warn':  '#e8993a',
          'signal-error': '#ff6688',
          ai: {
            DEFAULT: '#b266e0',
            mute: '#8844bb',
          },
        },
      },
      fontFamily: {
        title: ['Noto Serif Display', 'Times New Roman', 'serif'],
        sys: ['JetBrains Mono', 'Cascadia Mono', 'monospace'],
        stamp: ['Saira Extra Condensed', 'Impact', 'sans-serif'],
        mincho: ['Shippori Mincho B1', 'YuMincho', 'serif'],
      },
      fontSize: {
        'nw-xs': '11px',
        'nw-sm': '12px',
        'nw-base': '14px',
        'nw-lg': '16px',
        'nw-xl': '20px',
        'nw-2xl': '24px',
        'nw-3xl': '32px',
      },
      spacing: {
        'nw-1': '4px',
        'nw-2': '8px',
        'nw-3': '12px',
        'nw-4': '16px',
        'nw-6': '24px',
        'nw-8': '32px',
        'nw-12': '48px',
        'nw-16': '64px',
      },
      borderRadius: {
        'nw-none': '0',
        'nw-sm': '2px',
        'nw-md': '4px',
        'nw-lg': '8px',
      },
      letterSpacing: {
        'nw-tight': '-0.01em',
        'nw-wide': '0.06em',
        'nw-ultra': '0.2em',
      },
      boxShadow: {
        'glow-green': '0 0 8px rgba(122,237,122,0.5), 0 0 16px rgba(122,237,122,0.2)',
        'glow-blue': '0 0 8px rgba(102,153,255,0.5), 0 0 16px rgba(102,153,255,0.2)',
        'glow-cyan': '0 0 8px rgba(102,221,255,0.5), 0 0 16px rgba(102,221,255,0.2)',
        'glow-red': '0 0 8px rgba(255,102,136,0.5), 0 0 16px rgba(255,102,136,0.3)',
      },
      backgroundColor: {
        'nw-primary-fill': 'rgba(102, 153, 255, 0.08)',
        'nw-green-faint': 'rgba(122, 237, 122, 0.06)',
        'nw-green-fill': 'rgba(122, 237, 122, 0.1)',
        'nw-cyan-glow': 'rgba(102, 221, 255, 0.12)',
        'nw-red-fill': 'rgba(255, 102, 136, 0.15)',
      },
      borderColor: {
        'nw-faint': 'rgba(255, 255, 255, 0.06)',
        'nw-line': 'rgba(255, 255, 255, 0.12)',
        // v2: stronger line + chrome-tinted line
        'nw-line-strong': 'rgba(255, 255, 255, 0.18)',
        'nw-line-chrome': 'rgba(102, 153, 255, 0.35)',
      },
      // ── v2 · Motion vocabulary ────────────────────────────
      transitionTimingFunction: {
        'nw-tick':   'cubic-bezier(0.3, 0, 0.7, 1)',
        'nw-sweep':  'cubic-bezier(0.2, 0.8, 0.2, 1)',
        'nw-uplink': 'cubic-bezier(0, 0.6, 0.4, 1)',
      },
      transitionDuration: {
        'nw-tick':   '150ms',
        'nw-sweep':  '350ms',
        'nw-uplink': '400ms',
      },
    },
  },
};
