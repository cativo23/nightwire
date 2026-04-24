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
      },
    },
  },
};
